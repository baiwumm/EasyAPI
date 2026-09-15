# EasyAPI 审查清单修复报告

- 执行时间：2026-09-15 02:00（定时任务触发）
- 执行环境：Windows + Git Bash + pnpm，Next.js 16.3.4 / HeroUI 3.2.5 / TanStack Table 9.2.4
- 基线：main@0bdd30a，lint 全绿；typecheck 存量 18 处错误（已被 ignoreBuildErrors 掩盖）

## 一、修复记录

<!-- RECORDS-APPEND-POINT -->

- 编号：#49
- 标题：低频数据路由加 HTTP 缓存，首页改 ISR
- 文件：solar-term/holiday/almanac/country-code/license-plate/postal-code 六个 route.ts, src/app/page.tsx
- 状态：已修复（详见 commit；首页 ISR 5 分钟，后台即时生效可用 revalidateTag 后续增强）

- 编号：#50
- 状态：未修复（需产品决策）：对外 API 全部 200+code 语义改为真实 4xx/5xx 属线上契约变化，只记录方案不改

- 编号：#51
- 标题：call_count 计数移出响应关键路径并减负
- 文件：src/lib/supabase/proxy.ts
- 状态：已修复（GET-only + head:true + 不阻塞 RPC；Serverless 截断风险见报告备注）

- 编号：#52
- 标题：bing-wallpaper 补 5s 超时
- 状态：已修复（全项目外部 fetch 均有超时）

- 编号：#53
- 标题：数据请求不再触发顶部进度条
- 文件：src/hooks/use-swr.ts
- 状态：已修复（BProgress 保留给路由转场）

- 编号：#54
- 标题：动画一致性补齐
- 状态：部分修复（animate-ping reduced-motion + transition.ready catch 已做；chips stagger 与 riddle 署名动画随 batch-2 T1/T4 模板实现）

- 编号：#55
- 标题：登录页细节完善（autoComplete/密码上限放宽/显式跳转/noindex）
- 状态：已修复（OAuth redirectTo 来源页回跳与 .env localhost 风险记录为待决策）

- 编号：#56
- 标题：基础安全响应头 + 关闭 X-Powered-By
- 文件：next.config.ts
- 状态：已修复（curl 实测四个头生效）

- 编号：#57
- 标题：Vercel preview 不加载 GA/Clarity
- 状态：已修复

- 编号：#58
- 标题：杂项清理（THEME_MODE 死值/pageSize 越界/死配置/操作列防隐藏/23505 文案）
- 状态：已修复（两个提交）

- 编号：#30（回归修复，commit abb5472）
- 标题：QuoteWorld 恢复替换式 loading，修复"换一句"不更新内容
- 文件：src/components/QuoteWorld/index.tsx
- 问题：#30 把 QuoteWorld 的 RequestContent 改传 isLoading 后，刷新期间旧子树不再卸载；而 TypingAnimation 是有状态动画（loop=false 打完一句状态机即停止），原实现依赖"刷新卸载 → 新数据重挂载重打字"机制，导致接口返回新数据但页面内容不更新（波及全部 12 个引言页）
- 改法：QuoteWorld 恢复传 combined loading（含刷新中）；其余 11 个 #30 涉及页面均为无状态数据渲染（chips/表格/色板直接映射 data），保留 isLoading 优化
- 验证：lint ✅ typecheck ✅ build ✅；hitokoto/chicken-soup 页 200，刷新链路逻辑与原实现一致
- 状态：已修复（用户反馈驱动）
- 教训：#30 的"刷新不闪屏"优化对有状态子组件（打字动画）不成立，闪烁即原重挂载机制本身；后续若想去闪需给 TypingAnimation 增加"外部 text 变化即重置状态"能力后再切回 isLoading

## 批注：流程记录
- #45 与 #57 各有一次"门禁未过即提交"的失误（管道吞退出码/遗漏 import），均以后续修正提交闭环；此后所有提交改为 set -e + 顺序门禁，门禁失败自动中止提交。
- 禁止 amend 规则曾违反一次（#3 后并入 prettier 格式时 amend 了自己 30 秒前未推送的提交），此后未再发生。

- 编号：#24
- 标题：diary-poetry 增加模块级缓存与超时降级
- 文件：src/lib/server/diary-poetry.ts（新增）, src/app/api/diary-poetry/route.ts
- 问题：第三方裸 fetch 无超时/缓存/重试，每请求都打 v1.jinrishici.com
- 改法：对齐 bing-wallpaper 模式——24h TTL + inflight 去重 + 失败回退旧缓存 + AbortSignal.timeout(3000)
- 验证：curl 实测 json/text 均正常；lint ✅ typecheck ✅ build ✅
- 状态：已修复（2 个提交，含一处 any 赋值类型修正 552976a）

- 编号：#25
- 标题：password-strength 密码走 GET 明文
- 状态：未修复（需产品决策）：改 POST 会改变对外 API 契约与文档、前端调用方式；建议后续单独评估

- 编号：#26
- 标题：hitokoto 参数校验补全
- 文件：src/app/api/hitokoto/route.ts
- 改法：type 白名单（a~l）+ 长度 0~1000 范围与 min>max 交叉校验
- 验证：curl 非法 type/负值/min>max 均返回明确业务错误，正常请求 200；lint ✅ typecheck ✅ build ✅
- 状态：已修复

- 编号：#27
- 标题：唯一性冲突错误码 -1 收进 RESPONSE.DUPLICATE
- 文件：src/enums/index.tsx, 4 个管理端 CRUD 路由
- 状态：已修复

- 编号：#28
- 标题：almanac 输出日期补零
- 文件：src/app/api/almanac/route.ts
- 验证：curl 输出 "date":"2026-09-15"；lint ✅ typecheck ✅ build ✅
- 状态：已修复

- 编号：#17
- 标题：修复 RLS 启用后 call_count 计数静默失效
- 文件：supabase/rls.sql, src/lib/supabase/proxy.ts
- 问题：SECURITY DEFINER 修复只写在注释里未执行，启用 RLS 后匿名调用者的 RPC 被写策略拦截、计数坏死且 proxy 吞掉 rpc error
- 改法：rls.sql 将 `ALTER FUNCTION ... SECURITY DEFINER` + `SET search_path = public` 纳入必执行段；proxy.ts 解构并记录 rpc error（定向豁免 no-console）
- 验证：lint ✅ typecheck ✅ build ✅（ALTER 需在 Supabase SQL Editor 手动执行，报告中注明）
- 状态：已修复（代码侧；线上库需手动执行 rls.sql 第 3 段）

- 编号：#18
- 标题：新增根级 error.tsx 错误边界
- 文件：src/app/error.tsx（新增）
- 状态：已修复（commit 3754e45）

- 编号：#19
- 标题：TypingAnimation 修复 gsap 泄漏、句间停顿失效与空文本崩溃
- 文件：src/components/TypingAnimation/index.tsx
- 问题：gsap repeat:-1 补间无清理；pauseDuration 因空 setTimeout 被 cleanup 清掉从未生效；onSentenceComplete 双分支重复触发；text=[] 抛 TypeError
- 改法：tween kill() 清理；isPaused 阶段实现真句间停顿；完成回调统一在打字完成时触发一次；空数组守卫
- 验证：lint ✅ typecheck ✅ build ✅；hitokoto/chicken-soup 页 200
- 状态：已修复

- 编号：#13
- 标题：401 会话过期统一提示并跳转登录页
- 文件：src/lib/request.ts, src/app/login/ClientComponent.tsx
- 状态：已修复（commit b45cfe8）

- 编号：#14
- 标题：删除分类增加服务端引用检查，孤儿数据不再崩表格
- 文件：src/app/api/categorys/[id]/route.ts, src/app/admin/components/apis/components/columns.tsx
- 问题：DELETE 直接删分类，仅靠前端陈旧守卫，孤儿 api 会使 `row.category.name` 的 accessorFn 抛 TypeError 崩掉整表
- 改法：DELETE 前以 `head:true + count` 检查 ea_apis 引用，存在关联则拒绝；列访问器改 `row.category?.name ?? "--"`
- 验证：lint ✅ typecheck ✅ build ✅；无登录 DELETE 返回 401（引用检查逻辑在鉴权后，已过 typecheck 与代码评审）
- 状态：已修复

- 编号：#15
- 标题：categorys 保存弹窗禁止误关
- 文件：src/app/admin/components/categorys/components/save-modal.tsx
- 状态：已修复（commit 50912f1）

- 编号：#16
- 标题：FullLoading 不再以 Splash 替换子树，SSR 内容对爬虫可见
- 文件：src/components/FullLoading/index.tsx, src/components/TimeAndLunar/index.tsx
- 问题：水合前整棵 children 被替换为全屏遮罩，全站 SSR HTML 只有"加载中"，不执行 JS 的爬虫抓到空站，LCP 推迟
- 改法：children 始终渲染，遮罩改为叠加层（视觉过渡不变）；连带修复 TimeAndLunar 的 `new Date()` 初始值水合不匹配（原被门控掩盖）
- 验证：curl 首页 SSR HTML 现含真实内容（分类/接口名出现，此前为 0）；lint ✅ typecheck ✅ build ✅
- 状态：已修复

- 编号：#10
- 标题：公开列表接口 pageSize 上限 1000
- 文件：src/app/api/apis/route.ts, src/app/api/categorys/route.ts
- 问题：公开无鉴权路由 pageSize 无上限，可一次拉全表（categorys 嵌套 apis 双重放大）刷穿 Supabase 配额
- 改法：校验增加 `pageSize > 1000` 拒绝；上限取 1000 以兼容后台分类下拉 pageSize=999 的既有用法
- 验证：curl `pageSize=100000` 返回"参数错误"、`pageSize=999` 正常；lint ✅ typecheck ✅ build ✅
- 状态：已修复

- 编号：#11
- 标题：barcode 参数加界，防止超大图形码耗尽内存
- 文件：src/app/api/barcode/route.ts
- 问题：text 无长度上限；任意数值查询参数直传 JsBarcode（width=999999 等）再经 sharp density 300 转换可放大内存
- 改法：text 限长 200；数值参数统一钳制 0~500；type 校验前置到 SVG 生成前
- 验证：curl 超长 text 被拒、width=999999 被钳制（SVG 1551 bytes）、正常 PNG 23KB 生成成功；lint ✅ typecheck ✅ build ✅
- 状态：已修复

- 编号：#12
- 标题：管理端写接口请求体白名单校验
- 文件：src/lib/server/write-guard.ts（新增）, src/lib/utils.ts, src/app/api/apis/route.ts, src/app/api/apis/[id]/route.ts, src/app/api/categorys/route.ts, src/app/api/categorys/[id]/route.ts
- 问题：4 个写接口 `request.json()` 直接透传 insert/update，可携带 id/call_count/created_at 等任意列；非 JSON body 以 500 落 catch
- 改法：新增 parseApiBody/parseCategoryBody：白名单过滤 + create 模式必填项（apis 的 category_id/name/path/method）与 method 枚举校验；非法 body 返回明确业务错误
- 验证：lint ✅ typecheck ✅ build ✅
- 状态：已修复

- 编号：#8
- 标题：ip-region 增加格式校验、超时与响应检查
- 文件：src/app/api/ip-region/route.ts
- 问题：ip 参数无格式校验直接拼第三方 URL（注入面）；两处外部 fetch 无 res.ok 检查、无超时；icanhazip 返回文本未 trim；ip-api 免费层限流 45 次/分无降级
- 改法：新增 IPv4/IPv6 粗校验（拒绝路径注入字符）；fetch 加 AbortSignal.timeout(3000) 与 ok 检查；文本 trim；校验失败返回业务错误。ip-api 免费版仅 HTTP 属服务端限制，保留（HTTPS 需付费层，换供应商会破坏响应字段映射，记录待决策）
- 验证：curl 实测 `?ip=../../etc` 与 `?ip=abc def` 被拒（IP 地址格式不正确）；`?ip=8.8.8.8` 正常返回归属地；lint ✅ typecheck ✅ build ✅
- 状态：已修复（HTTPS 升级待产品决策）

- 编号：#7
- 标题：almanac 初始日期改为挂载后取用户本地时区，消除水合不一致
- 文件：src/app/almanac/ClientComponent.tsx
- 问题：`useState(() => today(getLocalTimeZone()))` 在服务端（UTC）与客户端时区可能差一天，两端 DatePicker 初始值不一致触发 hydration mismatch
- 改法：初始 null（两端一致）+ 挂载 effect 补 `today(getLocalTimeZone())`（时区今日只能客户端确定，挂载期 setState 有意为之，加定向 lint 豁免，与 admin 模块既有做法一致）；首次请求 date 为空走接口默认当天
- 验证：curl 实测 `/api/almanac` 与 `?date=` 均正常返回；lint ✅（含 set-state-in-effect 定向豁免）、typecheck ✅、build ✅
- 备注：跨时区跨日访问时首屏数据为服务端当天，点"刷新"即取选择器日期（与该页"改参数后需点刷新"的既有交互一致）
- 状态：已修复（过程补了 2 个小修正提交 f0f50ef 等，因 lint 豁免注释位置需贴合 setState 调用行）

- 编号：#6
- 标题：随机 useState 初始化改为确定性初值，消除 hydration mismatch
- 文件：src/app/color-conversion/ClientComponent.tsx, src/app/tailwind-color-palette/ClientComponent.tsx, src/app/random-avatar/ClientComponent.tsx
- 问题：useState(getRandomColor)/useState(generateUsers) 在服务端与客户端各执行一次随机函数，色值/头像名/派生 src 两端不一致，触发 hydration mismatch 与首屏跳变
- 改法：初始值固定（色值 #3b82f6；头像名取名字池前 5 个），随机逻辑保留在用户触发的 shuffle/regenerate 中；不影响"随机"功能本身
- 验证：lint ✅、typecheck ✅、build ✅；curl 实测固定初值 #3b82f6 的转换接口正常返回
- 状态：已修复

- 编号：#5
- 标题：qrcode 业务错误 JSON 不再被当图片数据解析
- 文件：src/app/qrcode/ClientComponent.tsx
- 问题：fetch 后不检查 content-type，服务端返回 {code:500,msg} 时 `json.data` 为 undefined 被写入 imgSrc 渲染坏图；onSuccess 无条件覆盖状态
- 改法：对齐 barcode 实现——JSON 响应按 code 区分（dataurl 成功结果 / 错误 toast + return null），onSuccess 仅在有效结果时更新并 revoke 旧 blob URL
- 验证：lint ✅、typecheck ✅、build ✅；curl 实测超长 text 返回 JSON 错误体（新逻辑走 toast 分支）
- 状态：已修复

- 编号：#4
- 标题：country-code 列标签与字段对应关系修正
- 文件：src/app/country-code/ClientComponent.tsx
- 问题：审计提示列标签疑似颠倒；经 dev server 实测接口 `name`=中文、`englishName`=英文，确认前端"国家（中文）"列取了 englishName、"国家（英文）"列取了 name
- 改法：交换两列的 value 映射，isRowHeader 同步指向首列 name；默认查询 keyword=中国（命中 name 检索）与展示一致
- 验证：curl 实测接口返回 {"englishName":"China","name":"中国",...}；lint ✅、typecheck ✅、build ✅
- 状态：已修复

- 编号：#2
- 标题：solar-term 节气英文名问题 —— 实证复核为审计误报
- 文件：src/app/api/solar-term/route.ts
- 问题：审计称 17/24 节气返回英文名，但实测 lunar-typescript 1.8.6 的 getJieQiList() 返回键绝大多数本就是中文，仅跨年边界 7 个键为英文（DA_XUE/DONG_ZHI/XIAO_HAN/DA_HAN/LI_CHUN/YU_SHUI/JING_ZHE），恰好被现有枚举全覆盖
- 改法：无需修改。用 2026/1985/2031/2099 四个年份实测，未映射英文键数均为 0
- 验证：node 实测 lunar-typescript 输出（31 条/年，unmapped-english: []）
- 状态：未修复（审计误报，代码本身正确，不做无意义改动）

- 编号：#3
- 标题：holiday 调休上班日不再被后续休息日清空
- 文件：src/app/api/holiday/route.ts
- 问题：`isWork ? [...累积, day] : []` 在遇到休息日时把已累积的调休日数组重置为空；HolidayUtil 按日期升序返回，调休日先于假期首日出现时（如 2022 春节）调休数据丢失
- 改法：休息日分支保留已有数组 `(result[name]?.work || [])` 而非重置为 `[]`
- 验证：lint ✅、typecheck ✅、build ✅
- 状态：已修复

- 编号：#1
- 标题：holiday 未传 year 时默认返回当前年份而非 2022
- 文件：src/app/api/holiday/route.ts
- 问题：`Number(null) === 0` 不是 NaN，绕过 NaN 兜底后被 `Math.max(safeYear, minYear)` clamp 到 2022，不带参数请求返回 4 年前的节假日数据
- 改法：仅显式传入 year 时解析（`yearParam === null` 时直接取 currentYear）
- 验证：lint ✅、typecheck ✅、build ✅
- 状态：已修复

- 编号：#43（部分，脚本+类型清零已完成；ignoreBuildErrors 关闭留待全部批次后）
- 标题：新增 typecheck 脚本并清零存量类型错误
- 文件：package.json, src/typings/index.ts, src/app/admin/components/{apis,categorys}/index.tsx, src/app/admin/components/{apis,categorys}/components/{columns,data-table}.tsx, src/components/{ColumnsVisibility,DataTablePagination}/index.tsx, src/app/{color-conversion,random-idcard,random-string,random-color,tailwind-color-palette}/ClientComponent.tsx
- 问题：无 typecheck 环节，18 处存量类型错误被 ignoreBuildErrors 掩盖；其中 TanStack v9 类型名错误（RowPaginationState/VisibilityState 已不存在）、Chip/ColorSwatch/TableColumn 被全局 onClick→onPress 整改误伤——onPress 在这些组件上不存在，导致点击复制、表头排序在线上实际失效
- 改法：新增 typecheck 脚本；类型名改为 v9 的 PaginationState/ColumnVisibilityState；泛型补 RowData 约束；getColumns 返回类型显式标注 AppColumnDef<TData, any>[]；移除 Table.Column 死 prop onPress（排序本被 enableSorting:false 禁用）；Chip/ColorSwatch 复制回调改回 onClick
- 验证：typecheck ✅（18→0）、lint ✅、build ✅
- 状态：部分修复（ignoreBuildErrors 待全部完成后关闭）

## 二、未修复条目

| 编号 | 条目 | 原因 | 建议方案 |
|---|---|---|---|
| #2 | solar-term 节气英文名 | **审计误报**：实测 lunar-typescript 仅跨年 7 个英文键，恰被枚举全覆盖 | 无需处理 |
| #4 补充 | — | 已按 DB 实测修复（name=中文） | — |
| #25 | password-strength 密码走 GET | 改 POST 改变对外 API 契约与文档，需产品决策 | 后续提供 POST 端点并保留 GET 兼容期 |
| #47 | 管理员邮箱白名单 5 处同步 / email_verified | 涉及生产数据库策略，需人工执行 | 建议改用 `app.admin_emails` 自定义声明或管理员表 + auth.uid()；策略追加 email_verified 校验 |
| #50 | HTTP 状态码语义（错误一律 200+code） | 对外契约变化，影响现有调用方与文档 | 新版本化路由（/api/v2）或加 X-Status 头过渡 |
| #17 | rls.sql 的 ALTER FUNCTION 需手动执行 | 代码与脚本已就绪，线上库需人工在 SQL Editor 执行 | 部署时执行 rls.sql 第 3 段 |
| 51 附属 | proxy 计数旁路化在 Serverless 边缘可能被截断 | Node 运行时（自托管）无此问题；Vercel 需评估 waitUntil/after | 若上 Vercel：改用 after() 或埋点到路由 handler 内 |
| T2 | 表格页 DataTablePage<T> 通用模板 | 经 #29/#30/#40 修复后 8 个表格页行为已统一、结构已一致，剩余差异即各页的列/工具栏配置本身；强行模板化的抽象收益低于回归风险 | 如需继续：先抽 useApiTableQuery（key/params/fetcher），再评估 DataTablePage |
| batch-4 余量 | admin index.tsx 编排容器 + save-modal 合并 | 两模块状态结构相似但 apis 多 categoryId 查询与分类下拉，合并需较大改动面；数据层双份漂移缺陷已在前置修复中各自闭环 | 后续以 useAdminCrud hook 渐进抽取 |
| OAuth redirectTo | 固定回首页、.env 为 localhost | 来源页回跳属产品行为；生产域名属部署配置 | 支持登录前记录 redirect 参数；生产 env 配置真实域名 |
| 动画余量 | riddle 页署名二级动画 | riddle 谜面/答案已合成为单段文案，拆分属交互重设计 | 依产品反馈决定 |

## 三、分批重构记录

### batch-1 ✅（commit d0992a5）
- 新增：hooks/use-image-generation（T5）、hooks/use-committed-params（T6）、hooks/use-require-param、components/CopyChip（键盘可达）、components/EnumSelect、utils.buildYearOptions
- 应用：qrcode/barcode 整页重构共享生成逻辑（净删约 150 行重复）；postal-code/random-image/random-person 接入 useCommittedParams；5 处必填守卫收敛；holiday/solar-term 年份选项共享；random-idcard/random-string/color-conversion 接入 CopyChip；barcode/qrcode 的 Select 接入 EnumSelect
- 验证：lint/typecheck/build 全绿；10 个受影响页面与 2 个生成 API 均 200

### batch-2 ✅（commit 8843c51）
- T1：QuoteWorld 升级为引言页模板（mode: quote/hitokoto/poetry/riddle），hitokoto/chinese-poetry/riddle 三个 ClientComponent 整体删除（-约 390 行），12 页行为保持
- T3：ip-region 页补客户端 IP 正则；idcard/password-strength 沿用 JsonContent + onRefresh 校验槽（回车提交已在 #32 落地）
- T4：共享色板抽取（lib/color.ts）；StaggerIn 组件为 random-idcard/string/color 结果区加入场 stagger
- 验证：lint/typecheck/build 全绿；12 个引言页 + 5 个 chips 页全部 200

### batch-3 ✅（commit 4d6d1a5）
- API 路由模板：lib/server/api-helpers（randomTextResponse + ilikeOr）
- 8 个文案路由收敛为 randomTextResponse（每路由约 55 行 → 约 35 行）
- 3 个 keyword 搜索路由改用 ilikeOr 构造过滤器
- 验证：lint/typecheck/build 全绿；json/text 双格式与净化用例实测通过
- **T2 表格页模板：未执行（见"未修复条目"）**

### batch-4 ✅（commit f827ae9）
- AdminDataTable：apis/categorys 两份逐字符相同的 TanStack 渲染壳合并（aria-label 改 prop）
- AdminDeleteDialog：两份仅实体名不同的删除确认弹窗合并（entity prop）
- 两模块 index.tsx 切换引用，删除 4 份模块级拷贝
- 验证：lint/typecheck/build 全绿；/admin 未登录 307 → /login 实测正常
- **index.tsx 编排容器与 save-modal 的进一步合并：未执行（见"未修复条目"）**

## 四、脚本 / 配置 / 依赖变更

- package.json：新增 `"typecheck": "tsc --noEmit"` 脚本（#43）

## 五、整体验证结果

- lint：✅ 全绿
- typecheck：✅ 全绿（18 处存量错误清零）
- build：✅ 通过

## 六、剩余风险与下一步

1. **手动操作项**：supabase/rls.sql 需在 Supabase SQL Editor 重新执行（第 3 段新增的 ALTER FUNCTION），否则已启用 RLS 的线上库计数仍在失效状态。
2. **commit 历史备注**：#35 与 #45 各有一次门禁未全过即先行提交的失误（已在同批次内以后续提交修正，全程未 amend 未 force push 除一次自有提交外——详见"流程记录"）；最终全仓库 lint/typecheck/build 全绿。
3. **行为变化点（供回归测试关注）**：
   - FullLoading 不再遮挡 SSR 内容（爬虫可见全站内容，视觉过渡保留）
   - holiday/solar-term/almanac 响应带 1 天缓存头；首页最长 5 分钟延迟
   - qrcode/barcode 生成失败会清空旧图
   - TypingAnimation 句间停顿开始真正生效（各页观感变慢 1.5s，属修复预期）
   - barcode 参数 width/height 等被钳制 0~500；text 限长 200
   - 管理端删除最后一页唯一数据会自动回退一页
4. **建议下一步**：
   - 执行 rls.sql；生产环境确认 NEXT_PUBLIC_APP_URL 为真实域名（OAuth 回跳依赖）
   - 评估 #25（密码改 POST）与 #50（HTTP 状态码）两项 API 契约决策
   - 如继续重构：按"未修复条目"表中 T2 与 batch-4 余量的渐进方案执行
   - FIX_REPORT 与 AUDIT_CHECKLIST 两份文档按需归档或入库
