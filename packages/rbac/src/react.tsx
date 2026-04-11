/**
 * RBAC React Integration
 * 
 * React hooks and components for using RBAC in React applications.
 */

import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  ComponentType,
} from 'react';
import { RBACEngine } from './engine';
import type { RoleUser, Permission, PermissionString, SimpleRole } from './types';

// ============================================================================
// Context
// ============================================================================

interface RBACContextValue {
  engine: RBACEngine;
  user: RoleUser | null;
}

const RBACContext = createContext<RBACContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export interface RBACProviderProps {
  /** RBAC engine instance */
  engine: RBACEngine;
  /** Current user */
  user: RoleUser | null;
  /** Child components */
  children: ReactNode;
}

/**
 * RBAC Provider
 * Must wrap your application to enable permission checks
 */
export function RBACProvider({ engine, user, children }: RBACProviderProps) {
  const value = useMemo(() => ({ engine, user }), [engine, user]);

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Get current user from RBAC context
 */
export function useRBACUser(): RoleUser | null {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBACUser must be used within RBACProvider');
  }
  return context.user;
}

/**
 * Get RBAC engine instance
 */
export function useRBACEngine(): RBACEngine {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBACEngine must be used within RBACProvider');
  }
  return context.engine;
}

/**
 * Check if user has a specific permission
 */
export function usePermission(permission: Permission | PermissionString): boolean {
  const { engine, user } = useContext(RBACContext) ?? {};
  
  if (!engine || !user) {
    return false;
  }

  return useMemo(() => engine.check(user, permission), [engine, user, permission]);
}

/**
 * Check multiple permissions (AND)
 */
export function usePermissionsAll(
  permissions: (Permission | PermissionString)[]
): boolean {
  const { engine, user } = useContext(RBACContext) ?? {};

  if (!engine || !user) {
    return false;
  }

  return useMemo(() => engine.checkAll(user, permissions), [engine, user, permissions]);
}

/**
 * Check multiple permissions (OR)
 */
export function usePermissionsAny(
  permissions: (Permission | PermissionString)[]
): boolean {
  const { engine, user } = useContext(RBACContext) ?? {};

  if (!engine || !user) {
    return false;
  }

  return useMemo(() => engine.checkAny(user, permissions), [engine, user, permissions]);
}

/**
 * Check if user has a specific role
 */
export function useIsRole(roleId: string): boolean {
  const { engine, user } = useContext(RBACContext) ?? {};

  if (!engine || !user) {
    return false;
  }

  return useMemo(() => engine.isRole(user, roleId), [engine, user, roleId]);
}

/**
 * Check if user has any of the specified roles
 */
export function useHasAnyRole(roleIds: string[]): boolean {
  const { engine, user } = useContext(RBACContext) ?? {};

  if (!engine || !user) {
    return false;
  }

  return useMemo(() => engine.hasAnyRole(user, roleIds), [engine, user, roleIds]);
}

/**
 * Check if user has minimum role level
 */
export function useHasRoleLevel(level: number): boolean {
  const { engine, user } = useContext(RBACContext) ?? {};

  if (!engine || !user) {
    return false;
  }

  return useMemo(() => engine.hasRoleLevel(user, level), [engine, user, level]);
}

/**
 * Get all effective permissions for current user
 */
export function useEffectivePermissions(): Permission[] {
  const { engine, user } = useContext(RBACContext) ?? {};

  if (!engine || !user) {
    return [];
  }

  return useMemo(() => engine.getUserPermissions(user), [engine, user]);
}

// ============================================================================
// Components
// ============================================================================

export interface PermissionGuardProps {
  /** Permission to check */
  permission: Permission | PermissionString;
  /** Content to render if permission granted */
  children: ReactNode;
  /** Fallback if permission denied */
  fallback?: ReactNode;
  /** Action on permission denied */
  onDeny?: () => void;
}

/**
 * Permission Guard Component
 * Renders children only if user has the required permission
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
  onDeny,
}: PermissionGuardProps) {
  const hasPermission = usePermission(permission);

  if (!hasPermission && onDeny) {
    onDeny();
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Role Guard Component
 * Renders children only if user has the required role
 */
export interface RoleGuardProps {
  /** Role ID to check */
  roleId: string;
  /** Content to render if role matched */
  children: ReactNode;
  /** Fallback if role not matched */
  fallback?: ReactNode;
}

/**
 * Role Guard Component
 */
export function RoleGuard({ roleId, children, fallback = null }: RoleGuardProps) {
  const isRole = useIsRole(roleId);
  return isRole ? <>{children}</> : <>{fallback}</>;
}

/**
 * Conditional render based on permission
 */
export function IfPermission({
  permission,
  children,
  fallback,
}: {
  permission: Permission | PermissionString;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Conditional render based on role
 */
export function IfRole({
  roleId,
  children,
  fallback,
}: {
  roleId: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard roleId={roleId} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * Higher-Order Component for permission checking
 * @deprecated Use PermissionGuard instead
 */
export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  permission: Permission | PermissionString
) {
  return function PermissionWrapper(props: P) {
    const hasPermission = usePermission(permission);

    if (!hasPermission) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// ============================================================================
// Builder Helpers
// ============================================================================

export interface CreateRBACOptions {
  /** Simple role definitions */
  roles: SimpleRole[];
  /** Initial user (optional) */
  user?: RoleUser | null;
}

/**
 * Create a configured RBAC engine with simple role definitions
 */
export function createRBAC(options: CreateRBACOptions): RBACEngine {
  const engine = new RBACEngine({
    enableInheritance: true,
    enableWildcards: true,
  });

  options.roles.forEach((role) => engine.defineSimpleRole(role));

  return engine;
}

/**
 * Create RBAC provider props from user and roles
 */
export function createRBACProviderProps(
  user: RoleUser | null,
  roles: SimpleRole[]
): Omit<RBACProviderProps, 'children'> {
  return {
    engine: createRBAC({ roles }),
    user,
  };
}
