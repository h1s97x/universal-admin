# @h1s97x/notify

A flexible, beautiful notification/toast system for React applications.

## Features

- 🔔 5 notification types: success, error, warning, info, loading
- 🌙 Dark mode support
- ⚡️ Lightweight and performant
- 🎨 Tailwind CSS animations
- 🔗 React Context API + Hooks API
- 📦 Tree-shakeable

## Installation

```bash
npm install @h1s97x/notify
# or
pnpm add @h1s97x/notify
# or
yarn add @h1s97x/notify
```

## Quick Start

```tsx
import { NotifyProvider, useNotify, NotifyContainer } from '@h1s97x/notify';
import '@h1s97x/notify/dist/index.css';

function App() {
  return (
    <NotifyProvider>
      <YourApp />
      <NotifyContainer />
    </NotifyProvider>
  );
}

function YourComponent() {
  const { success, error, warning, info } = useNotify();

  return (
    <button onClick={() => success('Operation completed!')}>
      Show Success
    </button>
  );
}
```

## API

### NotifyProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxNotifications` | `number` | `5` | Maximum notifications to display |
| `defaultDuration` | `number` | `3000` | Default auto-close duration (ms) |

### useNotify

```tsx
const {
  notifications,  // Current notifications array
  notify,         // Show notification with options
  success,        // Show success notification
  error,          // Show error notification
  warning,        // Show warning notification
  info,           // Show info notification
  loading,        // Show loading notification
  remove,         // Remove notification by id
  removeAll,      // Remove all notifications
  update,         // Update notification by id
} = useNotify();
```

### NotifyOptions

```tsx
{
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}
```

## License

MIT
