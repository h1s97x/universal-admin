/**
 * @h1s97x/rbac - Enterprise RBAC Permission System
 * 
 * A production-tested RBAC system extracted from banking applications.
 * 
 * @example
 * ```typescript
 * import { RBACEngine, RBACProvider, usePermission } from '@h1s97x/rbac';
 * 
 * const engine = new RBACEngine();
 * engine.defineRole({
 *   id: 'admin',
 *   name: 'Administrator',
 *   permissions: [
 *     { resource: 'user', action: 'manage' },
 *     { resource: 'report', action: 'read' },
 *   ],
 * });
 * 
 * function App() {
 *   return (
 *     <RBACProvider engine={engine} user={currentUser}>
 *       <AdminPanel />
 *     </RBACProvider>
 *   );
 * }
 * ```
 */

// Types
export type {
  Permission,
  PermissionString,
  Role,
  RoleUser,
  SimpleRole,
  PermissionAction,
  CheckOptions,
  RBACConfig,
} from './types';

export {
  DEFAULT_ROLES,
  ROLE_LEVELS,
} from './types';

// Engine
export {
  RBACEngine,
  createDefaultEngine,
  parsePermissionString,
  permissionToString,
} from './engine';

// React integration
export {
  RBACProvider,
  useRBACUser,
  useRBACEngine,
  usePermission,
  usePermissionsAll,
  usePermissionsAny,
  useIsRole,
  useHasAnyRole,
  useHasRoleLevel,
  useEffectivePermissions,
  PermissionGuard,
  RoleGuard,
  IfPermission,
  IfRole,
  withPermission,
  createRBAC,
  createRBACProviderProps,
} from './react';

export type {
  RBACProviderProps,
  PermissionGuardProps,
  RoleGuardProps,
} from './react';
