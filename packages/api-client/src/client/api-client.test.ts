import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createApiClient } from './api-client';

function createMockResponse(data: unknown, options: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  contentType?: string;
} = {}) {
  const {
    ok = true,
    status = 200,
    statusText = 'OK',
    contentType = 'application/json',
  } = options;

  const headersMap = new Map();
  if (contentType) {
    // Set both uppercase and lowercase versions
    headersMap.set('Content-Type', contentType);
    headersMap.set('content-type', contentType);
  }

  const mockResponse = {
    ok,
    status,
    statusText,
    headers: {
      get: (name: string) => headersMap.get(name) || headersMap.get(name.toLowerCase()) || headersMap.get(name.toUpperCase()) || null,
      forEach: (fn: (value: string, key: string) => void) => {
        headersMap.forEach((value, key) => fn(value, key));
      },
    },
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    blob: vi.fn().mockResolvedValue(new Blob([JSON.stringify(data)], { type: 'application/json' })),
  } as unknown as Response;

  return mockResponse;
}

describe('ApiClient', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    mockFetch = vi.fn();
    globalThis.fetch = mockFetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('createApiClient', () => {
    it('should create an api client instance', () => {
      const client = createApiClient();
      expect(client).toBeDefined();
      expect(client.get).toBeDefined();
      expect(client.post).toBeDefined();
      expect(client.put).toBeDefined();
      expect(client.patch).toBeDefined();
      expect(client.delete).toBeDefined();
    });

    it('should set baseUrl', async () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      
      mockFetch.mockResolvedValueOnce(createMockResponse({ data: 'test' }));

      await client.get('/users');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.example.com'),
        expect.any(Object)
      );
    });
  });

  describe('request methods', () => {
    let client: ReturnType<typeof createApiClient>;

    beforeEach(() => {
      client = createApiClient();
    });

    it('should make GET request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1 }));

      const response = await client.get('/users/1');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({ method: 'GET' })
      );
      expect(response.data).toEqual({ id: 1 });
    });

    it('should make POST request with data', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1, name: 'John' }, { status: 201, statusText: 'Created' }));

      const response = await client.post('/users', { name: 'John' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({ 
          method: 'POST',
          body: JSON.stringify({ name: 'John' })
        })
      );
      expect(response.data).toEqual({ id: 1, name: 'John' });
    });

    it('should make PUT request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1, name: 'Jane' }));

      await client.put('/users/1', { name: 'Jane' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should make PATCH request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 1, name: 'Jane' }));

      await client.patch('/users/1', { name: 'Jane' });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should make DELETE request', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, { status: 204, statusText: 'No Content', contentType: '' }));

      await client.delete('/users/1');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('headers', () => {
    it('should set default headers', async () => {
      const client = createApiClient({
        defaultHeaders: { 'Authorization': 'Bearer token' }
      });
      
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      await client.get('/users');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ 'Authorization': 'Bearer token' })
        })
      );
    });

    it('should set header', () => {
      const client = createApiClient();
      const result = client.setHeader('X-Custom', 'value');
      expect(result).toBe(client);
    });

    it('should set multiple headers', () => {
      const client = createApiClient();
      const result = client.setHeaders({ 'X-Header-1': 'value1', 'X-Header-2': 'value2' });
      expect(result).toBe(client);
    });

    it('should remove header', () => {
      const client = createApiClient({
        defaultHeaders: { 'X-Test': 'value' }
      });
      const result = client.removeHeader('X-Test');
      expect(result).toBe(client);
    });
  });

  describe('error handling', () => {
    it('should throw error on non-2xx response', async () => {
      const client = createApiClient();
      
      mockFetch.mockResolvedValueOnce(createMockResponse(
        { error: 'Not found' },
        { ok: false, status: 404, statusText: 'Not Found' }
      ));

      await expect(client.get('/users/999')).rejects.toThrow();
    });

    it('should include error details', async () => {
      const client = createApiClient();
      
      mockFetch.mockResolvedValueOnce(createMockResponse(
        { message: 'Server error' },
        { ok: false, status: 500, statusText: 'Internal Server Error' }
      ));

      try {
        await client.get('/api/error');
      } catch (error: any) {
        expect(error.status).toBe(500);
        expect(error.data).toEqual({ message: 'Server error' });
      }
    });
  });

  describe('cache', () => {
    it('should cache GET requests', async () => {
      const client = createApiClient({ cacheTime: 1000 });
      
      mockFetch.mockResolvedValue(createMockResponse({ cached: true }));

      const response1 = await client.get('/cached', { cache: true });
      const response2 = await client.get('/cached', { cache: true });
      
      expect(response1.data).toEqual({ cached: true });
      expect(response2.data).toEqual({ cached: true });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should clear cache', () => {
      const client = createApiClient();
      client.clearCache();
    });
  });
});
