// Client
export { createApiClient, ApiClientImpl } from './client/api-client';
export type {
  ApiClient,
  ApiClientOptions,
  ApiError,
  ApiRequestConfig,
  ApiResponse,
  CacheEntry,
  HttpMethod,
  ApiFetchFunction,
} from './client/types';

// Hooks
export {
  useApi,
  useQuery,
  useMutation,
  useApiClient,
  type UseApiOptions,
  type UseApiState,
  type UseApiReturn,
  type UseQueryOptions,
  type UseQueryReturn,
  type UseMutationOptions,
  type UseMutationReturn,
} from './hooks';
