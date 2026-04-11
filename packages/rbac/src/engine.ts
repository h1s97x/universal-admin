/**
 * RBAC Engine
 * 
 * Core permission checking engine extracted from production banking system.
 * Supports role inheritance, field-level permissions, and wildcard matching.
 */

import {
  Permission,
  PermissionString,
  Role,
  RoleUser,
  RBACConfig,
  CheckOptions,
  SimpleRole,
} from './types';

/**
 * Parse permission string to Permission object
 * @example 'user:read' -> { resource: 'user', action: 'read' }
 * @example 'user:update:email' -> { resource: 'user', action: 'update', field: 'email' }
 */
export function parsePermissionString(permStr: string): Permission {
  const parts = permStr.split(':');
  const resource = parts[0];
  const action = parts[1] as Permission['action'];
  const field = parts[2];

  if (!resource || !action) {
    throw new Error(`Invalid permission string: ${permStr}`);
  }

  return { resource, action, field };
}

/**
 * Convert Permission object to string
 */
export function permissionToString(perm: Permission): PermissionString {
  if (perm.field) {
    return `${perm.resource}:${perm.action}:${perm.field}`;
  }
  return `${perm.resource}:${perm.action}`;
}

/**
 * RBAC Engine class
 * Main entry point for permission checking
 */
export class RBACEngine {
  private roles = new Map<string, Role>();
  private config: Required<RBACConfig>;

  constructor(config: RBACConfig = {}) {
    this.config = {
      roles: config.roles || [],
      enableInheritance: config.enableInheritance ?? true,
      enableWildcards: config.enableWildcards ?? true,
    };

    // Register initial roles
    this.config.roles.forEach((role) => this.defineRole(role));
  }

  /**
   * Define a new role
   */
  defineRole(role: Role): void {
    this.roles.set(role.id, { ...role });
  }

  /**
   * Define role from simple format
   */
  defineSimpleRole(role: SimpleRole): void {
    const fullRole: Role = {
      id: role.id,
      name: role.name,
      description: role.description,
      parentId: role.parentId,
      permissions: role.permissions.map(parsePermissionString),
    };
    this.defineRole(fullRole);
  }

  /**
   * Remove a role
   */
  removeRole(roleId: string): boolean {
    return this.roles.delete(roleId);
  }

  /**
   * Get a role by ID
   */
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  /**
   * Get all defined roles
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Check if user has a specific permission
   */
  check(user: RoleUser, permission: Permission | PermissionString, options?: CheckOptions): boolean {
    const perm = typeof permission === 'string' ? parsePermissionString(permission) : permission;
    
    // Check direct permissions
    if (this.checkDirectPermission(user, perm)) {
      return true;
    }

    // Check role permissions with inheritance
    for (const roleId of user.roles) {
      if (this.checkRolePermission(roleId, perm, new Set())) {
        return true;
      }
    }

    // Check wildcard permissions
    if (this.config.enableWildcards && this.checkWildcardPermission(user, perm)) {
      return true;
    }

    if (options?.throwOnDeny) {
      throw new Error(options.errorMessage || `Permission denied: ${permissionToString(perm)}`);
    }

    return false;
  }

  /**
   * Check multiple permissions (AND logic - all must pass)
   */
  checkAll(user: RoleUser, permissions: (Permission | PermissionString)[]): boolean {
    return permissions.every((perm) => this.check(user, perm));
  }

  /**
   * Check multiple permissions (OR logic - at least one must pass)
   */
  checkAny(user: RoleUser, permissions: (Permission | PermissionString)[]): boolean {
    return permissions.some((perm) => this.check(user, perm));
  }

  /**
   * Filter data based on user's permissions
   * Returns a new object with only fields the user can access
   */
  filterFields<T extends object>(
    user: RoleUser,
    data: T,
    resource: string,
    action: string = 'read'
  ): Partial<T> {
    const result: Partial<T> = {};
    
    for (const key of Object.keys(data) as (keyof T)[]) {
      const field = key as string;
      const canAccess = this.check(user, {
        resource,
        action: action as Permission['action'],
        field,
      });

      if (canAccess) {
        result[key] = data[key];
      }
    }

    return result;
  }

  /**
   * Check if user has at least the specified role level
   */
  hasRoleLevel(user: RoleUser, requiredLevel: number): boolean {
    const userLevels = user.roles
      .map((roleId) => {
        const role = this.roles.get(roleId);
        return role ? this.getEffectiveLevel(role) : 0;
      })
      .filter((level) => level > 0);

    return userLevels.length > 0 && Math.max(...userLevels) >= requiredLevel;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: RoleUser, roleIds: string[]): boolean {
    return user.roles.some((roleId) => roleIds.includes(roleId));
  }

  /**
   * Check if user is a specific role
   */
  isRole(user: RoleUser, roleId: string): boolean {
    return user.roles.includes(roleId);
  }

  /**
   * Get all permissions for a user (including inherited)
   */
  getUserPermissions(user: RoleUser): Permission[] {
    const permissions = new Set<Permission>();

    // Add direct permissions
    user.permissions?.forEach((p) => permissions.add(p));

    // Add role permissions with inheritance
    for (const roleId of user.roles) {
      const role = this.roles.get(roleId);
      if (role) {
        this.collectRolePermissions(role, permissions, new Set());
      }
    }

    return Array.from(permissions);
  }

  /**
   * Serialize engine state for storage
   */
  serialize(): string {
    return JSON.stringify(Array.from(this.roles.values()));
  }

  /**
   * Load engine state from storage
   */
  static deserialize(data: string): RBACEngine {
    const roles = JSON.parse(data) as Role[];
    return new RBACEngine({ roles });
  }

  // Private methods

  private checkDirectPermission(user: RoleUser, perm: Permission): boolean {
    return user.permissions?.some((p) => this.matchPermission(p, perm)) ?? false;
  }

  private checkRolePermission(roleId: string, perm: Permission, visited: Set<string>): boolean {
    if (visited.has(roleId)) return false;
    visited.add(roleId);

    const role = this.roles.get(roleId);
    if (!role) return false;

    // Check current role permissions
    if (role.permissions.some((p) => this.matchPermission(p, perm))) {
      return true;
    }

    // Recursively check parent role
    if (this.config.enableInheritance && role.parentId) {
      return this.checkRolePermission(role.parentId, perm, visited);
    }

    return false;
  }

  private checkWildcardPermission(user: RoleUser, perm: Permission): boolean {
    // Check if user has wildcard permission for this resource or all resources
    const wildcards: Permission[] = [
      { resource: '*', action: 'manage' },
      { resource: perm.resource, action: 'manage' },
    ];

    for (const roleId of user.roles) {
      const role = this.roles.get(roleId);
      if (role?.permissions.some((p) => wildcards.some((w) => this.matchPermission(p, w)))) {
        return true;
      }
    }

    return false;
  }

  private matchPermission(granted: Permission, required: Permission): boolean {
    // Wildcard matching
    if (granted.action === 'manage') return true;
    if (granted.resource === '*') return true;

    // Exact resource and action match
    if (granted.resource !== required.resource) return false;
    if (granted.action !== required.action) return false;

    // Field-level check
    if (required.field) {
      return !granted.field || granted.field === required.field || granted.field === '*';
    }

    return true;
  }

  private getEffectiveLevel(role: Role): number {
    if (role.permissions.some((p) => p.resource === '*' && p.action === 'manage')) {
      return 100;
    }
    
    // Recursively get parent level
    if (this.config.enableInheritance && role.parentId) {
      const parent = this.roles.get(role.parentId);
      if (parent) {
        return this.getEffectiveLevel(parent) + 1;
      }
    }

    return 1;
  }

  private collectRolePermissions(
    role: Role,
    permissions: Set<Permission>,
    visited: Set<string>
  ): void {
    if (visited.has(role.id)) return;
    visited.add(role.id);

    role.permissions.forEach((p) => permissions.add(p));

    if (this.config.enableInheritance && role.parentId) {
      const parent = this.roles.get(role.parentId);
      if (parent) {
        this.collectRolePermissions(parent, permissions, visited);
      }
    }
  }
}

/**
 * Create a pre-configured RBAC engine with default roles
 */
export function createDefaultEngine(): RBACEngine {
  const engine = new RBACEngine({ enableInheritance: true, enableWildcards: true });

  // Register default roles
  engine.defineRole({
    id: 'super_admin',
    name: 'Super Administrator',
    permissions: [{ resource: '*', action: 'manage' }],
    description: 'Full system access',
  });

  engine.defineRole({
    id: 'admin',
    name: 'Administrator',
    permissions: [
      { resource: 'user', action: 'manage' },
      { resource: 'organization', action: 'manage' },
      { resource: 'report', action: 'read' },
    ],
    parentId: 'user',
    description: 'Administrative access',
  });

  engine.defineRole({
    id: 'user',
    name: 'User',
    permissions: [
      { resource: 'task', action: 'manage' },
      { resource: 'profile', action: 'manage' },
    ],
    description: 'Standard user access',
  });

  engine.defineRole({
    id: 'guest',
    name: 'Guest',
    permissions: [{ resource: 'profile', action: 'read' }],
    description: 'Read-only access',
  });

  return engine;
}
