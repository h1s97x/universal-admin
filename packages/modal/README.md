# @h1s97x/modal

Accessible modal/dialog component for React applications.

## Features

- ♿ Fully accessible (ARIA compliant)
- 🎨 Beautiful animations
- 🌙 Dark mode support
- ⚡ Lightweight and performant
- 📦 Tree-shakeable

## Installation

```bash
npm install @h1s97x/modal
# or
pnpm add @h1s97x/modal
```

## Quick Start

```tsx
import { Modal } from '@h1s97x/modal';
import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal Title"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

## Components

### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Whether modal is open |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `children` | `ReactNode` | - | Modal content |
| `footer` | `ReactNode` | - | Footer buttons |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `closeOnBackdropClick` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |

### ConfirmModal

Confirmation dialog with confirm/cancel buttons.

```tsx
import { ConfirmModal } from '@h1s97x/modal';

<ConfirmModal
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={handleConfirm}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  confirmText="Delete"
  variant="danger"
/>
```

## License

MIT
