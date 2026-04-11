import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function generateId(): string {
  return `notify_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
