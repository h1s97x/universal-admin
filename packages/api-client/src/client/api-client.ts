import type {
  ApiClient,
  ApiClientOptions,
  ApiError,
  ApiRequestConfig,
  ApiResponse,
  CacheEntry,
  HttpMethod,
} from './types';

function buildUrl(baseUrl: string, url: string, params?: Record<string, string | number | boolean | undefined>): string {
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  if (!params) return fullUrl;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${queryString}` : fullUrl;
}

function parseHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiClientImpl implements ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;
  private retry: number;
  private retryDelay: number;
  private cache: Map<string, CacheEntry>;
  private cacheTime: number;
  private withCredentials: boolean;
  private onRequest?: ApiClientOptions['onRequest'];
  private onResponse?: ApiClientOptions['onResponse'];
  private onError?: ApiClientOptions['onError'];
  private abortControllers: Map<string, AbortController>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '';
    this.headers = options.defaultHeaders ?? {};
    this.timeout = options.timeout ?? 30000;
    this.retry = options.retry ?? 0;
    this.retryDelay = options.retryDelay ?? 1000;
    this.cache = options.cache ?? new Map();
    this.cacheTime = options.cacheTime ?? 5 * 60 * 1000; // 5 minutes
    this.withCredentials = options.withCredentials ?? false;
    this.onRequest = options.onRequest;
    this.onResponse = options.onResponse;
    this.onError = options.onError;
    this.abortControllers = new Map();
  }

  private async fetch<T, D>(url: string, config: ApiRequestConfig<D> = {}): Promise<ApiResponse<T, D>> {
    const {
      method = 'GET',
      headers = {},
      params,
      data,
      timeout = this.timeout,
      retry = this.retry,
      retryDelay = this.retryDelay,
      cache = false,
      cacheTime = this.cacheTime,
    } = config;

    const requestId = `${method}:${url}:${JSON.stringify(params)}`;
    
    // Check cache for GET requests
    if (method === 'GET' && cache) {
      const cached = this.cache.get(requestId);
      if (cached && cached.expiry > Date.now()) {
        return cached.data as ApiResponse<T, D>;
      }
    }

    // Build URL with params
    const fullUrl = buildUrl(this.baseUrl, url, params as Record<string, string | number | boolean | undefined>);

    // Merge headers
    const mergedHeaders: Record<string, string> = {
      ...this.headers,
      ...headers,
    };

    // Set default content type for requests with body
    if (data && !mergedHeaders['Content-Type'] && !mergedHeaders['content-type']) {
      mergedHeaders['Content-Type'] = 'application/json';
    }

    // Build request init
    let requestInit: RequestInit = {
      method,
      headers: mergedHeaders,
      credentials: this.withCredentials ? 'include' : 'same-origin',
    };

    // Add body for non-GET requests
    if (method !== 'GET' && method !== 'HEAD' && data !== undefined) {
      requestInit.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    // Apply request interceptor
    if (this.onRequest) {
      const intercepted = await this.onRequest({ ...requestInit, url: fullUrl });
      requestInit = { ...requestInit, ...intercepted };
    }

    // Create abort controller
    const abortController = new AbortController();
    this.abortControllers.set(requestId, abortController);
    requestInit.signal = abortController.signal;

    // Set timeout
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, timeout);

    try {
      let response = await fetch(fullUrl, requestInit);
      clearTimeout(timeoutId);

      // Apply response interceptor
      if (this.onResponse) {
        response = await this.onResponse(response);
      }

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData: D | undefined;
        try {
          errorData = await response.json();
        } catch {
          try {
            errorData = await response.text() as unknown as D;
          } catch {
            // Ignore parsing errors
          }
        }

        const error: ApiError<D> = new Error(response.statusText || `HTTP ${response.status}`) as ApiError<D>;
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = errorData;
        error.config = config;

        // Retry on 5xx errors
        if (response.status >= 500 && retry > 0) {
          await delay(retryDelay);
          return this.fetch<T, D>(url, { ...config, retry: retry - 1, retryDelay });
        }

        // Apply error interceptor
        if (this.onError) {
          throw await this.onError(error);
        }
        throw error;
      }

      // Parse response
      let responseData: T;
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType.includes('text/')) {
        responseData = await response.text() as unknown as T;
      } else {
        responseData = await response.blob() as unknown as T;
      }

      const result: ApiResponse<T, D> = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: parseHeaders(response.headers),
        config,
      };

      // Cache successful GET responses
      if (method === 'GET' && cache) {
        this.cache.set(requestId, {
          data: result,
          expiry: Date.now() + cacheTime,
        });
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const apiError: ApiError<D> = new Error('Request was aborted') as ApiError<D>;
          apiError.isAborted = true;
          apiError.config = config;
          throw apiError;
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          const networkError: ApiError<D> = new Error('Network error') as ApiError<D>;
          networkError.isNetworkError = true;
          networkError.config = config;

          // Retry on network errors
          if (retry > 0) {
            await delay(retryDelay);
            return this.fetch<T, D>(url, { ...config, retry: retry - 1, retryDelay });
          }

          if (this.onError) {
            throw await this.onError(networkError);
          }
          throw networkError;
        }

        const apiError = error as ApiError<D>;
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          apiError.isTimeout = true;
        }
        apiError.config = config;

        if (this.onError) {
          throw await this.onError(apiError);
        }
        throw apiError;
      }

      throw error;
    } finally {
      this.abortControllers.delete(requestId);
    }
  }

  async request<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, config);
  }

  async get<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'GET' });
  }

  async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'POST', data });
  }

  async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'PUT', data });
  }

  async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'PATCH', data });
  }

  async delete<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'DELETE' });
  }

  async head<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'HEAD' });
  }

  async options<T = unknown, D = unknown>(
    url: string,
    config?: ApiRequestConfig<D>
  ): Promise<ApiResponse<T, D>> {
    return this.fetch<T, D>(url, { ...config, method: 'OPTIONS' });
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  removeHeader(key: string): this {
    delete this.headers[key];
    return this;
  }

  clearCache(): void {
    this.cache.clear();
  }

  abort(requestId?: string): void {
    if (requestId) {
      const controller = this.abortControllers.get(requestId);
      if (controller) {
        controller.abort();
      }
    } else {
      this.abortControllers.forEach((controller) => {
        controller.abort();
      });
    }
  }
}

export function createApiClient(options: ApiClientOptions = {}): ApiClient {
  return new ApiClientImpl(options);
}
