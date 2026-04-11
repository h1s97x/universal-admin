import { useState, useCallback } from 'react';
import { NotifyProvider, useNotify, NotifyContainer } from '@h1s97x/notify';
import { createApiClient, useQuery, useMutation } from '@h1s97x/api-client';
import { AdminLayout, ThemeProvider } from '@h1s97x/admin-shell';

// Create API client
const api = createApiClient({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

function DemoContent() {
  const { success, error, warning, info, loading } = useNotify();
  const [count, setCount] = useState(0);

  // Example query
  const { data: users, loading: usersLoading, refetch } = useQuery('/users');
  
  // Example mutation
  const mutation = useMutation('/posts', {
    onSuccess: () => success('Post created successfully!'),
    onError: () => error('Failed to create post'),
  });

  const handleSuccess = useCallback(() => {
    success('Operation completed successfully!');
  }, [success]);

  const handleError = useCallback(() => {
    error('Something went wrong!');
  }, [error]);

  const handleWarning = useCallback(() => {
    warning('Please be careful!');
  }, [warning]);

  const handleInfo = useCallback(() => {
    info('Here is some useful information.');
  }, [info]);

  const handleLoading = useCallback(() => {
    loading('Loading data, please wait...');
    setTimeout(() => success('Data loaded!'), 2000);
  }, [loading, success]);

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">@h1s97x/universal-ui Demo</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A collection of reusable React components and utilities
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PackageCard
          title="@h1s97x/notify"
          description="Toast notifications"
          color="bg-green-500"
        />
        <PackageCard
          title="@h1s97x/api-client"
          description="HTTP client with hooks"
          color="bg-blue-500"
        />
        <PackageCard
          title="@h1s97x/admin-shell"
          description="Admin dashboard layout"
          color="bg-purple-500"
        />
        <PackageCard
          title="@h1s97x/rbac"
          description="Permission system"
          color="bg-orange-500"
        />
      </div>

      {/* Notify Demo */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Notify Demo</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSuccess}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Success
          </button>
          <button
            onClick={handleError}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Error
          </button>
          <button
            onClick={handleWarning}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Warning
          </button>
          <button
            onClick={handleInfo}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Info
          </button>
          <button
            onClick={handleLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Loading
          </button>
        </div>
      </section>

      {/* API Client Demo */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">API Client Demo</h3>
        <div className="space-y-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {usersLoading ? 'Loading...' : 'Fetch Users'}
          </button>
          <p className="text-sm text-gray-500">Users count: {count}</p>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Increment ({count})
          </button>
        </div>
        {users && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-60 overflow-auto">
            <pre className="text-xs">{JSON.stringify(users, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}

function PackageCard({ title, description, color }: { title: string; description: string; color: string }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className={`w-2 h-2 rounded-full ${color} mb-2`} />
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export default function App() {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'home' },
    { name: 'Users', href: '/users', icon: 'users' },
    { name: 'Settings', href: '/settings', icon: 'cog' },
  ];

  const user = {
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: undefined,
  };

  return (
    <ThemeProvider defaultTheme="system">
      <NotifyProvider defaultDuration={3000}>
        <AdminLayout navigation={navigation} user={user}>
          <DemoContent />
        </AdminLayout>
        <NotifyContainer position="top-right" />
      </NotifyProvider>
    </ThemeProvider>
  );
}
