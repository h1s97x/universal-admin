# @h1s97x/rbac

> Enterprise RBAC permission system with React hooks support, extracted from production banking applications.

## Features

- **Role Inheritance** - Roles can extend other roles
- **Field-level Permissions** - Fine-grained access control at the field level
- **Wildcard Support** - `*:manage` grants full access
- **React Hooks** - First-class React integration
- **TypeScript First** - Full type safety
- **Lightweight** - No external dependencies

## Installation

```bash
npm install @h1s97x/rbac
# or
pnpm add @h1s97x/rbac
```

## Quick Start

### 1. Create RBAC Engine

```typescript
import { RBACEngine } from '@h1s97x/rbac';

const engine = new RBACEngine({
  enableInheritance: true,
  enableWildcards: true,
});

// Define roles
engine.defineRole({
  id: 'admin',
  name: 'Administrator',
  permissions: [
    { resource: 'user', action: 'manage' },
    { resource: 'organization', action: 'manage' },
  ],
});

engine.defineRole({
  id: 'user',
  name: 'User',
  permissions: [
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'update' },
  ],
  parentId: 'guest', // Inherit from guest
});
```

### 2. Wrap Your App

```typescript
import { RBACProvider } from '@h1s97x/rbac/react';

function App() {
  return (
    <RBACProvider engine={engine} user={currentUser}>
      {children}
    </RBACProvider>
  );
}
```

### 3. Use Permission Hooks

```typescript
import { usePermission, PermissionGuard, IfPermission } from '@h1s97x/rbac/react';

// Hook usage
function AdminButton() {
  const canManage = usePermission('user:manage');
  
  if (canManage) {
    return <button>Manage Users</button>;
  }
  return null;
}

// Component usage
function Dashboard() {
  return (
    <div>
      <PermissionGuard permission="report:read" fallback={<p>No access</p>}>
        <ReportChart />
      </PermissionGuard>
      
      <IfPermission permission="admin:manage">
        <AdminPanel />
      </IfPermission>
    </div>
  );
}
```

## API Reference

### RBACEngine

```typescript
// Check permission
engine.check(user, 'user:read'); // boolean

// Check multiple (AND)
engine.checkAll(user, ['user:read', 'user:update']);

// Check multiple (OR)
engine.checkAny(user, ['admin', 'user:manage']);

// Field-level filtering
const filteredData = engine.filterFields(user, data, 'user', 'read');

// Role checks
engine.isRole(user, 'admin');
engine.hasRoleLevel(user, 50);
```

### Permission Strings

```
user:read           → { resource: 'user', action: 'read' }
user:update:email   → { resource: 'user', action: 'update', field: 'email' }
*:manage            → wildcard, grants full access
```

## Default Roles

The package includes common role templates:

```typescript
import { createDefaultEngine } from '@h1s97x/rbac';

const engine = createDefaultEngine();
// Creates: super_admin, admin, user, guest
```

## License

MIT
