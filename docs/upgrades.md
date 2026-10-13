# 待评估的依赖 major 升级

以下包含 **breaking change，需专项评估后才能动**，不要顺手升级。
评估时重点看「测试是否仍然全绿」与「API 变更影响面」。

| 包名 | 当前版本 | 最新版本 | 说明 |
|---|---|---|---|
| `@dicebear/core` | ^9.4.0 | 10.7.0 | v9→v10 API 变更，其他 dicebear 包仍为 9.4.2，需等统一版本 |
| `@scalar/nextjs-api-reference` | ^0.11.18 | 0.12.9 | 0.x 的 minor 属越范围升级，可能带 breaking，升后需验证 /docs 页渲染 |
| `@zxcvbn-ts/core` | ^3.0.4 | 4.2.0 | 密码强度检测库 v3→v4 API 变化 |
| `@zxcvbn-ts/language-common` | ^3.0.4 | 4.1.3 | 同上 |
| `@zxcvbn-ts/language-zh` | 4.0.0-beta.3 | 4.1.1 | 从 beta 升级到正式版 |
| `crypto-random-string` | ^5.0.0 | 6.0.0 | ESM-only v5→v6 |
| `motion` | ^13.2.0 | 14.1.0 | motion/react v13→v14 major，layout MotionConfig、BackTop、BlurFade 等 7 处使用 |
| `typescript` | ^5 | 7.0.2 | TS 5→7 跨度极大，风险极高 |
| `@types/node` | ^20 | 26.6.5 | Node 类型定义 v20→v26 |
