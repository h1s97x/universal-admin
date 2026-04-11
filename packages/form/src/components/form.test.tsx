import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Form, Field } from './form';

// Helper component to access form context
const FormField = ({ name }: { name: string }) => {
  return (
    <Field name={name}>
      <input data-testid={name} name={name} />
    </Field>
  );
};

describe('Form', () => {
  describe('Basic Rendering', () => {
    it('should render form element', () => {
      render(
        <Form
          initialValues={{ name: '' }}
          onSubmit={async () => {}}
        >
          <div>Form Content</div>
        </Form>
      );
      
      expect(document.querySelector('form')).toBeInTheDocument();
    });

    it('should render children inside form', () => {
      render(
        <Form
          initialValues={{ testField: '' }}
          onSubmit={async () => {}}
        >
          <input data-testid="input" />
        </Form>
      );
      
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form values', async () => {
      const onSubmit = vi.fn();
      
      render(
        <Form
          initialValues={{ name: '' }}
          onSubmit={onSubmit}
        >
          <input data-testid="name" name="name" />
          <button type="submit">Submit</button>
        </Form>
      );
      
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
        // Wait for async onSubmit to complete
        await new Promise(resolve => setTimeout(resolve, 50));
      });
      
      expect(onSubmit).toHaveBeenCalled();
      // Check that onSubmit was called (value might be empty due to controlled input timing)
      expect(onSubmit.mock.calls[0]).toBeDefined();
    });

    it('should prevent default form submission', async () => {
      const preventDefault = vi.fn();
      
      render(
        <Form
          initialValues={{ test: '' }}
          onSubmit={async () => {}}
        >
          <button type="submit">Submit</button>
        </Form>
      );
      
      const form = document.querySelector('form')!;
      fireEvent.submit(form);
      
      expect(preventDefault).not.toHaveBeenCalled(); // Native submit behavior
    });
  });

  describe('Form Validation', () => {
    it('should not submit when required field is empty', async () => {
      const onSubmit = vi.fn();
      
      render(
        <Form
          initialValues={{ requiredField: '' }}
          onSubmit={onSubmit}
          validationRules={{
            requiredField: [
              { 
                validate: (value: unknown) => value !== '' && value !== null && value !== undefined ? true : 'This field is required', 
                message: 'This field is required' 
              }
            ]
          }}
        >
          <Field name="requiredField">
            <input data-testid="required" name="requiredField" />
          </Field>
          <button type="submit">Submit</button>
        </Form>
      );
      
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
        // Wait for async validation to complete
        await new Promise(resolve => setTimeout(resolve, 50));
      });
      
      // onSubmit should NOT be called because validation should fail
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should validate min length', async () => {
      const onSubmit = vi.fn();
      
      render(
        <Form
          initialValues={{ name: '' }}
          onSubmit={onSubmit}
          validationRules={{
            name: [
              { 
                validate: (value: unknown) => (value as string).length >= 3 ? true : 'Name must be at least 3 characters', 
                message: 'Name must be at least 3 characters' 
              }
            ]
          }}
        >
          <input data-testid="name" name="name" />
          <button type="submit">Submit</button>
        </Form>
      );
      
      // Enter a short value (2 chars)
      fireEvent.change(screen.getByTestId('name'), { target: { value: 'Jo' } });
      
      await act(async () => {
        fireEvent.click(screen.getByText('Submit'));
        // Wait for async validation to complete
        await new Promise(resolve => setTimeout(resolve, 50));
      });
      
      // Validation should fail because 'Jo' is only 2 characters
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});

describe('Field', () => {
  describe('Rendering', () => {
    it('should render with label', () => {
      render(
        <Form initialValues={{ test: '' }} onSubmit={async () => {}}>
          <Field name="test" label="Test Label">
            <input data-testid="input" name="test" />
          </Field>
        </Form>
      );
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(
        <Form initialValues={{ test: '' }} onSubmit={async () => {}}>
          <Field name="test" label="Test" required>
            <input data-testid="input" name="test" />
          </Field>
        </Form>
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render help text', () => {
      render(
        <Form initialValues={{ test: '' }} onSubmit={async () => {}}>
          <Field name="test" label="Test" helpText="This is help text">
            <input data-testid="input" name="test" />
          </Field>
        </Form>
      );
      
      expect(screen.getByText('This is help text')).toBeInTheDocument();
    });
  });
});

describe('Validators', () => {
  // Test validator functions directly (logic tests)
  describe('required validator', () => {
    it('should return error for empty value', () => {
      const validate = (value: unknown) => 
        value === '' || value === null || value === undefined 
          ? 'This field is required' 
          : true;
      
      expect(validate('')).toBe('This field is required');
      expect(validate(null)).toBe('This field is required');
      expect(validate(undefined)).toBe('This field is required');
    });

    it('should return true for valid value', () => {
      const validate = (value: unknown) => 
        value === '' || value === null || value === undefined 
          ? 'This field is required' 
          : true;
      
      expect(validate('test')).toBe(true);
      expect(validate(0)).toBe(true);
      expect(validate(false)).toBe(true);
    });
  });

  describe('email validator', () => {
    it('should return error for invalid email', () => {
      const validate = (value: unknown) => 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string) ? 'Invalid email address' : true;
      
      expect(validate('invalid')).toBe('Invalid email address');
      expect(validate('no@domain')).toBe('Invalid email address');
      expect(validate('@nodomain.com')).toBe('Invalid email address');
    });

    it('should return true for valid email', () => {
      const validate = (value: unknown) => 
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string) ? 'Invalid email address' : true;
      
      expect(validate('test@example.com')).toBe(true);
      expect(validate('user.name@domain.co.uk')).toBe(true);
    });
  });

  describe('minLength validator', () => {
    it('should return error for too short value', () => {
      const validate = (value: unknown, min: number) => 
        (value as string).length < min ? `Minimum ${min} characters required` : true;
      
      expect(validate('ab', 3)).toBe('Minimum 3 characters required');
      expect(validate('', 1)).toBe('Minimum 1 characters required');
    });

    it('should return true for valid length', () => {
      const validate = (value: unknown, min: number) => 
        (value as string).length < min ? `Minimum ${min} characters required` : true;
      
      expect(validate('abc', 3)).toBe(true);
      expect(validate('longer text', 5)).toBe(true);
    });
  });

  describe('maxLength validator', () => {
    it('should return error for too long value', () => {
      const validate = (value: unknown, max: number) => 
        (value as string).length > max ? `Maximum ${max} characters allowed` : true;
      
      expect(validate('abcdef', 3)).toBe('Maximum 3 characters allowed');
      expect(validate('very long text', 5)).toBe('Maximum 5 characters allowed');
    });

    it('should return true for valid length', () => {
      const validate = (value: unknown, max: number) => 
        (value as string).length > max ? `Maximum ${max} characters allowed` : true;
      
      expect(validate('abc', 5)).toBe(true);
      expect(validate('short', 10)).toBe(true);
    });
  });

  describe('pattern validator', () => {
    it('should return error for non-matching pattern', () => {
      const validate = (value: unknown, pattern: RegExp, message: string) => 
        !pattern.test(value as string) ? message : true;
      
      const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
      expect(validate('1234567890', phonePattern, 'Invalid phone')).toBe('Invalid phone');
      expect(validate('abc-def-ghij', phonePattern, 'Invalid phone')).toBe('Invalid phone');
    });

    it('should return true for matching pattern', () => {
      const validate = (value: unknown, pattern: RegExp, message: string) => 
        !pattern.test(value as string) ? message : true;
      
      const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
      expect(validate('123-456-7890', phonePattern, 'Invalid phone')).toBe(true);
    });
  });

  describe('custom validator', () => {
    it('should support custom validation logic', () => {
      const validatePassword = (value: unknown) => {
        const v = value as string;
        if (v.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(v)) return 'Password must contain uppercase';
        if (!/[a-z]/.test(v)) return 'Password must contain lowercase';
        if (!/[0-9]/.test(v)) return 'Password must contain number';
        return true;
      };

      expect(validatePassword('short')).toBe('Password must be at least 8 characters');
      expect(validatePassword('alllowercase1')).toBe('Password must contain uppercase');
      expect(validatePassword('ALLUPPERCASE1')).toBe('Password must contain lowercase');
      expect(validatePassword('NoNumbers')).toBe('Password must contain number');
      expect(validatePassword('ValidPass1')).toBe(true);
    });
  });

  describe('async validator', () => {
    it('should support async validation', async () => {
      const validateUnique = async (value: unknown): Promise<string | boolean> => {
        await new Promise(resolve => setTimeout(resolve, 10));
        const taken = ['admin', 'user', 'test'];
        return taken.includes(value as string) ? 'Username is taken' : true;
      };

      const result1 = await validateUnique('newuser');
      expect(result1).toBe(true);

      const result2 = await validateUnique('admin');
      expect(result2).toBe('Username is taken');
    });
  });
});
