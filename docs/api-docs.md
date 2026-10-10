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
- 枚举值取自 `src/enums/index.tsx`。

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

## 不收录

- 管理端写接口（POST/PUT/DELETE、`[id]` 路径）
- `/auth/*`

## 已知漂移（修复前请勿照抄 YAML）

以下 path 的文档与实现不一致，是待办项（编号见 `backlog.md` 的 G1/G2）：

- `info.version` 落后于 `package.json`。
- `/api/bmi`：未声明 `height`/`weight` 的最小值，分级阈值未记录。
- `/api/random-person`：`size` 文档写整数枚举，实现接受 `0128`/`128.0` 这类非枚举值。
- `/api/random-string`：`length`/`count` 非数字时的行为未描述，`characters` 无 `maxLength`。
- `/api/holiday`：非数字 `year` 会静默回退当前年，未描述。

## 校验方式

改完 YAML 后启动 dev 访问 `/docs`，Scalar 解析失败会在页面提示。
