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
│   └── login/            # 登录页
├── components/           # 共享组件（ApiCard、Header、Footer、TableLoading 等，一个组件一个目录 index.tsx）
├── hooks/                # 自定义 hooks（use-request、use-copy、use-supabase-user 等）
├── lib/                  # 工具（utils、request、icons）
├── services/             # Supabase 数据访问（apis、categorys、common）
├── enums/                # enum-plus 枚举定义
└── typings/              # 全局类型（App namespace：Api / Category / Columns / PaginatingParams）
supabase/rls.sql          # 数据库 RLS 策略
```

## Conventions

- **HeroUI 使用 v3 API（CRITICAL）**：不要套用 v2 模式（`<HeroUIProvider>`、`@heroui/theme`、扁平 props 均已废弃）。本项目不需要 Provider，组件直接用 `<Card>` / `<Card.Header>` 等 **compound 子组件**组合。
- **语义变体**：用 `primary` / `secondary` / `tertiary` / `danger` / `ghost` / `outline`，不要直接用原始颜色。
- **事件**：优先 `onPress` 而非 `onClick`（无障碍）。
- **样式**：`globals.css` 中必须先 `@import 'tailwindcss'` 再 `@import '@heroui/styles'`；主题基于 CSS 变量 + `oklch` 色值（`--accent`、`--background` 等），亮暗切换由 `next-themes` 控制，`@custom-variant dark (&:is(.dark *))`。
- **import 规范**：组件一律从 `@heroui/react` 导入（如 `Button`、`Card`、`Table`、`Toast`、`toast`、`cn`），不要单独安装子包；`next.config.ts` 已配置 `optimizePackageImports: ['@heroui/react']`。
- 新增 API 页面遵循既有模式：`index.tsx`（server component 数据获取 + 布局）+ `ClientComponent.tsx`（'use client' 交互）。
- 类型定义集中放在 `src/typings/global.d.ts` 的 `App` namespace 中，页面内部类型就近声明。
- 中文注释、目录命名使用 kebab-case，组件文件命名为 `index.tsx`。

## HeroUI 文档查询

- **Skill**：项目级 skill `heroui-react`（`.reasonix/skills/heroui-react/`），含脚本可拉取官方文档：
  ```bash
  node .reasonix/skills/heroui-react/scripts/list_components.mjs
  node .reasonix/skills/heroui-react/scripts/get_component_docs.mjs Button
  node .reasonix/skills/heroui-react/scripts/get_theme.mjs
  ```
- **MCP**：`heroui-react-mcp`（reasonix.toml 已配置），工具 `list_components` / `get_component_docs` / `get_component_source_styles` / `get_theme_variables` 等。
- **直接文档**：`https://heroui.com/docs/react/components/{component-name}.mdx`，指南：`https://heroui.com/docs/react/getting-started/{topic}.mdx`。

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
