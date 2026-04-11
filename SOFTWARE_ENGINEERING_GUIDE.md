# 软件工程全流程文档

> 文档版本：v1.1
> 项目：h1s97x-universal 企业级前端组件库
> 创建日期：2026-04-11
> 更新日期：2026-04-11
> 状态：示例参考文档

> **NPM 组织**: `@cogitant/*`
> **GitHub 仓库**: `https://github.com/cogitant/universal-admin`

---

## 目录

1. [项目概述](#1-项目概述)
2. [需求分析](#2-需求分析)
3. [技术选型](#3-技术选型)
4. [项目架构设计](#4-项目架构设计)
5. [编码规范](#5-编码规范)
6. [测试策略](#6-测试策略)
7. [文档建设](#7-文档建设)
8. [CI/CD 流水线](#8-cicd-流水线)
9. [版本管理](#9-版本管理)
10. [发布流程](#10-发布流程)
11. [运维监控](#11-运维监控)
12. [复盘总结](#12-复盘总结)

---

## 1. 项目概述

### 1.1 项目背景

本项目从威海银行「访前一页纸」系统中提取通用组件，构建可复用的企业级前端组件库。

### 1.2 项目目标

1. **核心目标**：封装权限管理、管理后台布局、通知系统等通用能力
2. **商业目标**：降低企业级 React 应用的开发成本
3. **技术目标**：建立可维护、可扩展的 Monorepo 架构

### 1.3 适用范围

- 企业内部管理系统
- SaaS 管理后台
- 金融、医疗、政务等行业的数字化系统

### 1.4 成功标准

| 指标 | 目标值 |
|------|--------|
| npm 周下载量 | > 1000 |
| GitHub Star | > 100 |
| 测试覆盖率 | > 80% |
| 文档完整度 | 100% API 文档 |
| 社区贡献 | > 5 个 PR |

---

## 2. 需求分析

### 2.1 用户画像

#### 目标用户

| 用户类型 | 角色描述 | 核心需求 |
|----------|----------|----------|
| 前端开发者 | 使用组件库构建应用 | 易用、高质量、文档完善 |
| 技术 Lead | 评估技术选型 | 性能、包大小、社区活跃度 |
| 开源贡献者 | 参与项目开发 | 代码规范、清晰的贡献流程 |

#### 用户故事

```
作为 前端开发者
我想要 一个开箱即用的权限管理组件
以便于 快速实现 RBAC 权限控制

---

作为 技术 Lead
我想要 组件库支持 Tree-shaking
以便于 不会增加最终包体积

---

作为 开源贡献者
我想要 清晰的 CONTRIBUTING 文档
以便于 快速上手项目开发
```

### 2.2 功能需求

#### 核心功能 (P0)

| 功能模块 | 功能点 | 优先级 |
|----------|--------|--------|
| RBAC | 角色定义、权限检查、继承机制 | P0 |
| Admin Shell | 侧边栏、头部、内容区布局 | P0 |
| API Client | 请求封装、缓存、重试机制 | P0 |

#### 增强功能 (P1)

| 功能模块 | 功能点 | 优先级 |
|----------|--------|--------|
| 通知系统 | Toast、Modal、Confirm | P1 |
| 表单处理 | 验证、字段联动 | P1 |
| 主题系统 | 暗色模式、主题定制 | P1 |

#### 扩展功能 (P2)

| 功能模块 | 功能点 | 优先级 |
|----------|--------|--------|
| 图表组件 | ECharts 封装 | P2 |
| 表格组件 | 高级表格功能 | P2 |
| 组织树 | 树形数据结构组件 | P2 |

### 2.3 非功能需求

#### 性能指标

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 首次加载时间 | < 100ms | Lighthouse |
| 包大小 (gzipped) | < 10KB | webpack-bundle-analyzer |
| Tree-shaking | 100% | rollup-plugin-terser |
| TypeScript 编译 | < 5s | CI 计时 |

#### 兼容性

| 环境 | 最低版本 |
|------|----------|
| Node.js | 18.0+ |
| React | 18.0+ |
| TypeScript | 5.0+ |
| 现代浏览器 | Chrome 90+, Firefox 88+, Safari 14+ |

#### 可访问性

| 标准 | 目标级别 |
|------|----------|
| WCAG | AA |
| ARIA | 完整标签 |
| 键盘导航 | 支持 |

---

## 3. 技术选型

### 3.1 核心技术栈

#### 包管理器

| 方案 | 选择 | 理由 |
|------|------|------|
| npm | ❌ | 依赖扁平化差 |
| yarn | ❌ | workspace 支持一般 |
| **pnpm** | ✅ | 速度快、磁盘效率高、workspace 优秀 |

#### Monorepo 工具

| 方案 | 选择 | 理由 |
|------|------|------|
| Lerna | ❌ | 已停止维护 |
| Nx | ❌ | 配置复杂 |
| **Turborepo** | ✅ | 增量构建、智能缓存 |

#### 构建工具

| 方案 | 选择 | 理由 |
|------|------|------|
| Rollup | ❌ | 配置复杂 |
| Webpack | ❌ | 打包慢 |
| **tsup** | ✅ | 零配置、内置 TypeScript |

#### 测试框架

| 方案 | 选择 | 理由 |
|------|------|------|
| Jest | ❌ | 配置多、慢 |
| **Vitest** | ✅ | Vite 原生、快、API 兼容 Jest |

### 3.2 依赖版本矩阵

```json
{
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

### 3.3 技术决策记录

#### ADR-001: 使用 pnpm workspaces

**日期**: 2026-04-01
**状态**: 已通过

**背景**：
需要在单个仓库中管理多个可发布的 npm 包。

**决策**：
使用 pnpm workspaces + Turborepo

**后果**：
- ✅ 依赖安装快、磁盘占用小
- ✅ 构建管道智能缓存
- ❌ 需要团队成员安装 pnpm

---

## 4. 项目架构设计

### 4.1 Monorepo 结构

```
h1s97x-universal/
├── apps/                      # 应用程序
│   └── demo/                  # 演示应用
│       ├── src/
│       │   ├── pages/
│       │   └── main.tsx
│       ├── package.json
│       └── vite.config.ts
│
├── packages/                  # 可发布包 (@cogitant/*)
│   ├── rbac/                 # @cogitant/rbac
│   │   ├── src/
│   │   │   ├── engine.ts     # 核心引擎
│   │   │   ├── react.tsx     # React 绑定
│   │   │   ├── types.ts      # 类型定义
│   │   │   └── index.ts      # 导出
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── README.md
│   │   └── vitest.config.ts
│   │
│   ├── admin-shell/          # @cogitant/admin-shell
│   ├── api-client/           # @cogitant/api-client
│   └── notify/              # @cogitant/notify
│
├── scripts/                   # 构建脚本
│   └── release.sh
│
├── .github/                  # GitHub 配置
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
│
├── pnpm-workspace.yaml       # workspace 配置
├── turbo.json                # Turborepo 配置
├── package.json              # 根包
├── tsconfig.json             # TypeScript 根配置
└── .eslintrc.js             # ESLint 配置
```

### 4.2 包设计规范

#### 包命名

```
@cogitant/{scope}-{name}
```

| 包名 | 作用域 |
|------|--------|
| @cogitant/rbac | 权限管理 |
| @cogitant/admin-shell | 管理后台 |
| @cogitant/api-client | API 客户端 |
| @cogitant/notify | 通知系统 |

#### 包结构

每个包遵循统一结构：

```
packages/{name}/
├── src/
│   ├── index.ts              # 主入口
│   ├── core/                 # 核心逻辑
│   ├── react/               # React 绑定 (如有)
│   ├── utils/               # 工具函数
│   └── types/               # 类型定义
├── tests/                   # 测试文件
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### 4.3 模块依赖图

```
apps/
├── demo ──────────────► admin-shell
├── playground ────────► rbac
│                          │
└── docs ──────────────────┼──► api-client
                           │    │
packages/                      │
├── rbac ─────────────────────┘
├── admin-shell ──────────────┐
├── api-client ───────────────┤
├── notify ────────────────────┤
└── utils ─────────────────────┘
```

---

## 5. 编码规范

### 5.1 TypeScript 规范

#### tsconfig.json 标准配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

#### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | camelCase | getUserInfo |
| 类/接口/类型 | PascalCase | UserProfile |
| 常量 | UPPER_SNAKE | MAX_RETRY_COUNT |
| 文件 | kebab-case | user-profile.ts |
| 目录 | kebab-case | user-profile/ |

#### 类型定义规范

```typescript
// 推荐：使用 interface 定义对象类型
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// 推荐：使用 type 定义联合类型/映射类型
type UserRole = 'admin' | 'user' | 'guest';
type PermissionMap = Record<string, boolean>;

// 避免：使用 any
function process(data: any) { ... }

// 使用 unknown
function process(data: unknown) {
  if (isUser(data)) {
    // ...
  }
}

// 导出类型
export type { User, UserRole };
```

### 5.2 React 组件规范

#### 组件文件结构

```tsx
// 1. 导入
import React, { useState, useCallback } from 'react';
import type { ComponentProps } from './types';
import { cn } from '@/lib/utils';

// 2. 类型定义
interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

// 3. 组件定义
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // 4. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 5. 回调
  const handleClick = useCallback(() => {
    if (!disabled && !loading) {
      props.onClick?.();
    }
  }, [disabled, loading, props.onClick]);

  // 6. 渲染
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading',
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

// 7. 显示名称
Button.displayName = 'Button';
```

#### Hooks 规范

```typescript
// 使用自定义 hooks 封装逻辑
function usePermission(permission: string) {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission(permission).then(setHasPermission);
  }, [permission]);

  return { hasPermission, loading };
}

// 遵循 hook 命名规则：以 use 开头
// 不要在循环、条件语句、嵌套函数中调用 hooks
```

### 5.3 包导出规范

#### package.json exports

```json
{
  "name": "@cogitant/rbac",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js",
      "require": "./dist/react.cjs"
    }
  },
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

#### 入口文件规范

```typescript
// src/index.ts
// Core
export { RBACEngine, createDefaultEngine } from './engine';
export { parsePermissionString, permissionToString } from './utils';

// Types
export type {
  Permission,
  Role,
  RoleUser,
  RBACConfig,
  CheckOptions,
} from './types';

// React (单独导出)
export { usePermission, useIsRole, PermissionGuard } from './react';
```

### 5.4 Git 提交规范

#### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| docs | 文档更新 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具 |

#### 示例

```
feat(rbac): add field-level permission support

- Add resource:action:field permission format
- Update engine.check() to handle field matching
- Add test cases for field-level access

Closes #123
```

---

## 6. 测试策略

### 6.1 测试金字塔

```
        /\
       /  \
      / E2E \     <- Playwright (少量，核心流程)
     /------\
    /        \
   / Integration\  <- React Testing Library (组件交互)
  /--------------\
 /                \
/   Unit Tests   \   <- Vitest (大量，覆盖核心逻辑)
/------------------\
```

### 6.2 测试覆盖目标

| 包 | 覆盖率目标 |
|----|-----------|
| @cogitant/rbac | > 90% |
| @cogitant/admin-shell | > 70% |
| @cogitant/api-client | > 80% |
| @cogitant/notify | > 70% |

### 6.3 测试文件组织

```
packages/rbac/
├── src/
│   ├── engine.ts
│   └── types.ts
└── tests/
    ├── engine.test.ts      # 单元测试
    ├── engine.e2e.test.ts  # 集成测试
    └── fixtures/          # 测试数据
        └── roles.json
```

### 6.4 测试规范

#### 单元测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { RBACEngine } from '../src/engine';

describe('RBACEngine', () => {
  let engine: RBACEngine;

  beforeEach(() => {
    engine = new RBACEngine({
      enableInheritance: true,
      enableWildcards: true,
    });

    engine.defineRole({
      id: 'admin',
      name: 'Administrator',
      permissions: [{ resource: 'user', action: 'manage' }],
    });
  });

  describe('check()', () => {
    it('should return true for granted permission', () => {
      const user = { id: '1', roles: ['admin'] };
      expect(engine.check(user, 'user:read')).toBe(true);
    });

    it('should return false for denied permission', () => {
      const user = { id: '2', roles: ['guest'] };
      expect(engine.check(user, 'user:manage')).toBe(false);
    });

    it('should throw error when throwOnDeny is true', () => {
      const user = { id: '3', roles: ['guest'] };
      expect(() =>
        engine.check(user, 'admin:manage', { throwOnDeny: true })
      ).toThrow('Permission denied');
    });
  });
});
```

#### 组件测试

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PermissionGuard } from '../src/react';

describe('PermissionGuard', () => {
  it('should Render children when permission granted', () => {
    render(
      <PermissionGuard permission="user:read" user={{ roles: ['admin'] }}>
        <button>Protected Button</button>
      </PermissionGuard>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should Render fallback when permission denied', () => {
    render(
      <PermissionGuard
        permission="user:manage"
        user={{ roles: ['guest'] }}
        fallback={<span>Access Denied</span>}
      >
        <button>Protected Button</button>
      </PermissionGuard>
    );

    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });
});
```

### 6.5 测试覆盖率报告

```bash
# 生成覆盖率报告
pnpm test --coverage

# 打开 HTML 报告
open coverage/index.html
```

---

## 7. 文档建设

### 7.1 文档体系

```
docs/
├── README.md              # 项目总览
├── getting-started/       # 入门指南
│   ├── installation.md
│   └── quick-start.md
├── guides/               # 开发指南
│   ├── rbac.md
│   ├── admin-shell.md
│   └── api-client.md
├── api/                  # API 参考
│   ├── rbac/
│   ├── admin-shell/
│   └── api-client/
├── examples/             # 示例代码
├── contributing.md        # 贡献指南
└── changelog.md          # 更新日志
```

### 7.2 README 模板

```markdown
# {包名称}

> 一句话描述

## Features

- 特性1
- 特性2
- 特性3

## Installation

```bash
npm install {package-name}
```

## Quick Start

```tsx
import { Component } from '{package-name}';

// 基础用法
```

## API Reference

### Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | 描述 |

## License

MIT
```

### 7.3 API 文档规范

```typescript
/**
 * 检查用户是否具有指定权限
 *
 * @example
 * ```ts
 * const hasPermission = engine.check(user, 'user:read');
 * ```
 *
 * @param user - 当前用户
 * @param permission - 权限字符串，格式: resource:action
 * @param options - 可选配置
 * @returns 是否具有权限
 */
function check(
  user: RoleUser,
  permission: Permission | PermissionString,
  options?: CheckOptions
): boolean;
```

---

## 8. CI/CD 流水线

### 8.1 GitHub Actions 工作流

#### CI 流水线 (.github/workflows/ci.yml)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm ts-check

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --coverage

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

#### Release 流水线 (.github/workflows/release.yml)

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version (major/minor/patch)'
        required: true
        default: 'patch'

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Create Release Pull Request
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 8.2 流水线状态徽章

```markdown
[![CI](https://github.com/cogitant/universal-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/cogitant/universal-admin/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@cogitant/rbac)](https://www.npmjs.com/package/@cogitant/rbac)
[![codecov](https://codecov.io/gh/cogitant/universal-admin/branch/main/graph/badge.svg)](https://codecov.io/gh/cogitant/universal-admin)
```

---

## 9. 版本管理

### 9.1 语义化版本 (SemVer)

```
major.minor.patch
  │     │     └── Patch: Bug 修复，兼容更新
  │     └───────── Minor: 新功能，向后兼容
  └─────────────── Major: 破坏性变更
```

### 9.2 changesets 配置

```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependents": "always"
}
```

### 9.3 发布流程

```bash
# 1. 开发新功能
git checkout -b feat/new-feature
# ... 代码开发
git commit -m "feat(scope): add new feature"

# 2. 创建 changeset
pnpm changeset
# 选择要发布的包和版本类型

# 3. 提交 changeset
git add .changeset
git commit -m "docs(changeset): add changeset"
git push

# 4. 创建 PR 并合并到 main

# 5. GitHub Actions 自动发布
# - 创建版本 PR
# - 发布到 npm
# - 创建 GitHub Release
```

---

## 10. 发布流程

### 10.1 发布前检查清单

| 检查项 | 负责人 | 状态 |
|--------|--------|------|
| 所有测试通过 | CI | ☐ |
| TypeScript 编译无错误 | CI | ☐ |
| ESLint 检查通过 | CI | ☐ |
| 测试覆盖率达标 | @dev | ☐ |
| 文档更新完成 | @dev | ☐ |
| CHANGELOG 更新 | @dev | ☐ |
| npm token 配置 | @user | ☐ |

### 10.2 发布步骤

```bash
#!/bin/bash
# scripts/release.sh

set -e

echo "Starting release process..."

# 1. 确保在 main 分支
git checkout main
git pull

# 2. 安装依赖
pnpm install

# 3. 运行构建
pnpm build

# 4. 运行测试
pnpm test

# 5. 生成 changeset
pnpm changeset

# 6. 提交并推送
git add .
git commit -m "chore: prepare for release"
git push

# 7. 创建 tag
git tag v$(node -p "require('./package.json').version")
git push origin v$(node -p "require('./package.json').version")

echo "Release process completed!"
```

### 10.3 npm 发布配置

```json
// package.json
{
  "name": "@cogitant/rbac",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### 10.4 NPM 发布命令

```bash
# 单包发布
cd packages/rbac && npm publish --access public

# Monorepo 批量发布
pnpm publish -r --access public

# 使用 Changesets 发布
pnpm changeset publish
```

---

## 11. 运维监控

### 11.1 错误追踪

使用 Sentry 进行错误追踪：

```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 11.2 性能监控

```typescript
// 监控组件渲染性能
import { withProfiler } from '@sentry/react';

export default withProfiler(MyComponent);
```

### 11.3 使用统计

```typescript
// 匿名使用统计
import { analytics } from '@cogitant/analytics';

// 仅在生产环境启用
if (process.env.NODE_ENV === 'production') {
  analytics.track('package_loaded', {
    package: '@cogitant/rbac',
    version: '1.0.0',
  });
}
```

---

## 12. 复盘总结

### 12.1 复盘模板

```markdown
## {项目名称} 复盘报告

### 项目信息
- 项目周期: {start} - {end}
- 团队规模: {人数}
- 项目类型: {类型}

### 目标回顾

| 目标 | 状态 | 备注 |
|------|------|------|
| 功能1 | 完成/未完成 | 原因 |
| 功能2 | 完成/未完成 | 原因 |

### 数据统计

| 指标 | 计划值 | 实际值 | 偏差 |
|------|--------|--------|------|
| 开发周期 | 6周 | ?周 | ? |
| 代码量 | - | ?行 | - |
| 测试覆盖率 | 80% | ?% | ? |

### 做得好的地方

1. {经验1}
2. {经验2}

### 需要改进的地方

1. {问题1}
2. {问题2}

### 行动项

| 行动 | 负责人 | 完成日期 |
|------|--------|----------|
| {action} | {owner} | {date} |

### 下次迭代建议

1. {suggestion1}
2. {suggestion2}
```

### 12.2 经验沉淀

```
knowledge/
├── decisions/           # 技术决策记录 (ADR)
├── lessons/             # 学到的经验教训
├── templates/           # 可复用模板
│   ├── pr-template.md
│   ├── bug-report.md
│   └── feature-request.md
└── playbooks/           # 运维手册
    ├── deployment.md
    └── rollback.md
```

---

## 附录

### A. 术语表

| 术语 | 定义 |
|------|------|
| Monorepo | 单仓库多包管理 |
| Tree-shaking | 死代码消除 |
| RBAC | Role-Based Access Control |
| SemVer | 语义化版本 |
| ADR | Architecture Decision Record |

### B. 参考资料

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo)
- [tsup](https://tsup.egoist.dev)
- [Vitest](https://vitest.dev)
- [Changesets](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org)

### C. 许可证

MIT License

---

*文档版本历史*
| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| v1.1 | 2026-04-11 | 更新 NPM 组织从 @h1s97x 到 @cogitant | Claude |
| v1.0 | 2026-04-11 | 初始版本 | Claude |
