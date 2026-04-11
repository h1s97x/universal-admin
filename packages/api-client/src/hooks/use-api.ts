'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createApiClient, type ApiClient, type ApiRequestConfig, type ApiResponse } from '../client';

export interface UseApiOptions {
  client?: ApiClient;
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  enabled?: boolean;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiState<T = unknown, D = unknown> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  response: ApiResponse<T, D> | null;
}

export interface UseApiReturn<T = unknown, D = unknown>
  extends UseApiState<T, D> {
  execute: (config?: ApiRequestConfig<D>) => Promise<ApiResponse<T, D> | null>;
  reset: () => void;
}

export interface UseQueryOptions<T = unknown, D = unknown>
  extends Omit<UseApiOptions, 'enabled' | 'onSuccess' | 'onError'> {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseQueryReturn<T = unknown, D = unknown>
  extends UseApiReturn<T, D> {
  refetch: () => Promise<ApiResponse<T, D> | null>;
  isStale: boolean;
}

export interface UseMutationOptions<T = unknown, D = unknown, V = unknown>
  extends Omit<UseApiOptions, 'enabled' | 'onSuccess' | 'onError'> {
  onMutate?: (variables: V) => void;
  onSuccess?: <T>(data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onSettled?: <T>(data: T | null, error: Error | null, variables: V) => void;
}

export interface UseMutationReturn<T = unknown, D = unknown, V = unknown>
  extends UseApiReturn<T, D> {
  mutate: (variables: V) => void;
  mutateAsync: (variables: V) => Promise<ApiResponse<T, D> | null>;
}

function useApiBase<T = unknown, D = unknown>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T, D> {
  const {
    client,
    baseUrl,
    defaultHeaders,
    onSuccess,
    onError,
  } = options;

  const apiClient = useMemo(() => {
    if (client) return client;
    return createApiClient({ baseUrl, defaultHeaders });
  }, [client, baseUrl, defaultHeaders]);

  const [state, setState] = useState<UseApiState<T, D>>({
    data: null,
    loading: false,
    error: null,
    response: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (config?: ApiRequestConfig<D>): Promise<ApiResponse<T, D> | null> => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiClient.request<T, D>(url, config);

        setState({
          data: response.data,
          loading: false,
          error: null,
          response,
        });

        onSuccess?.(response.data);
        return response;
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: error as Error,
          }));
          onError?.(error as Error);
          return null;
        }
        return null;
      }
    },
    [url, apiClient, onSuccess, onError]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      data: null,
      loading: false,
      error: null,
      response: null,
    });
  }, []);

  return { ...state, execute, reset };
}

export function useApi<T = unknown, D = unknown>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T, D> {
  const { enabled = true } = options;
  const result = useApiBase<T, D>(url, options);

  const execute = useCallback(
    async (config?: ApiRequestConfig<D>) => {
      if (!enabled) return null;
      return result.execute(config);
    },
    [enabled, result.execute]
  );

  return { ...result, execute };
}

export function useQuery<T = unknown, D = unknown>(
  url: string | null,
  options: UseQueryOptions<T, D> = {}
): UseQueryReturn<T, D> {
  const {
    refetchInterval,
    refetchOnWindowFocus = true,
    staleTime = 0,
    onSuccess,
    onError,
  } = options;

  const [isStale, setIsStale] = useState(false);
  const lastFetchTimeRef = useRef<number>(0);

  const baseOptions = useMemo(
    () => ({
      ...options,
      enabled: options.enabled !== false && url !== null,
    }),
    [options, url]
  );

  const result = useApiBase<T, D>(url || '', baseOptions);

  const refetch = useCallback(async () => {
    lastFetchTimeRef.current = Date.now();
    setIsStale(false);
    return result.execute();
  }, [result.execute]);

  // Handle refetch interval
  useEffect(() => {
    if (!refetchInterval || !url) return;

    const intervalId = setInterval(() => {
      refetch();
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, url, refetch]);

  // Handle window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !url) return;

    const handleFocus = () => {
      const timeSinceLastFetch = Date.now() - lastFetchTimeRef.current;
      if (timeSinceLastFetch > staleTime) {
        refetch();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, url, refetch, staleTime]);

  // Mark as stale after staleTime
  useEffect(() => {
    if (!result.data) return;

    const timeoutId = setTimeout(() => {
      setIsStale(true);
    }, staleTime);

    return () => clearTimeout(timeoutId);
  }, [result.data, staleTime]);

  return { ...result, refetch, isStale };
}

export function useMutation<T = unknown, D = unknown, V = unknown>(
  _url: string,
  options: UseMutationOptions<T, D, V> = {}
): UseMutationReturn<T, D, V> {
  const { onMutate, onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<UseApiState<T, D>>({
    data: null,
    loading: false,
    error: null,
    response: null,
  });

  const execute = useCallback(
    async (): Promise<ApiResponse<T, D> | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      return null;
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      response: null,
    });
  }, []);

  const mutate = useCallback(
    (_variables: V) => {
      onMutate?.(_variables);
    },
    [onMutate]
  );

  const mutateAsync = useCallback(
    async (_variables: V): Promise<ApiResponse<T, D> | null> => {
      onMutate?.(_variables);
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        // Note: Actual mutation logic should be implemented with a request function
        onSuccess?.(null as T, _variables);
        onSettled?.(null as T, null, _variables);
        return null;
      } catch (error) {
        const err = error as Error;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err,
        }));
        onError?.(err, _variables);
        onSettled?.(null, err, _variables);
        return null;
      }
    },
    [onMutate, onSuccess, onError, onSettled]
  );

  return { ...state, execute, reset, mutate, mutateAsync };
}

export function useApiClient(options?: Parameters<typeof createApiClient>[0]): ApiClient {
  return useMemo(() => createApiClient(options), [options]);
}
