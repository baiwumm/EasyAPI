## 变更说明

<!-- 一句话说明「为什么改」，以及改前改后的行为差异 -->

Closes #

## 涉及范围

- [ ] 页面与路由（`src/app`）
- [ ] 组件（`src/components`）
- [ ] 数据层与接口（`src/lib`、`src/app/api`）
- [ ] 接口文档（`public/openapi.yaml`）
- [ ] 数据库 / RLS（`supabase/*.sql`）
- [ ] 仅仓库级（`docs/`、`.github/`、根配置）

## 一致性与真源检查

- [ ] 新增/修改 `/api/*` 时已同步 `public/openapi.yaml`（参数边界以 route.ts 实际校验为准）
- [ ] 失败响应仍是统一响应壳 `{ code: -1 | 500, msg, data: null, timestamp }`
- [ ] 改 `src/lib` 或 `src/app/api` 时补了 `tests/` 下同名路径的用例
- [ ] 未改动禁改文件（`src/typings/table-types.ts`、`eslint.config.mjs`、`next.config.ts`），或已在下方说明并取得同意
- [ ] 行为变化已回写对应文档（`docs/`）

## 验证结果

<!-- 填实际跑过的命令与结果；未跑的项写明原因 -->

- 本地 `pnpm lint`：
- 本地 `pnpm typecheck`：
- 本地 `pnpm test`：
- 本地 `pnpm build`：

## 截图 / 录屏

<!-- UI 变更必填；无视觉变化可删除本节 -->
