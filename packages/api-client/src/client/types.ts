export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequestConfig<D = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  data?: D;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTime?: number;
}

export interface ApiResponse<T = unknown, D = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: ApiRequestConfig<D>;
}

export interface ApiError<D = unknown> extends Error {
  status?: number;
  statusText?: string;
  data?: D;
  config?: ApiRequestConfig<D>;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  isAborted?: boolean;
}

export interface ApiClientOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
  cache?: Map<string, { data: unknown; expiry: number }>;
  cacheTime?: number;
  withCredentials?: boolean;
  onRequest?: (config: RequestInit & { url: string }) => RequestInit | Promise<RequestInit>;
  onResponse?: <T>(response: Response) => Response | Promise<Response>;
  onError?: <T>(error: ApiError) => ApiError | Promise<ApiError>;
}

export interface CacheEntry<T = unknown> {
  data: T;
  expiry: number;
}

export type ApiFetchFunction = <T = unknown, D = unknown>(
  url: string,
  config?: ApiRequestConfig<D>
) => Promise<ApiResponse<T, D>>;

export interface ApiClient {
  get: <T = unknown, D = unknown>(url: string, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  post: <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  put: <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  patch: <T = unknown, D = unknown>(url: string, data?: D, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  delete: <T = unknown, D = unknown>(url: string, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  head: <T = unknown, D = unknown>(url: string, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  options: <T = unknown, D = unknown>(url: string, config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D>>;
  request: ApiFetchFunction;
  setHeader: (key: string, value: string) => ApiClient;
  setHeaders: (headers: Record<string, string>) => ApiClient;
  removeHeader: (key: string) => ApiClient;
  clearCache: () => void;
  abort: (requestId?: string) => void;
}
