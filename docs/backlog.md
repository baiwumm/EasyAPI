# 待办清单（backlog）

**开工前先读这里。** 已完成的工作见 `audit-2026-10.md`，不要重复做。
本文只列**剩余**项，按优先级分四组。

约定：认领某项后在「状态」列标注 `进行中 @名字/日期`，完成后移到文末「已完成」。

---

## 第一组：安全与正确性（建议优先）

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| C6/C7 | `src/lib/supabase/proxy.ts` | 中间件职责重叠：`/api` 分支提前 return 绕过登录态校验；OAuth 分支用 `NextResponse.rewrite` 清理 `?code=`，但 rewrite 不改变浏览器地址栏，注释写的「跳首页」没实现，且该分支丢弃 `supabaseResponse` 上刷新的 cookie | 先更新 `AGENTS.md` 禁止清单放开该文件，再把鉴权守卫上移到 `src/proxy.ts`（不在禁止清单内），`proxy.ts` 只留 session 刷新；OAuth 的 code 交换由 `@supabase/ssr` 浏览器端完成，服务端不应 redirect（会丢 code） | P1 | ⛔ 被规则拦截，待人工裁决 |
| F1 | `src/lib/supabase/proxy.ts:50-63` | `increment_call_count` 每次调用随机 `+1~10`（非真实调用量）；RPC 是 `void` fire-and-forget，Serverless 冻结后可能随机漏计 | 计数改固定 +1 或聚合后批量写。**另需人工确认该函数是 `SECURITY DEFINER`**：RLS 收紧写权限后它不是就会被拦，表现为接口卡片调用次数静默停涨。确认 SQL：`select prosecdef from pg_proc where proname='increment_call_count';` | P2 | 待办 |

## 第二组：性能

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| F4 | `src/app/opengraph-image.tsx:36-38` | 3 个 `publicAssetToDataUrl` 在模块作用域启动，但 `ImageResponse` 每请求重渲染 | 构建期生成或 `revalidate = 86400` | P3 | 待办 |
| F7 | `src/components/GridReveal/index.tsx` | 631 行 canvas 引擎，`random-image` 页最多 20 实例，每个都跑 rAF + IntersectionObserver + ResizeObserver | 首屏外实例降级为普通 `<img>`；拆分为 `buildTree`/`measure`/`drawScene` 纯模块 | P3 | 待办 |
| F8 | `src/app/globals.css:12-21` | 自托管 `maple-mono-cn-regular.woff2` **1.7MB**，`unicode-range` 覆盖整个 CJK 区，几乎必然全量下载 | 按区段拆多个 `@font-face`（latin / 常用汉字 / 完整汉字），首屏负担压到约 40KB | P2 | 待办 |
| C5 | `src/lib/supabase/proxy.ts:42-64` | 每次 `/api/*` GET 额外 2 次 DB 往返（`ea_apis` count 查询 + 计数 RPC），即使该路由已带 `Cache-Control` 中间件仍会跑 | 与 F1 一并处理 | P2 | 待办 |

## 第三组：UI / 交互 / 可访问性

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| D1 | `src/hooks/use-swr.ts:46` | `loading = isLoading \|\| isValidating`，被 `RequestContent` 当「替换式 loading」用；任何后台再验证都会整块卸载重挂结果区（含 `TypingAnimation`/`GridReveal` 这类有状态动画） | 拆出 `isLoading`（首屏）与 `isValidating`（后台）两个语义；覆盖式 spinner 用 `TableLoading` | P2 | 待办 |
| D3 | `src/components/BackTop/index.tsx:61-65` | `useMotionValueEvent` 每帧 `setRingValue`，滚动时整个组件 60fps 重渲染 | `ProgressCircle` 的 value 直接用 CSS 变量 / SVG `stroke-dashoffset` 驱动，删掉 state | P2 | 待办 |
| D13 | `src/components/StaggerIn/index.tsx:34` | `Children.map` 给每个 child 包一层 `motion.div`，**破坏 CSS grid/flex 布局**（`random-color` 靠子元素自身样式兜住） | 改用 `variants` 传播，不额外包 DOM | P3 | 待办 |
| D15 | `src/components/AlertContent/index.tsx:39-56`、`ErrorContent` | 桌面/移动两套 Button 靠 `sm:hidden`/`hidden sm:block`，两个都在 DOM 里，键盘用户会 Tab 到隐藏的重复按钮 | 用一套响应式 class 的按钮 | P3 | 待办 |
| D16 | `src/app/not-found.tsx:32-34` | `<Link><Button></Link>` 产出 `<a><button>`，嵌套交互元素 | HeroUI v3 写法：`<Button render={<Link href="/" />}>` | P3 | 待办 |
| D17 | `src/components/CopyChip/index.tsx:29` | `onClick` 直接挂在 render 出的 button 上，绕过 HeroUI `onPress` 抽象；render prop 每次渲染新建函数 | 用 `render={<button/>}` + `onPress` | P3 | 待办 |
| D19 | `src/app/api/apis/route.ts:26-27,45-47` | `pageIndex` 无上限（`pageSize` 有 1000 上限），`?pageIndex=1e9` 让 PostgREST `.range()` 报错而非友好提示 | 用 `parseBoundedInt` 统一 | P3 | 待办 |
| D20 | `src/components/ColumnsVisibility/index.tsx:28-34` | `handleSelectionChange` 每次交互对所有列 `toggleVisibility()`，O(N) 次 state 写入 | 合并为一次批量 set | P3 | 待办 |
| — | `src/typings/index.ts:5-12` | 公共 `Columns` 的 `user_id` 与 `emial`（`email` 拼写错误）在 `Api`/`Category` 上不存在 | 删除无用字段；若要用邮件字段修正拼写 | P3 | 待办 |
| — | `src/enums/index.tsx`、`src/hooks/use-copy.tsx` | 文件扩展名与内容不符：前者是 `.tsx` 但纯数据无 JSX；后者是 `.tsx` 且有 JSX（正确） | 前者重命名为 `.ts` | P3 | 待办 |

## 第四组：测试覆盖缺口

| ID | 位置 | 缺口 | 建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| T1 | `src/app/admin/components/{apis,categorys}/components/save-modal.tsx` | 2 个表单 0 覆盖。涉及 HeroUI Form + SWR mutation，且 `Number("")===0` 会被静默提交（客户端原生校验靠 `minValue` 兜住，服务端不校验——见 C14） | 需 jsdom + `@testing-library/react`；补「必填校验」「提交 payload 形状」「失败后状态复位」 | P2 | 待办 |
| T2 | D2 的 17 处 SWR key 改动 | 只有编译期保障，无行为保障。核心语义未验证：改参数不请求、点提交才请求、参数没变时走 `mutate()` | 需渲染测试 + SWR 的 `useSWRConfig` mock/cache 隔离；优先覆盖 `JsonContent`（三页共用）与 `QuoteWorld`（九页共用） | P2 | 待办 |
| T3 | 管理端 CRUD 路由（`apis`/`categorys` 的 POST/PUT/DELETE） | 0 覆盖。`requireAdmin` 鉴权 + 写入链 + 唯一性冲突分支 | mock 模式已由 `tests/app/api/supabase-routes.test.ts` 铺好，补起来快 | P3 | 待办 |

## 文档与工程

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| G1 | `public/openapi.yaml:7` | `info.version: 2.8.1` ≠ `package.json` 的 `2.9.0`，违反「跟随 package.json」约定 | 发版时同步 | P3 | 待办 |
| G2 | `public/openapi.yaml` | 与实现有 5 处漂移：bmi 无最小值/阈值未记录、random-person 的 size 接受非枚举值、random-string 非数字行为未描述且 characters 无 maxLength、holiday 的 year 静默回退未描述 | 详见 `docs/api-docs.md` 的「已知漂移」小节，按实际校验逻辑补齐 | P3 | 待办 |
| G4 | `package.json` | 缺 `packageManager` 字段，pnpm 大版本行为差异曾引发 A1 | 单独一个 commit 处理（会牵动 lockfile） | P3 | 待办 |
| G5 | `.env.example` | `NEXT_PUBLIC_AUTHOR_ROLE` 未登记（只在 `opengraph-image.tsx` 用到） | 补一行并注明用途 | P3 | 待办 |
| G6 | `src/components/ApiCard/index.tsx` | 整卡是一个 `<Link>` 但无 `aria-label`；`desc` 用 `line-clamp-2` 截断但无 `title`/tooltip；`isNew` 的 7 天判定在服务端与客户端各算一次，跨边界时 SSR/CSR 可能不一致 | 补 `aria-label`；用 `title` 或 Tooltip 展示完整描述 | P3 | 待办 |
| G8 | `src/app/api/random-image/route.ts` | 走 `faker.image.url()` 指向第三方 loremflickr，第三方挂掉则整页图片全废 | 换自有图源或本地图库 | P2 | 待办 |

## 已完成

- `C9` Bing 壁纸地址剥离正则与返回前校验 —— 见 `audit-2026-10.md`
- `C10` barcode JsBarcode 选项白名单（含 YAML 同步）
- `C13` password-strength 改 POST + 限流 + 不回显密码（含 `rate-limit` 与 `getClientIp` 工具）
- `C12` ip-region 区分显式/自动 IP 的缓存策略 + JSON 兜底（含 YAML 同步）
- `C14` write-guard update 空 payload 拦截 + 字段取值范围校验（镜像前端 save-modal）
- `F2` 首页 ISR：后台写操作后 `revalidatePath('/')`（未用 `revalidateTag`，原因见 `lib/server/home.ts` 注释）
- `F3` random-avatar SVG LRU 缓存（`lib/server/avatar-cache.ts`，上限 200 条）
- `F6` random-avatar 改单次批量请求（`format=data` 直出 data URI，未采用「只返 URL」方案，原因见路由注释）
- `G7` use-image-generation 显式 apiPath + 复用请求层超时/401 + blob URL 统一回收（`httpRequest.raw`）
- `F5` barcode PNG 栅格化前校验 SVG 声明尺寸，超限返回可读文案（不再透出 sharp 原文）
- `A1` B1 B2 B3 B4 B5 B7 B9 C1 C3 D2 D9 D11 D18 + `almanac` UTC 偏移 —— 见 `audit-2026-10.md`
- 测试框架引入 + 122 条测试（`tests/`）—— 见 `docs/code-standards.md`
- `C2` RLS 策略 —— 按裁决跳过（库侧已手工配置），`rls.sql` 已回退到改动前版本
