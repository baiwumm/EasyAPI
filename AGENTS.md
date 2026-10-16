# AGENTS.md

AI agents 在本仓库工作的入口规范。本文件只放「不看就会踩坑」的内容，专题细则按 [docs/README.md](./docs/README.md) 的索引查阅。

## Project

**EasyAPI** — 基于 Next.js（App Router）+ Supabase 的 API 聚合平台（api.baiwumm.com），收录 30+ 个高频接口（每日推荐、随机生成、心灵语录、生活服务等），支持亮暗主题、响应式布局、登录后的接口分类与管理。

技术栈与版本以 `package.json` 为准：Next.js + React + **HeroUI v3** + **Tailwind CSS v4** + Supabase（`@supabase/ssr` / `@supabase/supabase-js`）+ Vitest，包管理 pnpm。

## Commands

| Action | Command |
|---|---|
| 启动开发服务器 | `pnpm dev` |
| 生产构建 | `pnpm build`（需要 `.env.local`，见「提交前门禁」） |
| 类型检查 | `pnpm typecheck` |
| Lint 检查 / 自动修复 | `pnpm lint` / `pnpm lint:fix` |
| 运行测试 | `pnpm test`（watch：`pnpm test:watch`） |
| 启动生产服务 | `pnpm start` |
| 发布 | `pnpm release`（release-it + conventional-changelog） |

## Architecture

```
src/
├── app/                  # App Router；每个 API 功能一个目录（index.tsx + ClientComponent.tsx）
│   ├── admin/            # 后台管理（apis / categorys 表格 + CRUD）
│   ├── docs/             # 接口文档页：是 Route Handler 而非 page.tsx，渲染 public/openapi.yaml
│   └── login/            # 登录页
├── components/           # 共享组件（一个组件一个目录，入口 index.tsx）
├── hooks/                # use-swr、use-committed-params、use-supabase-user 等
├── lib/                  # 工具（utils、request、icons、server/、supabase/、swr）
├── services/             # Supabase 数据访问（apis、categorys、common）
├── enums/                # enum-plus 枚举（入口 index.ts）
└── typings/              # 全局类型（index.ts；table-types.ts 禁改，见下）
tests/                    # 镜像 src 结构，*.test.ts；eslint 已忽略，但必须过 tsc
supabase/rls.sql          # RLS 策略，需在 Supabase Dashboard 手动执行
public/openapi.yaml       # 手工维护的 OpenAPI 3.1（/docs 数据源；版本号发版时自动同步）
```

## 硬性约束

1. **HeroUI v3 API（CRITICAL）**：不要套用 v2 记忆里的模式——`<HeroUIProvider>`、`@heroui/theme`、扁平 props 均已废弃。本项目不需要 Provider，组件用 `<Card>` / `<Card.Header>` 这类 **compound 子组件**组合；组件一律从 `@heroui/react` 导入，禁止安装或 import 子包。
2. **UI 只用 HeroUI 构建**：禁止引入其他 UI 库；禁止用 div+CSS 模拟 HeroUI 已有组件（Modal、Dropdown 等）。语义变体用 `primary` / `secondary` / `tertiary` / `danger` / `ghost` / `outline`，不用原始颜色；事件优先 `onPress` 而非 `onClick`。
3. **样式只用 Tailwind CSS**：禁止内联样式或 CSS-in-JS；主题走 CSS 变量 + `oklch`（亮暗由 next-themes 切换），`globals.css` 里 `@import 'tailwindcss'` 必须在 `@heroui/styles` 之前。
4. **客户端数据获取必须走 SWR**（封装见 `src/hooks/use-swr.ts`）；带查询参数的页面一律 `useCommittedParams` + `[pathname, params]` 作为 key（详见 `docs/audit-2026-10.md` 的 D2）。
5. **Supabase 操作必须经过 RLS**。
6. **新增 API 页面**：`index.tsx`（server component 数据获取 + 布局）+ `ClientComponent.tsx`（'use client' 交互），并同步补 `public/openapi.yaml`（细则见 `docs/api-docs.md`）。
7. **改 `src/lib` 与 `src/app/api` 逻辑必须配套 `tests/` 下同名路径的测试**（细则见 `docs/code-standards.md`）。
8. **代码产出遵循 `vercel-react-best-practices` Skill**（`.agents/skills/vercel-react-best-practices`，性能与正确性硬规范，以 Skill 原文为准、勿凭记忆转述）；规则库之间冲突时提问等人工裁决，不得擅自决定。
9. 命名与类型：路由目录 kebab-case（`random-avatar`），组件目录 PascalCase（`UserAvatar`）且入口 `index.tsx`；中文注释；类型集中放 `src/typings/index.ts`，页面内部类型就近声明。

## 禁止修改的文件

`src/typings/table-types.ts`、`eslint.config.mjs`、`next.config.ts`。确需改动时**先提问等人工裁决**，不得擅自修改。`src/lib/supabase/*.ts` 已放开，但改动须谨慎并配套测试。

## 提交前门禁

四道全绿才能提交，任一不过不要提：`pnpm lint`（以 0 warning 为准）、`pnpm typecheck`、`pnpm test`、`pnpm build`。细则见 `docs/code-standards.md`。

- `pnpm build` 需要 env：没有 `.env.local` 时会在 `/api/*` 与页面预渲染阶段报 `@supabase/ssr: Your project's URL and API key are required`，先按 `.env.example` 复制一份（`.env.*` 已被 gitignore）。
- CI 兜底：push(main)/PR 自动跑 lint/typecheck/test；发版走 Release workflow（手动触发，四道预检全绿后 release-it 一键发版）。细则见 `docs/deployment.md` 的「CI 与自动发版」。

## Windows 本地坑

- **lint 冒出上万条 `Delete ␍`**：本机 `core.autocrlf=true` 把 LF 检出成 CRLF 所致，判 lint 是否干净看**去掉 `prettier/prettier` 后还剩几条**。
- **`src/app/opengraph-image.tsx` 的 img 告警**：Windows 平台误报（CI 判定正常且该文件本就被规则豁免），忽略即可；**不要加** `eslint-disable @next/next/no-img-element`（CI 会报 unused）。GridReveal 的行级豁免是真命中，保留。
- 其余踩坑按主题查：password-strength 测试词库 → `docs/code-standards.md`；HeroUI `render` 用法 → `docs/ai-tooling.md`；换字体补原生 DLL → `docs/deployment.md`。

## 文档索引

| 时机 | 文档 |
|---|---|
| 每次开工前（认领待办） | `docs/backlog.md` |
| 改 `/api/*` 前后 | `docs/api-docs.md` |
| 写代码前 / 提交前 | `docs/code-standards.md` |
| 查 HeroUI 用法、Skill、MCP | `docs/ai-tooling.md` |
| 部署、环境变量、发版 | `docs/deployment.md` |
| 升级依赖前 | `docs/upgrades.md` |
| 查某处为什么这么改 | `docs/audit-2026-10.md` |
