import { type ClassValue, clsx } from 'clsx';

export type { ClassValue };

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Validation types
export type ValidationRule<T = unknown> = {
  validate: (value: T) => boolean | string;
  message?: string;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Form field state
export interface FormFieldState {
  value: unknown;
  error: string | null;
  touched: boolean;
}

// Form state
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Form options
export interface FormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}
