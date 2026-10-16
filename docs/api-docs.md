# 接口文档维护（Scalar + 手工 OpenAPI）

文档页 `/docs` 的数据源是 `public/openapi.yaml`，**全部手工维护，不使用生成器**。
项目刻意不引入 zod / next-openapi-gen，现有 route.ts 的手写校验保持现状。

## 文档页实现要点

- `src/app/docs/route.ts` 是 **Route Handler**（`export const GET = ApiReference(...)`），
  不是 `page.tsx`——不要建 `app/docs/page.tsx`，会与路由冲突。
- `export const dynamic = "force-static"`，构建期静态化。
- 渲染脚本默认走 jsdelivr CDN；主题色是写死的字面量
  （Scalar 页面是独立 HTML，读不到站点 CSS 变量，改主题色需同步改这里）。

## 新增接口必须同步补文档

在对应 tag（每日推荐 / 随机生成 / 心灵语录 / 生活服务）下添加 path：

- 路径写完整 `/api/xxx`；`operationId` 用 `getXxx` 驼峰。
- `summary` 与 route.ts 头注释 `@Description` 一致。
- 中文描述；**参数约束（必填、边界、默认值、枚举）以 route.ts 实际校验逻辑为准**，
  不要照抄前端——前后端口径漂移是已知问题（见下）。
- 枚举值取自 `src/enums/index.ts`。

### 响应体写法

- JSON 响应用 `allOf` 引用 `#/components/schemas/Envelope` 再覆盖 `data`。
- 每个接口只写 `"200"` 一个响应，错误语义由 Envelope 的 `code` 统一说明。
- 文案类接口（支持 `format=text`）直接引用 `#/components/responses/TextContentResponse`。
- 分页接口复用 `PageIndex` / `PageSize` 参数与 `PageMeta` 模型。
- 图片直出接口（PNG/SVG）在 `responses."200".content` 下并列 `image/*` 与
  `application/json`，不套 Envelope。

### 响应体契约

所有 JSON 接口返回 `{ code, msg, data, timestamp }`，HTTP 状态码恒为 200：

| code | 含义 | data |
|---|---|---|
| `200` | 成功 | 业务数据 |
| `-1` | 数据已存在（唯一性冲突） | `null` |
| `500` | 失败（参数错误、无数据、服务端错误） | `null` |

写 route.ts 时**必须遵守这个契约**：返回失败时 `data` 是 `null` 而不是空数组/空对象。
历史上 `chinese-poetry` / `riddle` 曾在 RPC 无结果时返回 `code:200 + data:{}`，
已被测试钉住（见 `tests/app/api/supabase-routes.test.ts`）。

## 修改接口

同步改 YAML 对应 path 的参数与响应模型。**不要只改代码不改 YAML。**

## 限流（Vercel WAF，边缘层）

全站 `/api/*` 在 Vercel Firewall 配了按 IP 的固定窗口限流：**30 次 / 60 秒**，超限由边缘直接返回
`429 Too Many Requests`（纯文本，**不是** Envelope JSON——调用方按 HTTP 状态码处理，不要解析 body；
站点应用层感知不到这类请求，Envelope 的 `code:500` 是另一层业务失败语义）。

- 规则不在代码里：Vercel Dashboard → 项目 → Firewall →「API 限流 · IP 防刷」，
  任何改动需 **Review Changes → Publish** 才生效；规则被删或关闭时应用层没有兜底限流。
- 计数按 Vercel 处理区域独立（同一 IP 打到不同区域各有 30 次），这是平台行为不是配置问题。
- 应急：遇到大规模分布式刷时，Firewall 里可临时打开 Attack Challenge Mode / Bot Protection
  保命（代价是牺牲 API 可直连性，同上次事件），平时保持关闭。
- 上线验证记录（2026-10-14）：并发 40 发 → 精确 30 放行 / 10 个 429；约 65 秒后窗口重置恢复 200。

## 不收录

- 管理端写接口（POST/PUT/DELETE、`[id]` 路径）
- `/auth/*`

## 历史漂移（已全部修复）

文档与实现曾出现 5 处漂移（`info.version`、`/api/bmi`、`/api/random-person`、
`/api/random-string`、`/api/holiday`），已于 2026-10 按 route.ts 实际校验逻辑补齐
（编号 G1/G2，明细见 `backlog.md` 的「已完成」）。教训即上文红线：**参数约束以
route.ts 为准，不要照抄前端**。

> `info.version` 由发版流程自动同步：`.release-it.json` 的 `after:bump` hook
> 读 bump 后的 `package.json` 写入本文件并纳入 Release 提交，无需手改
> （见 `docs/deployment.md` 的「CI 与自动发版」）。

## 校验方式

改完 YAML 后启动 dev 访问 `/docs`，Scalar 解析失败会在页面提示。
