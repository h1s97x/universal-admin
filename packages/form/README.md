# @h1s97x/form

Flexible form handling for React with built-in validation.

## Features

- ✅ Built-in validation rules
- ⚛️ React hooks API
- 🎨 Tailwind CSS styled components
- 🌙 Dark mode support
- 📦 Tree-shakeable

## Installation

```bash
npm install @h1s97x/form
# or
pnpm add @h1s97x/form
```

## Quick Start

```tsx
import { Form, Field, validators } from '@h1s97x/form';

function LoginForm() {
  return (
    <Form
      initialValues={{ email: '', password: '' }}
      validationRules={{
        email: [validators.required(), validators.email()],
        password: [validators.required(), validators.minLength(6)],
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="email" label="Email" required>
        <input type="email" name="email" className="input" />
      </Field>
      <Field name="password" label="Password" required>
        <input type="password" name="password" className="input" />
      </Field>
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Components

### Form

| Prop | Type | Description |
|------|------|-------------|
| `initialValues` | `T` | Initial form values |
| `onSubmit` | `(values: T) => void` | Submit handler |
| `validationRules` | `ValidationRules<T>` | Field validation rules |
| `children` | `ReactNode` | Form content |

### Field

Wrapper for form fields with label and error display.

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name |
| `label` | `string` | Field label |
| `required` | `boolean` | Required indicator |
| `helpText` | `string` | Help text below field |
| `error` | `string` | Error message |

## Validators

```tsx
import { validators } from '@h1s97x/form';

const rules = {
  email: [validators.required(), validators.email()],
  password: [validators.required(), validators.minLength(8), validators.maxLength(20)],
  age: [validators.required(), validators.min(18), validators.max(100)],
  phone: [validators.pattern(/^\d{10}$/, 'Invalid phone number')],
};
```

Available validators:
- `validators.required(message?)`
- `validators.minLength(min, message?)`
- `validators.maxLength(max, message?)`
- `validators.email(message?)`
- `validators.pattern(regex, message?)`
- `validators.min(value, message?)`
- `validators.max(value, message?)`

## License

MIT
