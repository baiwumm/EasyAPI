# 贡献指南

感谢愿意花时间改进 EasyAPI。提 PR 前请先读这一页，以及 [`AGENTS.md`](./AGENTS.md) 里的项目约定。

## 环境要求

- Node.js >= 20.9（Next.js 16 的最低要求；CI 运行于 Node 22）
- pnpm（版本由 `package.json` 的 `packageManager` 字段锁定）

## 本地启动

```bash
pnpm install
cp .env.example .env.local   # 填入自己的 Supabase URL 与 publishable key
pnpm dev
```

首次运行还要按 [`README.md`](./README.md) 的「Supabase 配置」建表并执行 `supabase/rls.sql`。

## 提交前必须通过

```bash
pnpm lint        # ESLint（以 0 warning 为准）
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest run
pnpm build       # 改了页面、路由或构建配置时再跑，需要 .env.local
```

`pnpm lint` / `typecheck` / `test` 都不碰 Supabase；只有 `pnpm build` 需要环境变量。

## 提交信息

使用 Conventional Commits（`feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` / `perf`）。

会话中有 AI 参与时，按 `ai-commit-trailer` skill 追加 trailer 块，要点见 `AGENTS.md` 的「提交信息规范」一节。

## 代码约定（摘要）

完整清单见 `AGENTS.md` 与 [`docs/code-standards.md`](./docs/code-standards.md)，最常踩的几条：

- UI 只用 HeroUI v3 + Tailwind，自研前先查 `.agents/skills/heroui-react`
- 组件目录入口统一 `index.tsx`，路由目录用 kebab-case
- 新增接口页 = `index.tsx`（server component）+ `ClientComponent.tsx`（`'use client'`），并同步 `public/openapi.yaml`
- 客户端数据获取一律走 `src/hooks/use-swr.ts`，带查询参数的页面用 `useCommittedParams`
- 数据库操作必须经过 RLS，不要引入绕过策略的服务端直连
- `src/lib`、`src/app/api` 的逻辑改动必须在 `tests/` 下同名路径补测试
- `src/typings/table-types.ts`、`eslint.config.mjs`、`next.config.ts` 属禁改文件，改动前先开 issue 讨论
- 禁止把 `NEXT_PUBLIC_*` 之外的密钥写进代码或提交

## 报告问题

- 可复现的缺陷 → [Bug report](https://github.com/baiwumm/EasyAPI/issues/new?template=bug_report.yml)
- 使用与部署问题 → [Discussions Q&A](https://github.com/baiwumm/EasyAPI/discussions/categories/q-a)
- 新接口或功能想法 → [Discussions Ideas](https://github.com/baiwumm/EasyAPI/discussions/categories/ideas)
- 安全问题 → 走私密报告，见 [`SECURITY.md`](./SECURITY.md)

## PR 流程

1. 开 issue 或 discussion 说明要解决的问题（小的文档/拼写修正可直接提 PR）
2. 一个 PR 只做一件事，避免夹带无关重构
3. 填完 PR 模板里的验证结果，尤其是 `pnpm lint` 与 `pnpm build` 的实际输出
4. CI 全绿后由维护者合并；依赖类 PR 由 Dependabot 在检查通过后自动合并
