# 待评估的依赖 major 升级

以下包含 **breaking change，需专项评估后才能动**，不要顺手升级。
评估时重点看「测试是否仍然全绿」与「API 变更影响面」。

| 包名 | 当前版本 | 最新版本 | 说明 |
|---|---|---|---|
| `@dicebear/core` | ^9.4.0 | 10.7.0 | v9→v10 API 变更，其他 dicebear 包仍为 9.4.2，需等统一版本 |
| `@zxcvbn-ts/core` | ^3.0.4 | 4.2.0 | 密码强度检测库 v3→v4 API 变化 |
| `@zxcvbn-ts/language-common` | ^3.0.4 | 4.1.3 | 同上 |
| `@zxcvbn-ts/language-zh` | 4.0.0-beta.3 | 4.1.1 | 从 beta 升级到正式版 |
| `crypto-random-string` | ^5.0.0 | 6.0.0 | ESM-only v5→v6 |
| `typescript` | ^5 | 7.0.2 | TS 5→7 跨度极大，风险极高 |
| `@types/node` | ^20 | 26.4.1 | Node 类型定义 v20→v26 |

## 顺带待办

- **G4：锁定包管理器版本**。`package.json` 缺 `packageManager` 字段，
  pnpm 大版本行为差异曾导致 `pnpm-workspace.yaml` 的 `trustPolicy` 非法值
  让所有 pnpm 命令瘫痪（A1）。加字段会迫使 `pnpm-lock.yaml` 写入
  `packageManagerDependencies`，与业务改动混在一起，故当时撤回。
  **建议单独一个 commit 处理。**
