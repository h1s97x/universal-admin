# @cogitant/universal-admin

> Enterprise-grade React component library for building admin dashboards

[![CI](https://github.com/h1s97x/universal-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/h1s97x/universal-admin/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@cogitant/rbac)](https://www.npmjs.com/package/@cogitant/rbac)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@cogitant/rbac` | ![npm](https://img.shields.io/npm/v/@cogitant/rbac) | Enterprise RBAC permission system with React hooks |
| `@cogitant/admin-shell` | ![npm](https://img.shields.io/npm/v/@cogitant/admin-shell) | Admin dashboard layout shell |
| `@cogitant/api-client` | ![npm](https://img.shields.io/npm/v/@cogitant/api-client) | Type-safe API client with caching and retry |
| `@cogitant/notify` | ![npm](https://img.shields.io/npm/v/@cogitant/notify) | Notification and toast system |

## Features

- **Monorepo Architecture** - Built with pnpm workspaces and Turborepo
- **TypeScript First** - Full TypeScript support with type definitions
- **Tree-shakeable** - ESM modules with sideEffects: false
- **Zero Runtime Dependencies** - No external runtime dependencies
- **Test Coverage** - Comprehensive unit tests with Vitest

## Quick Start

### Installation

```bash
# Install the package you need
pnpm add @cogitant/rbac
pnpm add @cogitant/admin-shell
pnpm add @cogitant/api-client
pnpm add @cogitant/notify
```

### Usage

#### RBAC

```tsx
import { PermissionGuard, usePermission } from '@cogitant/rbac/react';

// Define permissions
const permissions = {
  user: ['read', 'write', 'delete'],
  admin: ['read', 'write', 'delete', 'manage'],
};

// Check permission in component
function Dashboard() {
  const canAccess = usePermission('admin', 'delete');
  
  if (!canAccess) {
    return <AccessDenied />;
  }
  
  return <AdminPanel />;
}

// Protect routes
<PermissionGuard permissions={permissions} require="admin:manage">
  <Settings />
</PermissionGuard>
```

#### Admin Shell

```tsx
import { AdminLayout, Sidebar, Header } from '@cogitant/admin-shell';

function App() {
  return (
    <AdminLayout
      sidebar={<Sidebar menuItems={menuItems} />}
      header={<Header title="Dashboard" />}
    >
      <main>{children}</main>
    </AdminLayout>
  );
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint
```

## Project Structure

```
h1s97x-universal/
├── packages/
│   ├── rbac/           # @cogitant/rbac
│   ├── admin-shell/    # @cogitant/admin-shell
│   ├── api-client/     # @cogitant/api-client
│   └── notify/         # @cogitant/notify
└── apps/
    └── demo/           # Demo application
```

## Contributing

Contributions are welcome! Please read our contributing guide before submitting PRs.

## License

MIT © [cogitant](https://github.com/cogitant)

---

Made with ❤️ by the cogitant team
