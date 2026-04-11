/**
 * RBAC Engine Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RBACEngine, parsePermissionString } from '../src/engine';
import type { RoleUser, Role, Permission } from '../src/types';

describe('RBACEngine', () => {
  let engine: RBACEngine;

  beforeEach(() => {
    engine = new RBACEngine({
      enableInheritance: true,
      enableWildcards: true,
    });
  });

  describe('defineRole', () => {
    it('should define a role with permissions', () => {
      engine.defineRole({
        id: 'admin',
        name: 'Administrator',
        permissions: [
          { resource: 'user', action: 'read' },
          { resource: 'user', action: 'write' },
        ],
      });

      const role = engine.getRole('admin');
      expect(role).toBeDefined();
      expect(role?.name).toBe('Administrator');
      expect(role?.permissions).toHaveLength(2);
    });

    it('should define a role with parent', () => {
      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [{ resource: 'profile', action: 'read' }],
      });

      engine.defineRole({
        id: 'editor',
        name: 'Editor',
        permissions: [{ resource: 'article', action: 'write' }],
        parentId: 'user',
      });

      const editorRole = engine.getRole('editor');
      expect(editorRole?.parentId).toBe('user');
    });
  });

  describe('check', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'admin',
        name: 'Admin',
        permissions: [{ resource: 'user', action: 'manage' }],
      });

      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [
          { resource: 'profile', action: 'read' },
          { resource: 'profile', action: 'update' },
        ],
      });
    });

    it('should check direct role permission', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      expect(engine.check(user, { resource: 'profile', action: 'read' })).toBe(true);
      expect(engine.check(user, { resource: 'profile', action: 'delete' })).toBe(false);
    });

    it('should check direct user permissions', () => {
      const user: RoleUser = {
        id: '1',
        roles: [],
        permissions: [{ resource: 'special', action: 'read' }],
      };

      expect(engine.check(user, { resource: 'special', action: 'read' })).toBe(true);
    });

    it('should support permission string format', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      expect(engine.check(user, 'profile:read')).toBe(true);
      expect(engine.check(user, 'profile:delete')).toBe(false);
    });

    it('should support wildcard permissions', () => {
      engine.defineRole({
        id: 'superadmin',
        name: 'Super Admin',
        permissions: [{ resource: '*', action: 'manage' }],
      });

      const superAdmin: RoleUser = { id: '1', roles: ['superadmin'] };

      expect(engine.check(superAdmin, { resource: 'any', action: 'read' })).toBe(true);
      expect(engine.check(superAdmin, { resource: 'user', action: 'delete' })).toBe(true);
      expect(engine.check(superAdmin, { resource: 'anything', action: 'manage' })).toBe(true);
    });
  });

  describe('role inheritance', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'guest',
        name: 'Guest',
        permissions: [{ resource: 'public', action: 'read' }],
      });

      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [{ resource: 'profile', action: 'update' }],
        parentId: 'guest',
      });

      engine.defineRole({
        id: 'admin',
        name: 'Admin',
        permissions: [{ resource: 'system', action: 'config' }],
        parentId: 'user',
      });
    });

    it('should inherit permissions from parent role', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      // Own permission
      expect(engine.check(user, { resource: 'profile', action: 'update' })).toBe(true);
      // Inherited from parent
      expect(engine.check(user, { resource: 'public', action: 'read' })).toBe(true);
    });

    it('should inherit permissions through multiple levels', () => {
      const admin: RoleUser = { id: '1', roles: ['admin'] };

      // Own permission
      expect(engine.check(admin, { resource: 'system', action: 'config' })).toBe(true);
      // Inherited from parent
      expect(engine.check(admin, { resource: 'profile', action: 'update' })).toBe(true);
      // Inherited from grandparent
      expect(engine.check(admin, { resource: 'public', action: 'read' })).toBe(true);
    });

    it('should prevent circular inheritance', () => {
      engine.defineRole({
        id: 'a',
        name: 'A',
        permissions: [{ resource: 'a', action: 'read' }],
        parentId: 'b',
      });

      engine.defineRole({
        id: 'b',
        name: 'B',
        permissions: [{ resource: 'b', action: 'read' }],
        parentId: 'a',
      });

      const userA: RoleUser = { id: '1', roles: ['a'] };

      // Should not crash and should check without infinite loop
      expect(engine.check(userA, { resource: 'a', action: 'read' })).toBe(true);
    });
  });

  describe('checkAll', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [
          { resource: 'a', action: 'read' },
          { resource: 'b', action: 'read' },
          { resource: 'c', action: 'read' },
        ],
      });
    });

    it('should return true when all permissions are granted', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      expect(
        engine.checkAll(user, [
          { resource: 'a', action: 'read' },
          { resource: 'b', action: 'read' },
        ])
      ).toBe(true);
    });

    it('should return false when any permission is denied', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      expect(
        engine.checkAll(user, [
          { resource: 'a', action: 'read' },
          { resource: 'x', action: 'read' },
        ])
      ).toBe(false);
    });
  });

  describe('checkAny', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [{ resource: 'a', action: 'read' }],
      });
    });

    it('should return true when at least one permission is granted', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      expect(
        engine.checkAny(user, [
          { resource: 'a', action: 'read' },
          { resource: 'x', action: 'read' },
        ])
      ).toBe(true);
    });

    it('should return false when no permissions are granted', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };

      expect(
        engine.checkAny(user, [
          { resource: 'x', action: 'read' },
          { resource: 'y', action: 'read' },
        ])
      ).toBe(false);
    });
  });

  describe('hasRoleLevel', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'admin',
        name: 'Admin',
        permissions: [{ resource: '*', action: 'manage' }],
      });

      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [{ resource: 'profile', action: 'read' }],
      });
    });

    it('should check role level correctly', () => {
      const admin: RoleUser = { id: '1', roles: ['admin'] };
      const user: RoleUser = { id: '2', roles: ['user'] };

      expect(engine.hasRoleLevel(admin, 1)).toBe(true);
      expect(engine.hasRoleLevel(user, 1)).toBe(true);
    });
  });

  describe('hasAnyRole', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'admin',
        name: 'Admin',
        permissions: [{ resource: 'admin', action: 'manage' }],
      });
    });

    it('should return true if user has any of the roles', () => {
      const user: RoleUser = { id: '1', roles: ['user', 'moderator'] };

      expect(engine.hasAnyRole(user, ['admin', 'moderator'])).toBe(true);
    });

    it('should return false if user has none of the roles', () => {
      const user: RoleUser = { id: '1', roles: ['guest'] };

      expect(engine.hasAnyRole(user, ['admin', 'moderator'])).toBe(false);
    });
  });

  describe('isRole', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'admin',
        name: 'Admin',
        permissions: [{ resource: 'admin', action: 'manage' }],
      });
    });

    it('should check if user has specific role', () => {
      const admin: RoleUser = { id: '1', roles: ['admin', 'user'] };

      expect(engine.isRole(admin, 'admin')).toBe(true);
      expect(engine.isRole(admin, 'superadmin')).toBe(false);
    });
  });

  describe('getUserPermissions', () => {
    it('should return all permissions including inherited', () => {
      engine.defineRole({
        id: 'guest',
        name: 'Guest',
        permissions: [{ resource: 'public', action: 'read' }],
      });

      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [{ resource: 'profile', action: 'update' }],
        parentId: 'guest',
      });

      const user: RoleUser = { id: '1', roles: ['user'] };
      const permissions = engine.getUserPermissions(user);

      expect(permissions).toHaveLength(2);
      expect(permissions.some((p) => p.resource === 'public')).toBe(true);
      expect(permissions.some((p) => p.resource === 'profile')).toBe(true);
    });

    it('should include direct user permissions', () => {
      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [{ resource: 'profile', action: 'read' }],
      });

      const user: RoleUser = {
        id: '1',
        roles: ['user'],
        permissions: [{ resource: 'special', action: 'manage' }],
      };

      const permissions = engine.getUserPermissions(user);

      expect(permissions.some((p) => p.resource === 'special')).toBe(true);
    });
  });

  describe('filterFields', () => {
    beforeEach(() => {
      engine.defineRole({
        id: 'user',
        name: 'User',
        permissions: [
          { resource: 'user', action: 'read', field: 'name' },
          { resource: 'user', action: 'read', field: 'email' },
        ],
      });
    });

    it('should filter object fields based on permissions', () => {
      const user: RoleUser = { id: '1', roles: ['user'] };
      const data = {
        name: 'John',
        email: 'john@example.com',
        password: 'secret',
        ssn: '123-45-6789',
      };

      const filtered = engine.filterFields(user, data, 'user', 'read');

      expect(filtered).toHaveProperty('name');
      expect(filtered).toHaveProperty('email');
      expect(filtered).not.toHaveProperty('password');
      expect(filtered).not.toHaveProperty('ssn');
    });
  });

  describe('serialization', () => {
    it('should serialize and deserialize engine state', () => {
      engine.defineRole({
        id: 'admin',
        name: 'Admin',
        permissions: [{ resource: 'admin', action: 'manage' }],
      });

      const serialized = engine.serialize();
      const deserialized = RBACEngine.deserialize(serialized);

      const admin: RoleUser = { id: '1', roles: ['admin'] };

      expect(deserialized.check(admin, { resource: 'admin', action: 'manage' })).toBe(true);
    });
  });
});

describe('parsePermissionString', () => {
  it('should parse simple permission', () => {
    const perm = parsePermissionString('user:read');

    expect(perm.resource).toBe('user');
    expect(perm.action).toBe('read');
    expect(perm.field).toBeUndefined();
  });

  it('should parse permission with field', () => {
    const perm = parsePermissionString('user:update:email');

    expect(perm.resource).toBe('user');
    expect(perm.action).toBe('update');
    expect(perm.field).toBe('email');
  });

  it('should throw on invalid permission string', () => {
    expect(() => parsePermissionString('invalid')).toThrow();
    expect(() => parsePermissionString('')).toThrow();
  });
});
