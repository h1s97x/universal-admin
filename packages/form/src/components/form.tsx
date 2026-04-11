'use client';

import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { cn } from '../types';

type FormAction<T> =
  | { type: 'SET_VALUE'; field: keyof T; value: unknown }
  | { type: 'SET_ERROR'; field: keyof T; error: string | null }
  | { type: 'SET_TOUCHED'; field: keyof T; touched: boolean }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET'; values: T }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> };

type FormReducerState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
};

function formReducer<T extends Record<string, unknown>>(
  state: FormReducerState<T>,
  action: FormAction<T>
): FormReducerState<T> {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: action.touched },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'RESET':
      return {
        values: action.values,
        errors: {} as Partial<Record<keyof T, string>>,
        touched: {} as Partial<Record<keyof T, boolean>>,
        isSubmitting: false,
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    default:
      return state;
  }
}

function validateField(
  value: unknown,
  rules?: { validate: (value: unknown) => boolean | string; message?: string }[]
): string | null {
  if (!rules || rules.length === 0) return null;

  for (const rule of rules) {
    const result = rule.validate(value);
    if (result !== true) {
      return typeof result === 'string' ? result : rule.message || 'Invalid value';
    }
  }
  return null;
}

export interface FormContextValue<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setValue: (field: keyof T, value: unknown) => void;
  setTouched: (field: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: (values?: T) => void;
  validate: () => boolean;
}

const FormContext = createContext<FormContextValue<Record<string, unknown>> | null>(null);

export interface FormProps<T extends Record<string, unknown>> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void> | void;
  validationRules?: {
    [K in keyof T]?: { validate: (value: T[K]) => boolean | string; message?: string }[];
  };
  children: ReactNode;
  className?: string;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function Form<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validationRules,
  children,
  className,
  validateOnChange = true,
  validateOnBlur = true,
}: FormProps<T>) {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {} as Partial<Record<keyof T, string>>,
    touched: {} as Partial<Record<keyof T, boolean>>,
    isSubmitting: false,
  } as FormReducerState<T>);

  const formRef = useRef<HTMLFormElement>(null);

  const setValue = useCallback(
    (field: keyof T, value: unknown) => {
      dispatch({ type: 'SET_VALUE', field, value });
      
      if (validateOnChange && state.touched[field]) {
        const error = validateField(value, validationRules?.[field] as { validate: (value: unknown) => boolean | string; message?: string }[] | undefined);
        dispatch({ type: 'SET_ERROR', field, error });
      }
    },
    [validateOnChange, state.touched, validationRules]
  );

  const setTouched = useCallback(
    (field: keyof T) => {
      dispatch({ type: 'SET_TOUCHED', field, touched: true });
      
      if (validateOnBlur) {
        const error = validateField(
          state.values[field],
          validationRules?.[field] as { validate: (value: unknown) => boolean | string; message?: string }[] | undefined
        );
        dispatch({ type: 'SET_ERROR', field, error });
      }
    },
    [validateOnBlur, state.values, validationRules]
  );

  const validate = useCallback((): boolean => {
    const errors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field of Object.keys(initialValues) as (keyof T)[]) {
      const error = validateField(
        state.values[field],
        validationRules?.[field] as { validate: (value: unknown) => boolean | string; message?: string }[] | undefined
      );
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }

    dispatch({ type: 'SET_ERRORS', errors });
    return isValid;
  }, [initialValues, state.values, validationRules]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Touch all fields
      for (const field of Object.keys(initialValues) as (keyof T)[]) {
        dispatch({ type: 'SET_TOUCHED', field, touched: true });
      }

      if (!validate()) return;

      dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
      
      try {
        await onSubmit(state.values);
      } finally {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
      }
    },
    [initialValues, validate, onSubmit, state.values]
  );

  const reset = useCallback((values?: T) => {
    dispatch({ type: 'RESET', values: values || initialValues });
  }, [initialValues]);

  const contextValue = useMemo(
    () => ({
      values: state.values,
      errors: state.errors,
      touched: state.touched,
      isSubmitting: state.isSubmitting,
      setValue: setValue as (field: keyof T, value: unknown) => void,
      setTouched: setTouched as (field: keyof T) => void,
      handleSubmit,
      reset,
      validate,
    }),
    [state, setValue, setTouched, handleSubmit, reset, validate]
  );

  const contextValueTyped = contextValue as unknown as FormContextValue<Record<string, unknown>>;

  return (
    <FormContext.Provider value={contextValueTyped}>
      <form ref={formRef} onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export interface FieldProps {
  name: string;
  label?: string;
  helpText?: string;
  required?: boolean;
  error?: string | null;
  children: ReactNode;
  className?: string;
}

export const Field: FC<FieldProps> = ({
  name,
  label,
  helpText,
  required,
  error,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div>{children}</div>
      {helpText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

// Common validation rules
export const validators = {
  required: (message = 'This field is required'): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (value === null || value === undefined || value === '') return message;
      if (Array.isArray(value) && value.length === 0) return message;
      return true;
    },
  }),
  
  minLength: (min: number, message?: string): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (typeof value === 'string' && value.length >= min) return true;
      if (Array.isArray(value) && value.length >= min) return true;
      return message || `Minimum length is ${min}`;
    },
  }),
  
  maxLength: (max: number, message?: string): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (typeof value === 'string' && value.length <= max) return true;
      if (Array.isArray(value) && value.length <= max) return true;
      return message || `Maximum length is ${max}`;
    },
  }),
  
  email: (message = 'Invalid email address'): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || message;
    },
  }),
  
  pattern: (regex: RegExp, message = 'Invalid format'): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return true;
      return regex.test(value) || message;
    },
  }),
  
  min: (min: number, message?: string): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (typeof value !== 'number') return true;
      return value >= min || message || `Minimum value is ${min}`;
    },
  }),
  
  max: (max: number, message?: string): { validate: (value: unknown) => boolean | string } => ({
    validate: (value: unknown) => {
      if (typeof value !== 'number') return true;
      return value <= max || message || `Maximum value is ${max}`;
    },
  }),
};
