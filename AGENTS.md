# AGENTS.md

Instructions for AI agents working in this repository.

## Project

**EasyAPI** — 基于 Next.js 16 (App Router) + Supabase 的 API 聚合平台（api.baiwumm.com），收录 30+ 个高频接口（每日推荐、随机生成、心灵语录、生活服务等），支持亮暗主题、响应式布局、登录后的接口分类与管理。

### Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.3.x | Framework（App Router） |
| React | 19.2.x | UI framework |
| HeroUI | 3.2.x（`@heroui/react` / `@heroui/styles`） | UI 组件库 |
| Tailwind CSS | 4.x（`@tailwindcss/postcss`） | 样式 |
| Supabase | `@supabase/ssr` + `@supabase/supabase-js` | 数据存储与鉴权 |
| 包管理 | pnpm | 依赖管理 |

## Commands

| Action | Command |
|---|---|
| 启动开发服务器 | `pnpm dev` |
| 生产构建 | `pnpm build` |
| 启动生产服务 | `pnpm start` |
| Lint 检查 | `pnpm lint` |
| Lint 自动修复 | `pnpm lint:fix` |
| 发布 | `pnpm release`（release-it + conventional-changelog） |

## Architecture

```
src/
├── app/                  # App Router 页面，每个 API 功能一个目录（index.tsx + ClientComponent.tsx）
│   ├── layout.tsx        # 根布局（next-themes + HeroUI Toast）
│   ├── admin/            # 后台管理（apis / categorys 表格 + CRUD）
│   ├── login/            # 登录页
│   └── docs/             # 接口文档页（Scalar Route Handler，渲染 public/openapi.yaml）
├── components/           # 共享组件（ApiCard、Header、Footer、TableLoading 等，一个组件一个目录 index.tsx）
├── hooks/                # 自定义 hooks（use-request、use-copy、use-supabase-user 等）
├── lib/                  # 工具（utils、request、icons）
├── services/             # Supabase 数据访问（apis、categorys、common）
├── enums/                # enum-plus 枚举定义
└── typings/              # 全局类型（App namespace：Api / Category / Columns / PaginatingParams）
supabase/rls.sql          # 数据库 RLS 策略
public/openapi.yaml       # 手工维护的 OpenAPI 3.1 接口文档（/docs 页数据源）
```

## Conventions

- **HeroUI 使用 v3 API（CRITICAL）**：不要套用 v2 模式（`<HeroUIProvider>`、`@heroui/theme`、扁平 props 均已废弃）。本项目不需要 Provider，组件直接用 `<Card>` / `<Card.Header>` 等 **compound 子组件**组合。
- **语义变体**：用 `primary` / `secondary` / `tertiary` / `danger` / `ghost` / `outline`，不要直接用原始颜色。
- **事件**：优先 `onPress` 而非 `onClick`（无障碍）。
- **样式**：`globals.css` 中必须先 `@import 'tailwindcss'` 再 `@import '@heroui/styles'`；主题基于 CSS 变量 + `oklch` 色值（`--accent`、`--background` 等），亮暗切换由 `next-themes` 控制，`@custom-variant dark (&:is(.dark *))`。
- **import 规范**：组件一律从 `@heroui/react` 导入（如 `Button`、`Card`、`Table`、`Toast`、`toast`、`cn`），不要单独安装子包；`next.config.ts` 已配置 `optimizePackageImports: ['@heroui/react']`。
- 新增 API 页面遵循既有模式：`index.tsx`（server component 数据获取 + 布局）+ `ClientComponent.tsx`（'use client' 交互），并同步在 `public/openapi.yaml` 补充接口文档（见「接口文档维护」）。
- 类型定义集中放在 `src/typings/global.d.ts` 的 `App` namespace 中，页面内部类型就近声明。
- 中文注释、目录命名使用 kebab-case，组件文件命名为 `index.tsx`。

## 接口文档维护（Scalar + 手工 OpenAPI）

- **文档页** `/docs`：由 `src/app/docs/route.ts` 通过 `@scalar/nextjs-api-reference` 渲染。它是 Route Handler（`export const GET = ApiReference(...)`），不是 page.tsx；`force-static` 构建期静态化；渲染脚本默认走 jsdelivr CDN，主题色是写死的字面量（页面为独立 HTML，读不到站点 CSS 变量）。
- **数据源** `public/openapi.yaml`（OpenAPI 3.1.0）：**手工维护，不使用生成器**。项目不引入 zod / next-openapi-gen，现有 route.ts 的手写校验保持现状。
- **新增接口时必须同步补文档**，在对应 tag（每日推荐 / 随机生成 / 心灵语录 / 生活服务）下添加 path：
  - 路径写完整 `/api/xxx`；`operationId` 用 `getXxx` 驼峰；summary 与 route.ts 头注释 `@Description` 一致；中文描述，参数约束（必填、边界、默认值、枚举）以 route.ts 实际校验逻辑为准，枚举值取自 `src/enums/index.tsx`。
  - JSON 响应用 `allOf` 引用 `#/components/schemas/Envelope` 再覆盖 `data`；每个接口只写 `"200"` 一个响应，错误语义由 Envelope 的 `code` 统一说明。
  - 文案类接口（支持 `format=text`）直接引用 `#/components/responses/TextContentResponse`；分页接口复用 `PageIndex` / `PageSize` 参数与 `PageMeta` 模型。
  - 图片直出接口（PNG/SVG）在 `responses."200".content` 下并列 `image/*` 与 `application/json`，不套 Envelope。
- **修改接口**：同步改 YAML 对应 path 的参数与响应模型。
- **不收录**：管理端写接口（POST/PUT/DELETE、`[id]` 路径）与 `/auth/*`。
- `info.version` 跟随 `package.json` 版本更新。
- **校验**：改完 YAML 后启动 dev 访问 `/docs` 确认渲染正常即可（Scalar 解析失败会在页面提示）。

## 代码规范与质量门禁

### Lint 规则

项目使用 ESLint + Prettier 进行代码格式化：

```bash
pnpm lint          # 检查代码
pnpm lint:fix      # 自动修复
```

**必须遵守的规则：**
- 使用 `unused-imports` 插件移除未使用的导入
- 导入顺序：type > builtin > object > external > internal > parent > sibling > index
- 组件属性排序：callbacksLast > shorthandFirst > reservedFirst
- 自闭合组件标签：`<Component />` 而非 `<Component></Component>`
- `return` 语句前必须空一行
- 禁止 `console` 输出（warn 级别）

### TypeScript 规范

- 所有组件和工具函数必须使用 TypeScript
- 未使用的变量以 `_` 前缀命名（如 `_unused`）
- 优先使用 `AppTableFeatures`、`AppColumnDef` 等项目统一类型

### Git 提交规范

使用 Conventional Commits 格式：

```
feat: 新功能
fix: 修复
docs: 文档更新
style: 代码格式（不影响逻辑）
refactor: 重构
test: 测试
chore: 构建/工具变动
```

## HeroUI 文档查询

- **Skill**：项目级 skill `heroui-react`（`.agents/skills/heroui-react/`），含脚本可拉取官方文档：
  ```bash
  node .agents/skills/heroui-react/scripts/list_components.mjs
  node .agents/skills/heroui-react/scripts/get_component_docs.mjs Button
  node .agents/skills/heroui-react/scripts/get_theme.mjs
  ```
- **MCP**：`heroui-react-mcp`（reasonix.toml 已配置），工具 `list_components` / `get_component_docs` / `get_component_source_styles` / `get_theme_variables` 等。
- **直接文档**：`https://heroui.com/docs/react/components/{component-name}.mdx`，指南：`https://heroui.com/docs/react/getting-started/{topic}.mdx`。

## AI 使用约束（强制规范）

本项目已集成 `@vercel/react-best-practices`（ESLint 插件）和 `HeroUI` 组件库。

### 禁止修改的文件

- `src/lib/supabase/*.ts` — Supabase 客户端配置，涉及认证安全
- `src/typings/global.d.ts` — TanStack Table 类型定义
- `eslint.config.mjs` — ESLint 配置，修改可能导致 CI 失败
- `next.config.ts` — Next.js 配置，影响构建行为

### 必须遵守的约束

1. **UI 组件必须使用 HeroUI**：禁止引入其他 UI 库（如 Ant Design、Material UI）
2. **数据获取使用 SWR**：客户端数据获取必须通过 SWR
3. **样式必须使用 Tailwind CSS**：禁止内联样式或 CSS-in-JS
4. **Supabase 操作必须经过 RLS**：任何数据库操作必须遵循 Row Level Security 策略
5. **组件文件使用 `index.tsx` 命名**：每个组件目录下统一使用 `index.tsx` 作为入口

### AI 代码生成守则

1. **性能第一**：严格遵守 Vercel React 官方性能优化指南（使用 memo、useCallback、避免匿名函数 props）
2. **组件优先**：所有 UI 元素必须基于 HeroUI 组件构建，严禁使用纯 div+CSS 模拟 HeroUI 已有功能（如 Modal、Dropdown）
3. **自检机制**：生成代码后，AI 必须主动检查是否违反上述两条规则，如有违反需重写
4. **异常处理**：若规则库之间存在冲突（例如 HeroUI 某个组件用法与 Vercel 建议相悖），AI 需主动提问并等待人工裁决，不得擅自决定
5. **代码生成与重构必须遵循 `vercel-react-best-practices` Skill**：该 Skill 已安装于 `.agents/skills/vercel-react-best-practices`，是所有代码产出（新建组件/页面、数据获取、重构、性能优化）的硬性性能与正确性规范

### 推荐使用的工具库

| 库 | 用途 | 文档位置 |
|----|------|----------|
| HeroUI | UI 组件 | `.agents/skills/heroui-react` |
| SWR | 数据获取 | 项目内置 |
| TanStack Table | 表格 | `src/typings/global.d.ts` |
| Motion | 动画 | 已安装 |

## 部署说明

推荐部署到 Vercel：

1. Fork 本项目
2. 在 Vercel 中导入仓库
3. 配置环境变量
4. 点击 Deploy

## 相关链接

- 在线预览：https://api.baiwumm.com/
- GitHub：https://github.com/baiwumm/EasyAPI

## Notes

<!-- 快速补充区：新约定、踩坑记录放这里 -->

## Pending Upgrades

以下包待评估升级（major 变更，需专项评估）：

| 包名 | 当前版本 | 最新版本 | 说明 |
|---|---|---|---|
| `@dicebear/core` | ^9.4.0 | 10.7.0 | v9→v10 API 变更，其他 dicebear 包仍为 9.4.2，需等统一版本 |
| `@zxcvbn-ts/core` | ^3.0.4 | 4.2.0 | 密码强度检测库 v3→v4 API 变化 |
| `@zxcvbn-ts/language-common` | ^3.0.4 | 4.1.3 | 同上 |
| `@zxcvbn-ts/language-zh` | 4.0.0-beta.3 | 4.1.1 | 从 beta 升级到正式版 |
| `crypto-random-string` | ^5.0.0 | 6.0.0 | ESM-only v5→v6 |
| `typescript` | ^5 | 7.0.2 | TS 5→7 跨度极大，风险极高 |
| `@types/node` | ^20 | 26.4.1 | Node 类型定义 v20→v26 |
