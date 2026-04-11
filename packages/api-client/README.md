# @h1s97x/api-client

A type-safe, flexible HTTP API client with caching, retry, and React hooks support.

## Features

- 🌐 Full RESTful API support
- 🔄 Automatic retry mechanism
- 💾 Request caching
- ⏱️ Timeout control
- 🚫 Request cancellation
- 🔌 Interceptors (request/response/error)
- ⚛️ React Hooks integration
- 📦 Tree-shakeable

## Installation

```bash
npm install @h1s97x/api-client
# or
pnpm add @h1s97x/api-client
# or
yarn add @h1s97x/api-client
```

## Quick Start

### Basic Usage

```tsx
import { createApiClient } from '@h1s97x/api-client';

const api = createApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 30000,
  retry: 3,
});

const response = await api.get('/users');
const users = await api.post('/users', { name: 'John' });
```

### React Hooks

```tsx
import { useQuery, useMutation } from '@h1s97x/api-client';

// Query
function UserList() {
  const { data, loading, error, refetch } = useQuery('/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}

// Mutation
function CreateUser() {
  const { mutate, loading, error } = useMutation('/users');

  const handleSubmit = async (data) => {
    await mutate(data);
  };

  return <button onClick={() => handleSubmit({ name: 'John' })}>Create</button>;
}
```

## API

### createApiClient Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | `''` | Base URL for all requests |
| `defaultHeaders` | `Record<string, string>` | `{}` | Default headers |
| `timeout` | `number` | `30000` | Request timeout (ms) |
| `retry` | `number` | `0` | Number of retries on failure |
| `retryDelay` | `number` | `1000` | Delay between retries (ms) |
| `cache` | `Map` | `new Map()` | Cache storage |
| `cacheTime` | `number` | `300000` | Cache duration (ms) |
| `withCredentials` | `boolean` | `false` | Include credentials |
| `onRequest` | `function` | - | Request interceptor |
| `onResponse` | `function` | - | Response interceptor |
| `onError` | `function` | - | Error interceptor |

### Client Methods

- `get<T>(url, config?)` - GET request
- `post<T>(url, data?, config?)` - POST request
- `put<T>(url, data?, config?)` - PUT request
- `patch<T>(url, data?, config?)` - PATCH request
- `delete<T>(url, config?)` - DELETE request
- `head<T>(url, config?)` - HEAD request
- `options<T>(url, config?)` - OPTIONS request
- `request<T>(url, config?)` - Generic request

## License

MIT
