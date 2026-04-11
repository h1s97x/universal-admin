/**
 * RBAC Core Types
 * 
 * Type definitions extracted from production banking system,
 * generalized for universal use across different projects.
 */

/**
 * Permission action types
 */
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

/**
 * Permission definition
 * Represents a single permission check
 */
export interface Permission {
  /** Resource identifier (e.g., 'user', 'organization', 'report') */
  resource: string;
  /** Action to perform on the resource */
  action: PermissionAction;
  /** Optional field-level permission */
  field?: string;
}

/**
 * Permission string format: 'resource:action' or 'resource:action:field'
 * Example: 'user:read', 'user:update:email', 'organization:manage'
 */
export type PermissionString = string;

/**
 * Role definition
 * A role contains a set of permissions
 */
export interface Role {
  /** Unique role identifier */
  id: string;
  /** Human-readable role name */
  name: string;
  /** Set of permissions granted to this role */
  permissions: Permission[];
  /** Parent role ID for inheritance (optional) */
  parentId?: string;
  /** Role description */
  description?: string;
}

/**
 * User with role-based access
 */
export interface RoleUser {
  /** Unique user identifier */
  id: string;
  /** User's assigned roles */
  roles: string[];
  /** Direct permissions (not through roles) */
  permissions?: Permission[];
  /** Custom data */
  [key: string]: unknown;
}

/**
 * Simple role definition with permission strings
 * More convenient for configuration
 */
export interface SimpleRole {
  id: string;
  name: string;
  permissions: PermissionString[];
  parentId?: string;
  description?: string;
}

/**
 * Permission check options
 */
export interface CheckOptions {
  /** Throw error if permission denied */
  throwOnDeny?: boolean;
  /** Custom error message */
  errorMessage?: string;
}

/**
 * RBAC engine configuration
 */
export interface RBACConfig {
  /** Initial roles to register */
  roles?: Role[];
  /** Enable role inheritance */
  enableInheritance?: boolean;
  /** Enable wildcard permissions (e.g., '*' grants all) */
  enableWildcards?: boolean;
}

/**
 * Default role templates
 * Pre-defined roles for common use cases
 */
export const DEFAULT_ROLES: Record<string, SimpleRole> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Administrator',
    permissions: ['*:manage'],
    description: 'Full system access',
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    permissions: ['user:manage', 'organization:manage', 'report:read'],
    parentId: 'user',
    description: 'Administrative access',
  },
  user: {
    id: 'user',
    name: 'User',
    permissions: ['task:manage', 'profile:manage'],
    description: 'Standard user access',
  },
  guest: {
    id: 'guest',
    name: 'Guest',
    permissions: ['profile:read'],
    description: 'Read-only access',
  },
};

/**
 * Role level constants (higher = more permissions)
 */
export const ROLE_LEVELS: Record<string, number> = {
  super_admin: 100,
  admin: 50,
  user: 10,
  guest: 1,
};
