# 依赖升级台账

## 待评估的依赖 major 升级

以下包含 **breaking change，需专项评估后才能动**，不要顺手升级。
评估时重点看「测试是否仍然全绿」与「API 变更影响面」。

| 包名 | 当前版本 | 最新版本 | 说明 |
|---|---|---|---|
| `@dicebear/core` | ^9.4.3 | 10.7.0 | v9→v10 API 变更，其他 `@dicebear/*` 仍为 9.4.2，需统一版本后一起升 |
| `typescript` | ^5.9.3 | 7.0.2 | TS 5→7 跨度极大，风险极高（dependabot 已 ignore major） |
| `@types/node` | ^20 | 26.6.6 | Node 类型定义 v20→v26 |

## 已完成的 major 升级（2026-11-24）

集中在 `chore/repo-health` 分支一次性合入 main，全量门禁
（`pnpm lint` / `typecheck` / `test` / `build`）通过：

| 包名 | 变更 | 处理方式 |
|---|---|---|
| `@zxcvbn-ts/core` / `language-common` / `language-zh` | 3.x → 4.3.0 / 4.2.0 / 4.1.2 | 迁到 `ZxcvbnFactory`，对外响应结构保持不变（见 `src/app/api/password-strength/route.ts`） |
| `crypto-random-string` | 5.0.0 → 6.0.0 | v6 起 ESM-only，项目本就是 ESM，用法兼容 |
| `motion` | 13.5.1 → 14.14.0 | `motion/react` 核心 API 稳定，7 处用法无需改 |
| `@scalar/nextjs-api-reference` | 0.11.x → 0.12.21 | 由 dependabot minor-patch 组带入，`/docs` 渲染正常 |
