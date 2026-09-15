# EasyAPI 全项目审查清单（2026-09-14）

> 本文件是定时修复任务的执行依据，条目编号（1-61）是提交信息与修复记录的引用基准。
> 此文件为未跟踪文件，不要提交到 git。

**总评**：项目底子不错——RLS 三层防护、bing-wallpaper 的缓存模式、BackTop/TimeAndLunar 的动画细节都做得好。但存在 19 处严重缺陷（含 1 个 SEO 灾难、2 个数据正确性 bug、3 个安全/DoS 面问题）、约 30 处明显问题，以及一个结构性问题：**33 个功能页中 30 页可模板化，预计能净删 2000+ 行重复代码**。

## 🔴 一、严重缺陷

### 功能 bug（数据错误，用户可直接感知）

1. **holiday 默认返回 2022 年数据** — `src/app/api/holiday/route.ts:23-26`。`Number(null)===0`（不是 NaN），被 clamp 到 `minYear=2022`。现在（2026 年）不带参数请求会拿到 4 年前的节假日。
2. **solar-term 24 节气中 17 个返回英文名** — `src/app/api/solar-term/route.ts:44-52`。中文映射枚举只写了 7 个键，`CHUN_FEN`、`QING_MING` 等 17 个以英文原样输出。
3. **holiday 调休上班日数组被清空** — `src/app/api/holiday/route.ts:86`。`isWork ? [...累积] : []`，遇休息日就把已累积的调休日重置为空（调休日在假期首日之前时必触发）。
4. **country-code 前端列标签与检索字段疑似颠倒** — `src/app/country-code/ClientComponent.tsx:53-54` 标"国家（中文）"的字段取 `englishName`；且默认 `keyword="中国"` 与后端只搜英文名逻辑矛盾，默认态可能直接"暂无数据"（需对照 DB 实际字段确认，属需产品/数据确认项）。
5. **qrcode 页业务错误 JSON 被当图片解析** — `src/app/qrcode/ClientComponent.tsx:52-73`。服务端返回 `{code:500,msg}` 时 `json.data` 为 undefined，`imgSrc` 被设为 undefined，渲染坏图。barcode 页已正确处理（先查 contentType），qrcode 漏了。

### 水合不安全（SSR/CSR 渲染不一致，首屏闪烁）

6. **3 处 `useState` 随机函数初始化** — `src/app/color-conversion/ClientComponent.tsx:59`、`tailwind-color-palette/ClientComponent.tsx:52`（`tinycolor.random()`）、`random-avatar/ClientComponent.tsx:77,83`（随机姓名池）。服务端与客户端各随机一次必然不同 → hydration mismatch。修法：`useState(null)` + effect 中初始化或固定种子。
7. **almanac 初始日期有时区水合风险** — `src/app/almanac/ClientComponent.tsx:54-56`。服务端 UTC 与用户时区不同天时 DatePicker 初始值两端不一致。

### 安全 / 稳定性

8. **ip-region 多重问题** — `src/app/api/ip-region/route.ts`：无 IP 格式校验直接拼 URL（注入）、`http://ip-api.com` 明文 HTTP、两个外部 fetch 均无 `res.ok` 检查、无超时、`res.text()` 未 trim、ip-api 免费版限流 45 次/分钟无降级。
9. **like / `.or()` 过滤器注入 5 处** — `apis/route.ts:68`、`categorys/route.ts:54`（`%`/`_` 通配符未转义，可全表扫描）；`country-code:36`、`license-plate:37`、`postal-code:70-72`（用户输入的逗号/括号会改变 PostgREST 过滤语义）。
10. **公开分页接口 pageSize 无上限** — `apis/route.ts:26`、`categorys/route.ts:19`。`pageSize=100000` 一次拉全表，categorys 还带嵌套 `apis:ea_apis(*)` 双重放大，可低成本刷穿 Supabase 配额。
11. **barcode 参数无界** — `src/app/api/barcode/route.ts`。text 无长度上限（qrcode 限 2000）、width/height 任意大直传 JsBarcode + sharp，可生成超大 SVG/PNG 耗尽内存。
12. **管理端写接口 body 零校验直接透传** — `apis/route.ts:118-122`、`apis/[id]/route.ts:81-86`、`categorys/route.ts:118-125`、`categorys/[id]/route.ts:78-86`。`insert(body)`/`update(body)` 无字段白名单，可携带 `created_at`、`call_count` 等任意列（有 requireAdmin 兜底）。

### 后台（admin）

13. **401/网络错误完全静默** — `src/lib/request.ts:89-91`（HTTP 非 2xx 直接 throw 不 toast）+ `use-swr.ts:28`（`throwOnError:false` 吞错）+ `save-modal.tsx:56-64`（`error` 从不消费）。session 过期后保存/删除无任何提示无跳转，用户以为成功。全仓库无一处 401 → 跳转登录的逻辑。
14. **删除分类无服务端级联检查 + 孤儿数据崩整表** — 服务端直接删（`categorys/[id]/route.ts:33-39`），仅靠客户端守卫（数据可能陈旧）；一旦产生孤儿 api，`apis/columns.tsx:69` 的 `row.category.name` 无空值保护（对比同文件 desc 列有保护），accessorFn 抛 TypeError 崩掉整个 DataTable。依赖 #10 思路：服务端先查引用计数。
15. **categorys 保存弹窗可被误关丢输入** — `categorys/save-modal.tsx:74` 无 `isDismissable={false}`（apis 版 `save-modal.tsx:97-99` 有）。点遮罩/ESC 即关，非受控表单输入全丢，叠加 #13 的静默失败形成复合事故。

### 全局基础设施

16. **FullLoading 把全站内容挡在水合之后** — `layout.tsx:82-84` + `FullLoading/index.tsx:21-30`。所有页面首屏 HTML 只有"加载中"+Footer，不执行 JS 的爬虫（必应、社交卡片抓取器）看到的是空站，LCP 也被推迟。全项目最大的单点问题。修法：SSR 正常渲染 children + 水合前叠加透明 overlay，不要替换 children；连带修复点：TimeAndLunar 的 `new Date()` 初始值在水合后启动或加 `suppressHydrationWarning`。
17. **RLS 启用后 call_count 计数静默坏死** — `supabase/rls.sql:70-75` 的 `SECURITY DEFINER` 修复只写在注释里未执行；`proxy.ts:51-54` 调用 RPC 不解构 error。启用 RLS 后除管理员外所有调用的计数不再增长，且无任何报错。修复：把 `ALTER FUNCTION ... SECURITY DEFINER`（配 `SET search_path`）纳入脚本必执行部分；proxy 解构 rpc error 并记录。
18. **无任何 `error.tsx` 错误边界** — 全项目仅 `loading.tsx`/`not-found.tsx`。`bing-wallpaper/page.tsx:25-28` 直接 await 外部 fetch，首次失败且无缓存时整页崩到 Next 默认错误页。
19. **TypingAnimation 三重缺陷** — `src/components/TypingAnimation/index.tsx`：gsap 无限 `repeat:-1` 补间无清理（卸载后空转，:102-113）；`pauseDuration` 句间停顿因空 setTimeout 立即被 cleanup 清掉而从未生效（:138 + :173）；`text=[]` 时 `textArray[currentTextIndex].length` 抛 TypeError（:194）。修好后可用纯 CSS 替换 gsap（全项目唯一 gsap 使用点，可顺带评估移除依赖）。

## 🟠 二、明显问题

### API 层

20. **RPC 返回 null 时 format=text 必崩 10 处** — chicken-soup/cold-fact/dairy-joke/dog-diary/kfc/love-words/swearing/tongue-twister 各 `:36`、hitokoto:64、diary-poetry:38。`data.content` 在表空时 TypeError 落 catch。
21. **parseInt NaN 静默返回空数组 7 处** — random-emoji/color/idcard/image/person 等。`clamp(parseInt(x),1,N)` 对 NaN 短路，返回 200 空数组而非参数错误（正确反例：qrcode `:55` 显式 Number.isNaN 校验）。
22. **DB 错误谎报"未找到"** — `country-code/route.ts:38-42`、`license-plate/route.ts:40-44`。连接/权限错误被当业务空结果；且与 postal-code 查空显式报错的行为矛盾。
23. **dairy-joke / tongue-twister 裸返回整行** — 各 `:43`。暴露 `id`、`created_at` 等内部列，与其他 5 个同类路由 `pick(["content"])` 的契约不一致。
24. **diary-poetry 裸 fetch 外部服务** — `route.ts:21`。无超时、无缓存、无重试（bing-wallpaper.ts 是正确示范，应复用其模式）。
25. **password-strength 密码走 GET 明文** — `route.ts:33`。密码进 URL 会落访问日志/CDN/浏览器历史，建议改 POST（注意：改请求方法会影响前端调用方式与对外文档，属可能改变线上行为项，可先记录）。
26. **hitokoto 校验缺口** — `route.ts:22-24` types 无白名单直传 RPC；minLength/maxLength 无范围无交叉校验。
27. **魔法数字 -1 与 catch 写法不一致** — 23505 冲突用 `-1` 不用枚举（apis/route.ts:128、apis/[id]/route.ts:92、categorys/route.ts:131、categorys/[id]/route.ts:92）；`apis/[id]/route.ts:48-50` 是全项目唯一不用 `catchError` 的 catch。
28. **almanac 日期输出不补零** — `route.ts:66` 输出 `2026-3-4`，与入参要求的 `YYYY-MM-DD` 契约不一致。

### 前端交互

29. **11 个表格页首屏闪"暂无数据"** — almanac/country-code/holiday/license-plate/random-emoji/random-user/solar-term/postal-code + JsonContent（波及 idcard/ip-region/password-strength）。loading 走遮罩不走 `RequestContent`，空态与加载态同屏；`SkeletonContent` 组件已存在却零使用。正确做法：isLoading（首次）时渲染表格骨架。
30. **替换式 loading 全站闪屏** — `use-swr.ts:55` `loading = isLoading || isValidating`，无一处 `keepPreviousData`。点"换一句/生成"时打字动画被卸载重打、结果 chips 清空重出；表格页反而做对了（遮罩保留旧数据），两种策略应统一。
31. **业务错误后 stale 展示** — barcode 改参数生成失败时保留旧条形码（用户以为成功）；QuoteWorld 把"服务器开小差了"兜底文案逐字打出来伪装成正常内容。
32. **全站 0 个表单支持回车提交** — 10+ 个输入页面无 `<form>`/onSubmit，只能鼠标点按钮。HeroUI Form + submit 按钮一层即可解决。
33. **文案残留 3 处** — barcode 页输入框写"二维码内容"（:245）；postal-code toast 写"keyWord"（:55，别处都是 keyword）；bing-wallpaper 页面标题"bind 每日壁纸"（:19,35）。
34. **admin：删除最后一页最后一条后滞留越界空页** — `apis/index.tsx:130-139`、`categorys/index.tsx:106-115`，分页按钮只剩第 1 页且无高亮，看似数据全丢。修复：删除成功后若当前页只剩被删行且 pageIndex>0，先 pageIndex-1 再刷新。
35. **admin：Select 无 validate + onSubmit 无兜底** — `save-modal.tsx:119-144,217-241`。空 `category_id` 直发服务端 → FK 原始错误 toast 给用户。
36. **admin：`useOverlayState` 对象每次渲染新引用，击穿 useCallback → columns useMemo 形同虚设** — `apis/index.tsx:117-123,162-165`。修复：依赖改为 `[saveModalState.open]` 或解构后使用。
37. **admin：跨 tab 分类下拉缓存不同步** — apis tab 用独立 key `"/categorys:list"`（`apis/index.tsx:68-76`），categorys tab 保存成功后不联动刷新它。
38. **admin：`handleReset` 条件漏判 pageSize 导致双请求竞态** — `apis/index.tsx:101-114`、`categorys/index.tsx:82-90`。
39. **登录页 `toast.clear()` 竞态** — `login/ClientComponent.tsx:88-90`。2 秒后无条件全局清空，慢网络下吞掉进行中的提示，直接删掉即可。
40. **性能细则**：random-image/random-person `loading="eager"` 最多 50 张图（:75）且漏改的 `onClick` 两处（:78,:79，违反项目 onPress 规范）；列定义渲染内重建 3 处（country-code/license-plate/postal-code，almanac 已正确提升模块级）；`key={index}` 用作行键 7 处；almanac 每单元格调 `get()` 正则路径解析；random-color `key={displayColor}` 随机重复色会产生重复键。
41. **CopyText 定时器不清理 + 死代码 try/catch** — `CopyText/index.tsx:25-35,59-69`（内层 useCopy 已自行 catch）。
42. **useSupabaseUser 双重请求** — `getUser()` 与 `onAuthStateChange` 的 INITIAL_SESSION 重复拿同一会话；UserAvatar 匿名访客也发 `/auth/me`（:43-48）+ 500ms 魔法延迟不清理（:71-74）。

### 配置 / 依赖

43. **`ignoreBuildErrors: true` 且无 typecheck 环节** — `next.config.ts:4-6`，scripts 无 `tsc --noEmit`，类型错误零拦截（`typings/index.ts:8` 的 `emial` 拼写错误即证明）。修复：加 `"typecheck": "tsc --noEmit"`；typecheck 全绿前不得关闭 ignoreBuildErrors。
44. **@gravity-ui/icons 在 devDependencies 但生产代码大量引用** — `package.json:79` vs BackTop/ThemeSwitcher/Footer 等。`pnpm prune --prod` 后运行时缺包，应移入 dependencies。
45. **xmldom@0.6 已弃用（ReDoS 公告）** — 应换 `@xmldom/xmldom`；zxcvbn beta 词典包配稳定版核心易碎。
46. **6 项依赖确认未使用** — `@dicebear/collection`、`tw-animate-css`、`@antfu/eslint-config`、`@eslint-react/eslint-plugin`、`eslint-config-prettier`、`eslint-plugin-react-refresh`。（`react-aria`/`react-aria-components` 是 HeroUI peer 依赖，**禁止删除**。）
47. **管理员邮箱白名单 5 处手工同步** — rls.sql 两表 4 份 + env 1 份，漏改任一处即静默不一致；RLS 策略还缺 `email_verified` 校验（纵深）。默认只记录方案不改（如改必须 5 处同步）。
48. **sitemap 只含首页 1 个 URL** — `sitemap.ts:4-11`。40+ 公开路由全未收录，且 env 缺失时产出空 `<loc>` 会导致整个 sitemap 被拒收。`robots.ts:8` 的 `disallow:"/private/"` 是模板残留（应改 `/admin`,`/login`）。

## 🟡 三、改进建议

49. **缓存策略普遍缺失** — 全项目仅 random-avatar 设了 `Cache-Control`。solar-term/holiday/almanac（日期确定结果恒定）应加 `max-age=86400`；country-code/license-plate/postal-code 字典表应模块级缓存或 `s-maxage`；首页 `force-dynamic` 可改 ISR + 后台保存时 `revalidateTag`。
50. **HTTP 语义** — 所有错误一律 200 + `code:500`，仅 401 例外。对外 API 平台建议映射真实 4xx/5xx（注意：改变响应状态码属线上行为变化，需谨慎/记录）。
51. **proxy.ts 每 API 请求 +2 次 Supabase 往返** — `proxy.ts:36-58` 先查表再随机 +1~10 计数（虚增计数、失败调用也计数、阻塞中间件链）。建议移到响应后异步执行，且查表用 `head:true`。
52. **fetch 超时封装** — 全项目外部 fetch 仅 request.ts 有 AbortController；服务端应统一 `AbortSignal.timeout(3000)` + 降级。
53. **双 loading 指示并存** — BProgress 顶条 + 页内 Spinner 同时出现，建议二选一。
54. **动画一致性** — chips 结果页（random-string/color 等 5 页）最适合 stagger 入场但未用 motion；riddle 页缺署名二级动画（QuoteWorld 有）；Footer 的 `animate-ping` 是全站最后一处无 reduced-motion 关闭的动画；`use-blur-circle-theme.ts:168` 的 `await transition.ready` 无 catch。
55. **登录细节** — TextField 缺 `autoComplete`；`maxLength={12}` 对管理员真实密码是人为上限（放宽上限只保留下限）；登录成功跳转全靠中间件间接完成（建议显式 replace）；OAuth `redirectTo` 固定首页无来源页回跳，且 `.env` 是 localhost（生产漏配会回跳 localhost，只记录）；登录页建议 `robots: noindex`。
56. **安全头缺失** — next.config 无 `poweredByHeader:false`、无 CSP/X-Frame-Options 等基本安全响应头（注意 next.config.ts 属 AGENTS.md 禁改清单，改动保持最小）。
57. **Analytics 环境判断** — `NODE_ENV==="production"` 会让 Vercel preview 也打 GA/Clarity，建议叠加 `VERCEL_ENV`。
58. **杂项**：`THEME_MODE.SYSTEM` 死值（enableSystem=false）；`ColumnsVisibility` 可隐藏"操作"列后无编辑入口、可清空到 0 列；`DataTablePagination` 切 pageSize 不钳制 pageIndex；admin `columnVisibility` 里的 vpn/commonlyUsed 是死配置；23505 冲突一律误报"名称已存在"（path 唯一冲突也会）。

## 🔵 四、结构性重构机会（分批执行）

59. **功能页模板化**（33 页中 30 页可归入 6 个模板，预计净删 2000+ 行）：
   - **T1 引言页模板**（12 页）：QuoteWorld(9) + hitokoto + chinese-poetry + riddle —— 扩展 QuoteWorld 槽位（toolbar/textFormatter/showAttribution/emptyFallback），3 个 ClientComponent 可整体删除
   - **T2 表格页模板**（8 页）：almanac/country-code/holiday/license-plate/random-emoji/random-user/solar-term + postal-code（双模式作变体）—— 顺带统一 skeleton/行键/列配置提升
   - **T3 KV 页**（3 页）：idcard/ip-region/password-strength 已有 JsonContent，补校验器槽位与回车提交
   - **T4 生成 chips 页**（5 页）：random-idcard/string/color + color-conversion/tailwind-color-palette（后两页的 colorPresets/getRandomColor 逐字重复）
   - **T5 图片生成 hook + 页**（2 页）：barcode/qrcode 合并（fetch 分支/blob revoke/下载/自动触发约 80% 相同，顺带修复 #5）
   - **T6 useCommittedParams hook**（3 页）：postal-code/random-image/random-person 的"提交参数 + JSON 比较 + mutate"三段式
   - 另有共享常量：`yearOptions`（holiday/solar-term 2 处）、`EnumSelect`（15 处 ×20 行 Select 样板）、`CopyChip`（5 处）、"参数必填"守卫（5 处）
60. **API 路由 6 类模板抽取**：`textResponse()`（10 处逐字重复）、`execRpc()`（10 处）、`requireKeyword()`+安全 ilikeOr（3 处，顺带修复 #9）、`withAdmin()` CRUD 包装（4 文件）、`parseBoundedInt()`（7 处，顺带修复 #21）、dayjs 插件公共化（2 处）。
61. **admin 两模块合并**（90% 重复）：data-table 84 行逐字符相同、delete-dialog 仅标题不同、index.tsx 同构——抽 `AdminCrudTable<T>` + `useAdminCrud`。categorys 弹窗缺防护（#15）正是复制后漂移的产物，合并天然消除此类缺陷。

## ✅ 五、做得好的（重构约束，不得破坏）

- bing-wallpaper 的模块缓存 + inflight 去重 + 失败回退旧缓存 + ISR `revalidate=86400`
- 权限三层：page 级 requireAdmin + 每个写 API + RLS 兜底；删除确认 AlertDialog 防误触、loading 双重禁用
- BackTop（reduced-motion 跳转、rAF 清理、滚动中才挂监听）、TimeAndLunar（秒级去重、农历惰性重算）、use-blur-circle-theme（高分辨率分支、防连点）
- SWR 配置克制（关闭 focus 重验证、mutation key 后缀隔离）、`optimizePackageImports`、random-avatar 绕开 dicebear barrel 的按需导入
