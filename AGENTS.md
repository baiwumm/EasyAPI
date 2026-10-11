# AGENTS.md

AI agents 在本仓库工作的入口规范。**只看本文件不够，按下面的索引去读 `docs/` 里的专题文档。**

## Project

**EasyAPI** — 基于 Next.js 16 (App Router) + Supabase 的 API 聚合平台（api.baiwumm.com），
收录 30+ 个高频接口（每日推荐、随机生成、心灵语录、生活服务等），支持亮暗主题、
响应式布局、登录后的接口分类与管理。

### Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.3.x | Framework（App Router） |
| React | 19.2.x | UI framework |
| HeroUI | 3.2.x（`@heroui/react` / `@heroui/styles`） | UI 组件库 |
| Tailwind CSS | 4.x（`@tailwindcss/postcss`） | 样式 |
| Supabase | `@supabase/ssr` + `@supabase/supabase-js` | 数据存储与鉴权 |
| Vitest | 5.x | 单元测试（`tests/` 镜像 `src/`） |
| 包管理 | pnpm | 依赖管理 |

## Commands

| Action | Command |
|---|---|
| 启动开发服务器 | `pnpm dev` |
| 生产构建 | `pnpm build` |
| 类型检查 | `pnpm typecheck` |
| Lint 检查 | `pnpm lint` |
| Lint 自动修复 | `pnpm lint:fix` |
| 运行测试 | `pnpm test`（watch：`pnpm test:watch`） |
| 启动生产服务 | `pnpm start` |
| 发布 | `pnpm release`（release-it + conventional-changelog） |

## Architecture

```
src/
├── app/                  # App Router，每个 API 功能一个目录（index.tsx + ClientComponent.tsx）
│   ├── layout.tsx        # 根布局（next-themes + HeroUI Toast + MotionConfig）
│   ├── admin/            # 后台管理（apis / categorys 表格 + CRUD）
│   ├── login/            # 登录页
│   └── docs/             # 接口文档页（Scalar Route Handler，渲染 public/openapi.yaml）
├── components/           # 共享组件（一个组件一个目录，入口 index.tsx）
├── hooks/                # 自定义 hooks（use-swr、use-copy、use-supabase-user 等）
├── lib/                  # 工具（utils、request、icons、server/、supabase/、swr）
├── services/             # Supabase 数据访问（apis、categorys、common）
├── enums/                # enum-plus 枚举定义
└── typings/              # 全局类型（index.ts：Api/Category/Columns/PaginatingParams；table-types.ts：TanStack Table）
tests/                    # 镜像 src 结构，*.test.ts；已被 eslint globalIgnores 忽略，但必须过 tsc
supabase/rls.sql          # 数据库 RLS 策略（需在 Supabase Dashboard 手动执行）
public/openapi.yaml       # 手工维护的 OpenAPI 3.1 接口文档（/docs 页数据源）
```

## Conventions

- **HeroUI v3 API（CRITICAL）**：不要套用 v2 模式（`<HeroUIProvider>`、`@heroui/theme`、扁平 props 均已废弃）。本项目不需要 Provider，组件直接用 `<Card>` / `<Card.Header>` 等 **compound 子组件**组合。
- **语义变体**：用 `primary` / `secondary` / `tertiary` / `danger` / `ghost` / `outline`，不要直接用原始颜色。
- **事件**：优先 `onPress` 而非 `onClick`（无障碍）。
- **样式**：`globals.css` 中必须先 `@import 'tailwindcss'` 再 `@import '@heroui/styles'`；主题基于 CSS 变量 + `oklch` 色值，亮暗切换由 `next-themes` 控制，`@custom-variant dark (&:is(.dark *))`。
- **import 规范**：组件一律从 `@heroui/react` 导入（如 `Button`、`Card`、`Table`、`Toast`、`toast`、`cn`），不要单独安装子包；`next.config.ts` 已配置 `optimizePackageImports: ['@heroui/react']`。
- 新增 API 页面遵循既有模式：`index.tsx`（server component 数据获取 + 布局）+ `ClientComponent.tsx`（'use client' 交互），**并同步补 `public/openapi.yaml`**（细则见 `docs/api-docs.md`）。
- **客户端数据获取用 SWR**，封装见 `src/hooks/use-swr.ts`；带查询参数的页面一律用 `useCommittedParams` + `[pathname, params]` 作为 key（详见 `docs/audit-2026-10.md` 的 D2）。
- 类型定义集中放在 `src/typings/index.ts`，页面内部类型就近声明。
- **改 `src/lib` 与 `src/app/api` 下的逻辑必须配套 `tests/` 下同名路径的测试**（细则见 `docs/code-standards.md`）。
- 中文注释、目录命名 kebab-case，组件文件命名 `index.tsx`。

## AI 使用约束（强制规范）

### 禁止修改的文件

- `src/lib/supabase/*.ts` — Supabase 客户端配置，涉及认证安全
- `src/typings/table-types.ts` — TanStack Table 类型定义
- `eslint.config.mjs` — ESLint 配置，修改可能导致 CI 失败
- `next.config.ts` — Next.js 配置，影响构建行为

> 若某处改动确实需要动这些文件，**先提问等人工裁决，不得擅自修改**。

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
5. **代码生成与重构必须遵循 `vercel-react-best-practices` Skill**（`.agents/skills/vercel-react-best-practices`），是所有代码产出的硬性性能与正确性规范

### 提交前门禁

四道全绿才能提交，任一不过不要提：`pnpm lint`（以 0 warning 为准）、
`pnpm typecheck`、`pnpm test`、`pnpm build`。细则见 `docs/code-standards.md`。

## 相关链接

- 在线预览：https://api.baiwumm.com/
- GitHub：https://github.com/baiwumm/EasyAPI
- **剩余待办：`docs/backlog.md`（开工前先读，认领任务）**

## Notes

快速补充区：新约定、踩坑记录放这里。

- **`pnpm build` 需要 env**：没有 `.env.local` 时构建会在 `/api/*` 与页面预渲染阶段报
  `@supabase/ssr: Your project's URL and API key are required`。本地跑门禁前先按
  `.env.example` 复制一份占位值即可（`.env.*` 已被 gitignore）。
- **`@zxcvbn-ts/language-zh` 不能裸 `require`**：其 CJS 入口会 require
  `@zxcvbn-ts/dictionary-compression/decompress`，而该包 CJS 产物是
  `module.exports = { default: fn }`，直接调用会抛 `decompress is not a function`。
  Next 的 bundler 会做默认导出 interop 所以线上正常；vitest 走原生 require 会炸，
  `tests/app/api/password-strength-route.test.ts` 里用替身词库绕开。
- **本地 lint 会有上万条 `Delete ␍`**：本机 `core.autocrlf=true` 把 LF 检出成 CRLF，
  而仓库里存的是 LF。判lint是否干净要看**去掉 prettier/prettier 后还剩多少条**。
- **HeroUI 的 `render` 只接受函数，不接受元素**：这个版本的 RAC 底层是
  `render ? (props) => render(props, values) : undefined`，写元素形式
  （`render={<Link href="/" />}`）运行时会抛 `render is not a function`。
  正确写法是 `render={(props) => <Link {...props} href="/" />}`；
  Next 的 Link 不吃 Button 的 DOM props 时，至少把 `props.className` 传过去保住样式
  （见 `src/app/not-found.tsx`）。

## 文档索引

`AGENTS.md` 只保留入口必读内容，专题细则全部在 `docs/`：

| 文档 | 内容 | 何时读 |
|---|---|---|
| `docs/backlog.md` | **剩余待优化项与待办** | 每次开工前 |
| `docs/api-docs.md` | 接口文档维护（Scalar + 手工 OpenAPI） | 改 `/api/*` 前后 |
| `docs/code-standards.md` | 代码规范与质量门禁、测试规范 | 写代码前、提交前 |
| `docs/ai-tooling.md` | HeroUI 文档查询、Skill/MCP、推荐工具库 | 查 HeroUI 用法时 |
| `docs/deployment.md` | 部署流程与完整环境变量清单 | 部署、新增配置项时 |
| `docs/upgrades.md` | 待评估的依赖 major 升级 | 升级依赖前 |
| `docs/audit-2026-10.md` | 本次审计的完整问题清单与修复记录 | 想了解某处为什么这么改 |

完整索引见 [`docs/README.md`](./docs/README.md)。
