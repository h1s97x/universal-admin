# @cogitant/universal-admin 开发计划

> 从威海银行「访前一页纸」系统提取的通用组件库

---

## 项目愿景

打造一个**可复用的企业级前端组件库**，包含权限管理、管理后台布局、通知系统等通用能力，可快速集成到任何 React 项目中。

**命名空间**: `@cogitant/*`

---

## NPM 组织配置

### 已完成 ✅

- NPM 组织: **cogitant**
- Token: 已配置（存储在 GitHub Secrets: `NPM_TOKEN`）
- 发布范围: 公开包 (`public`)

```
cogitant/
├── packages/
│   ├── rbac/           # @cogitant/rbac - 权限管理系统
│   ├── admin-shell/    # @cogitant/admin-shell - 管理后台布局
│   ├── api-client/     # @cogitant/api-client - API 客户端
│   ├── form/           # @cogitant/react-form - 表单处理
│   ├── modal/          # @cogitant/modal - 弹窗组件
│   ├── notify/         # @cogitant/notify - 通知系统
│   └── rbac/           # @cogitant/rbac - 权限控制
└── apps/
    └── demo/            # Demo 应用
```

### 已验证
- [x] Monorepo 结构 (`pnpm workspaces` + `Turborepo`)
- [x] `@cogitant/rbac` 构建成功
- [x] `@cogitant/admin-shell` 构建成功
- [x] Demo 应用运行正常

---

## 开发路线图

### Phase 1: MVP 发布 (Week 1-2)

**目标**: 发布第一批可用包，建立基础

#### 1.1 完善现有包

| 包 | 优先级 | 待完成项 |
|---|---|---|
| `@cogitant/rbac` | P0 | 单元测试、更多示例 |
| `@cogitant/admin-shell` | P0 | 单元测试、Dark Mode 支持 |

#### 1.2 新增包

| 包 | 功能 | 优先级 |
|---|---|---|
| `@cogitant/notify` | 通知中心、Toast、Modal | P1 |
| `@cogitant/api-client` | 统一 API 调用封装 | P2 |

#### 1.3 文档

- [ ] 完整的 README.md（每个包）
- [ ] Storybook 集成（组件可视化）
- [ ] CHANGELOG.md

#### 1.4 GitHub 准备

- [ ] 创建 GitHub 仓库 (建议: `cogitant/universal-admin`)
- [ ] 添加 CI/CD (GitHub Actions)
  - [ ] 自动构建
  - [ ] 自动发布 npm (`pnpm publish -r --access public`)
  - [ ] PR 检查 (lint, test)
- [ ] 添加 LICENSE (MIT)

---

### Phase 2: 生态完善 (Week 3-4)

**目标**: 丰富组件库生态

#### 2.1 新增包

| 包 | 功能 | 来源 |
|---|---|---|
| `@cogitant/org-tree` | 组织树组件 | 威海银行机构管理 |
| `@cogitant/form-engine` | 表单生成器 (基于 Zod) | 通用需求 |
| `@cogitant/data-viz` | 图表封装 | ECharts 封装 |

#### 2.2 框架适配

- [ ] `@cogitant/rbac/nextjs` - Next.js 适配层
- [ ] `@cogitant/rbac/react-router` - React Router 适配

#### 2.3 工具包

- [ ] `@cogitant/utils` - 共享工具函数
  - `useLocalStorage`
  - `useDebounce`
  - `cn()` (classnames)
  - `formatDate`

---

### Phase 3: 生产级完善 (Week 5-6)

**目标**: 提升代码质量和可维护性

#### 3.1 测试覆盖

- [ ] Vitest 单元测试
- [ ] React Testing Library
- [ ] Playwright E2E 测试 (demo)

#### 3.2 代码质量

- [ ] ESLint + Prettier 配置
- [ ] `changesets` 版本管理
- [ ] TypeScript strict mode

#### 3.3 文档

- [ ] VitePress 文档站
- [ ] API 参考自动生成
- [ ] 使用示例

---

## 包详细规划

### @cogitant/rbac
```
v0.1.0 (MVP)
├── RBACEngine 核心
├── React Hooks (usePermission, useIsRole, etc.)
├── Components (PermissionGuard, RoleGuard)
└── 基础文档

v0.2.0
├── 单元测试
├── Next.js Middleware 适配
└── 更多示例

v1.0.0
├── 稳定 API
├── 完整测试覆盖
└── 生产验证
```

### @cogitant/admin-shell
```
v0.1.0 (MVP)
├── AdminLayout (Sidebar + Header + Content)
├── StatCard / StatCardGrid
├── Breadcrumb
└── 基础文档

v0.2.0
├── Dark Mode 支持
├── 更多菜单交互
└── 主题定制
```

### @cogitant/notify
```
v0.1.0
├── NotificationProvider
├── Toast 系统
├── Modal 系统
└── useToast hook

v0.2.0
├── WebSocket 支持
├── Service Worker 推送
└── 通知持久化
```

---

## 技术决策

### 构建工具
- **pnpm workspaces** - 包管理
- **Turborepo** - 构建管道
- **tsup** - TypeScript 打包 (CJS + ESM + DTS)

### 测试
- **Vitest** - 单元测试
- **React Testing Library** - 组件测试
- **Playwright** - E2E 测试

### 文档
- **Storybook** - 组件可视化
- **VitePress** - 文档站点

### CI/CD
- **GitHub Actions** - 自动化流水线

---

## NPM 发布配置

### 发布命令
```bash
# 单包发布
cd packages/{package-name} && npm publish --access public

# Monorepo 批量发布
pnpm publish -r --access public
```

### 发布前检查清单

| 检查项 | 说明 |
|---|---|
| `name` | 必须是 `@cogitant/{package-name}` |
| `version` | 遵循 SemVer 规范 |
| `license` | MIT |
| `repository` | 指向 GitHub 仓库 |
| `files` | 只发布必要文件 (`dist/`) |
| `sideEffects` | 标记为 `false` 以支持 Tree-shaking |
| `publishConfig.access` | 必须为 `public` |

### package.json 模板
```json
{
  "name": "@cogitant/rbac",
  "version": "0.1.0",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/cogitant/universal-admin",
    "directory": "packages/rbac"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "module": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  }
}
```

---

## GitHub Actions 发布流程

### 发布工作流 (.github/workflows/release.yml)
```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - name: Publish to npm
        run: pnpm publish -r --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### CI 工作流 (.github/workflows/ci.yml)
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
```

---

## 任务清单

### Week 1

- [ ] 完善 `@cogitant/rbac` 单元测试
- [ ] 完善 `@cogitant/admin-shell` Dark Mode
- [ ] 创建 GitHub 仓库 `cogitant/universal-admin`
- [ ] 配置 GitHub Actions CI/CD
- [ ] **发布 v0.1.0**

### Week 2

- [ ] 实现 `@cogitant/notify`
- [ ] 实现 `@cogitant/api-client`
- [ ] 添加 Storybook
- [ ] **发布 v0.2.0**

### Week 3-4

- [ ] 实现 `@cogitant/org-tree`
- [ ] 实现 `@cogitant/form-engine`
- [ ] 框架适配层
- [ ] **发布 v0.3.0**

### Week 5-6

- [ ] 完善测试覆盖
- [ ] VitePress 文档站
- [ ] changesets 集成
- [ ] **发布 v1.0.0**

---

## 资源

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo)
- [tsup](https://tsup.egoist.dev)
- [Vitest](https://vitest.dev)
- [Storybook](https://storybook.js.org)
- [changesets](https://github.com/changesets/changesets)

---

## 备注

- GitHub 仓库建议: `cogitant/universal-admin`
- NPM 组织: `cogitant`
- 当前阶段使用 Monorepo 管理，后期可考虑独立仓库
- 保持 API 稳定性后再发布 1.0.0
- NPM Token 已配置在 GitHub Secrets
