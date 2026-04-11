# h1s97x-universal 项目执行计划

> 文档版本：v1.1
> 创建日期：2026-04-11
> 更新日期：2026-04-11
> 状态：待审批

---

## 一、项目愿景

打造一个**可复用的企业级前端组件库**，包含权限管理、管理后台布局、通知系统等通用能力，可快速集成到任何 React 项目中。

**命名空间**: `@cogitant/*`
**GitHub 仓库**: `https://github.com/cogitant/universal-admin`
**NPM 组织**: `https://www.npmjs.com/org/cogitant`

---

## 二、NPM 发布配置

### 2.1 组织设置

| 配置项 | 值 |
|---|---|
| NPM 组织 | `cogitant` |
| 可见性 | 公开 (public) |
| Token 类型 | Automation |

### 2.2 包命名规范

| 本地包名 | NPM 发布名 | 说明 |
|---|---|---|
| `rbac` | `@cogitant/rbac` | 权限管理系统 |
| `admin-shell` | `@cogitant/admin-shell` | 管理后台布局 |
| `api-client` | `@cogitant/api-client` | API 客户端 |
| `form` | `@cogitant/react-form` | 表单处理 |
| `modal` | `@cogitant/modal` | 弹窗组件 |
| `notify` | `@cogitant/notify` | 通知系统 |

---

## 三、现状评估

### 3.1 已完成

| 包名 | 功能 | 完成度 | 质量 |
|---|---|---|---|
| `@cogitant/rbac` | 权限管理系统 | 85% | A |
| `@cogitant/admin-shell` | 管理后台布局 | 70% | B+ |
| `@cogitant/api-client` | API 客户端 | 60% | B |
| `@cogitant/form` | 表单处理 | 40% | B- |
| `@cogitant/notify` | 通知系统 | 40% | B- |
| `@cogitant/modal` | 弹窗组件 | 20% | C |
| `@cogitant/universal-ui` | UI组件库 | 5% | N/A |

### 3.2 关键问题

1. ❌ `universal-ui` 是空壳，无实际实现
2. ❌ `modal`/`form` 严重依赖 shadcn/ui，无差异化
3. ❌ 缺少 Demo 应用展示包的使用
4. ❌ 图标方案临时（emoji 占位）
5. ❌ 缺少单元测试覆盖
6. ❌ 无 CI/CD 流水线
7. ❌ 无完整的 API 文档

---

## 四、执行计划

### 阶段一：清理与基础完善（1-2周）

#### Week 1: 清理与骨架修复

| 任务 | 负责人 | 优先级 | 工作量 | 验收标准 |
|---|---|---|---|---|
| T1.1 删除 `universal-ui` 空壳包 | @dev | P0 | 0.5d | 包目录移除，workspace 更新 |
| T1.2 删除 `modal`/`form` 包或增强差异化 | @dev | P0 | 2d | 决策：删除 or 增强 |
| T1.3 修复 `admin-shell` 图标方案 | @dev | P1 | 1d | 支持 lucide-react |
| T1.4 创建 `apps/demo` 完整 Demo | @dev | P1 | 3d | 可运行的完整演示 |

**T1.2 决策点**：
- **方案A（推荐）**：删除 `modal`/`form`，因为 shadcn/ui 已足够好
- **方案B**：增强独特功能（如特定银行的表单模板）

#### Week 2: 完善核心包

| 任务 | 负责人 | 优先级 | 工作量 | 验收标准 |
|---|---|---|---|---|
| T2.1 完善 `@cogitant/rbac` 单元测试 | @dev | P0 | 3d | 覆盖率 > 80% |
| T2.2 完善 `@cogitant/admin-shell` 测试 | @dev | P1 | 2d | 覆盖率 > 70% |
| T2.3 完善 `@cogitant/api-client` 实现 | @dev | P1 | 2d | 与 README 一致 |
| T2.4 创建 `apps/playground` 交互式 Playground | @dev | P2 | 2d | 在线体验地址 |

---

### 阶段二：文档与质量（2周）

#### Week 3: 文档建设

| 任务 | 负责人 | 优先级 | 工作量 | 验收标准 |
|---|---|---|---|---|
| T3.1 集成 Storybook | @dev | P1 | 2d | 所有组件可在线预览 |
| T3.2 完善各包 README | @dev | P1 | 1d | API 表格完整 |
| T3.3 创建 CHANGELOG.md | @dev | P2 | 0.5d | 格式规范 |
| T3.4 创建 CONTRIBUTING.md | @dev | P2 | 0.5d | 贡献指南 |

#### Week 4: 质量保障

| 任务 | 负责人 | 优先级 | 工作量 | 验收标准 |
|---|---|---|---|---|
| T4.1 配置 ESLint + Prettier | @dev | P0 | 0.5d | CI 检查通过 |
| T4.2 配置 GitHub Actions CI | @dev | P0 | 1d | PR 检查通过 |
| T4.3 配置 `changesets` 版本管理 | @dev | P1 | 1d | 自动生成 CHANGELOG |
| T4.4 TypeScript strict mode | @dev | P1 | 0.5d | 无类型错误 |

---

### 阶段三：发布与生态（1-2周）

#### Week 5: 发布准备

| 任务 | 负责人 | 优先级 | 工作量 | 验收标准 |
|---|---|---|---|---|
| T5.1 创建 GitHub 仓库 | @user | P0 | 0.5d | 仓库创建完成 (`cogitant/universal-admin`) |
| T5.2 推送代码到 GitHub | @user | P0 | 0.5d | 代码同步完成 |
| T5.3 配置 GitHub Secrets NPM_TOKEN | @user | P0 | 0.5d | Token 配置完成 |
| T5.4 发布 `@cogitant/rbac` v0.1.0 | @dev | P0 | 1d | npm 可安装 |
| T5.5 发布 `@cogitant/admin-shell` v0.1.0 | @dev | P0 | 1d | npm 可安装 |
| T5.6 发布 `@cogitant/api-client` v0.1.0 | @dev | P1 | 0.5d | npm 可安装 |

#### Week 6: 生态完善

| 任务 | 负责人 | 优先级 | 工作量 | 验收标准 |
|---|---|---|---|---|
| T6.1 集成 VitePress 文档站 | @dev | P1 | 3d | docs.cogitant.dev 可访问 |
| T6.2 创建官网 | @dev | P2 | 3d | landing page |
| T6.3 发布 v1.0.0 | @dev | P1 | 1d | 稳定版发布 |

---

## 五、NPM 发布检查清单

发布前必须确认以下配置：

### 包级别检查

```json
// packages/{package}/package.json 必须包含
{
  "name": "@cogitant/{package-name}",
  "version": "0.1.0",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/cogitant/universal-admin",
    "directory": "packages/{package-name}"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  }
}
```

### 发布命令

```bash
# 1. 确保在 main 分支，代码已同步
git checkout main && git pull

# 2. 构建所有包
pnpm build

# 3. 验证构建产物
ls packages/*/dist/

# 4. 发布所有包
pnpm publish -r --access public

# 5. 验证发布成功
npm view @cogitant/rbac
npm view @cogitant/admin-shell
```

### GitHub Secrets 配置

| Secret 名称 | 值 | 说明 |
|---|---|---|
| `NPM_TOKEN` | (用户提供) | NPM Automation Token |

---

## 六、详细任务分解

### T1.1 删除 universal-ui 空壳包

**执行步骤**：
```bash
# 1. 删除目录
rm -rf packages/universal-ui

# 2. 更新 pnpm-workspace.yaml (如需要)
# 3. 更新 turbo.json (如需要)
# 4. 更新 DEVELOPMENT_PLAN.md
```

**回滚方案**：如需恢复，从 git 找回

---

### T1.2 modal/form 包决策

**方案A：删除（推荐）**

```bash
rm -rf packages/modal
rm -rf packages/form
```

**方案B：增强差异化**
- `modal`: 增加银行专用确认对话框模板
- `form`: 增加企业级表单生成器

**决策**：__________

---

### T1.3 修复 admin-shell 图标方案

**问题**：当前使用 emoji 作为图标

**解决方案**：支持 lucide-react

```typescript
// 新的图标支持
import { Home, Users, Settings } from 'lucide-react';

interface MenuItem {
  icon?: string | React.ComponentType<{ className?: string }>;
  // 支持字符串映射或直接传入组件
}

// 渲染逻辑
{typeof item.icon === 'string' ? (
  <IconComponent name={item.icon} className="w-5 h-5" />
) : (
  item.icon && <item.icon className="w-5 h-5" />
)}
```

---

### T1.4 创建完整 Demo 应用

**技术栈**：
- Vite + React 18
- React Router
- Tailwind CSS
- 展示所有包的功能

**页面结构**：
```
/                   - 首页
/rbac              - RBAC 功能演示
/admin-shell      - 管理后台布局演示
/notify            - 通知系统演示
```

---

## 七、里程碑

| 里程碑 | 目标日期 | 交付物 |
|---|---|---|
| M1: 清理完成 | Week 1 结束 | 保留 4 个核心包，Demo 可运行 |
| M2: 测试完善 | Week 2 结束 | 覆盖率 > 75% |
| M3: 文档就绪 | Week 3 结束 | Storybook + README |
| M4: CI/CD 完成 | Week 4 结束 | GitHub Actions 流水线 |
| M5: Beta 发布 | Week 5 结束 | npm 可安装 (`@cogitant/*`) |
| M6: v1.0.0 | Week 6 结束 | 正式发布 |

---

## 八、资源估算

| 类别 | 估算 | 备注 |
|---|---|---|
| 开发时间 | 6 周 | 约 24 人天 |
| CI/CD 资源 | 免费 | GitHub Actions |
| 文档托管 | 免费 | VitePress (GitHub Pages) |
| npm 发布 | 免费 | 公开包 |

---

## 九、风险与应对

| 风险 | 概率 | 影响 | 应对 |
|---|---|---|---|
| Demo 开发超出预期 | 中 | 中 | 简化功能，优先核心展示 |
| Storybook 集成复杂 | 低 | 中 | 使用替代方案 (CodeSandbox) |
| npm 发布权限问题 | 低 | 高 | 确认 `@cogitant` 组织已创建 |
| GitHub Actions npm 发布失败 | 低 | 高 | 手动发布测试，确认 Token 权限 |

---

## 十、审批

| 角色 | 姓名 | 决策 | 签字 |
|---|---|---|---|
| 项目负责人 | @user | □ 批准 □ 需修改 | |
| 开发负责人 | @dev | □ 批准 □ 需修改 | |

**审批意见**：_________________________________________

---

## 十一、执行记录

| 日期 | 任务 | 执行人 | 状态 | 备注 |
|---|---|---|---|---|
| 2026-04-11 | 更新 NPM 组织配置 (@cogitant) | @dev | ✅ | 命名空间从 @h1s97x 变更为 @cogitant |
