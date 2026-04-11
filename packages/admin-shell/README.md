# @h1s97x/admin-shell

A flexible, beautifully designed admin dashboard shell with sidebar navigation, header, and dark mode support.

## Features

- 📊 Sidebar navigation with icons
- 🎨 Dark mode support
- ⚡️ Built with Radix UI primitives
- 🎯 TypeScript first
- 📦 Tree-shakeable

## Installation

```bash
npm install @h1s97x/admin-shell
# or
pnpm add @h1s97x/admin-shell
# or
yarn add @h1s97x/admin-shell
```

## Quick Start

```tsx
import { AdminLayout, ThemeProvider } from '@h1s97x/admin-shell';

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'home' },
  { name: 'Users', href: '/users', icon: 'users' },
  { name: 'Settings', href: '/settings', icon: 'cog' },
];

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AdminLayout
        navigation={navigation}
        user={{
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/avatar.jpg',
        }}
      >
        <YourContent />
      </AdminLayout>
    </ThemeProvider>
  );
}
```

## Components

### AdminLayout

Main layout component with sidebar and header.

| Prop | Type | Description |
|------|------|-------------|
| `navigation` | `NavigationItem[]` | Navigation items |
| `user` | `User` | Current user info |
| `children` | `ReactNode` | Main content |

### ThemeProvider

Provider for dark mode management.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTheme` | `'light' \| 'dark' \| 'system'` | `'system'` | Default theme |
| `storageKey` | `string` | `'admin-shell-theme'` | LocalStorage key |

## License

MIT
