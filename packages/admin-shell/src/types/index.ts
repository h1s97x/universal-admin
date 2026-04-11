/**
 * Admin Shell Types
 */

import { ReactNode } from 'react';

/**
 * Menu item configuration
 */
export interface MenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component name (lucide-react) */
  icon?: string;
  /** Navigation path */
  href?: string;
  /** Child items (for submenus) */
  children?: MenuItem[];
  /** Permission required to access */
  permission?: string;
  /** Badge text (e.g., notification count) */
  badge?: string | number;
  /** Disabled state */
  disabled?: boolean;
  /** External link */
  external?: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Stat card data
 */
export interface StatCardData {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

/**
 * User info for header
 */
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

/**
 * Admin shell configuration
 */
export interface AdminShellConfig {
  /** Application title */
  title: string;
  /** Logo component or URL */
  logo?: ReactNode;
  /** Navigation menu items */
  menuItems: MenuItem[];
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];
  /** User info for display */
  user?: UserInfo | null;
  /** Callback when user clicks logout */
  onLogout?: () => void;
  /** Additional header actions */
  headerActions?: ReactNode;
  /** Theme color */
  themeColor?: string;
}

/**
 * Admin layout slot names
 */
export type AdminLayoutSlot = 
  | 'header'
  | 'sidebar'
  | 'breadcrumb'
  | 'content'
  | 'footer';
