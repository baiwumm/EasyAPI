# 待办清单（backlog）

**开工前先读这里。** 已完成的工作见 `audit-2026-10.md` 与文末「已完成」，不要重复做。
本文只列**剩余**项，按优先级分组。

约定：认领某项后在「状态」列标注 `进行中 @名字/日期`，完成后移到文末「已完成」。

---

## 当前无待办

2026-10-12 闲时任务已把剩余 P3 项全部清零（F4 / D13 / D15 / D20 / T3 /
enums 改名 / G4，见文末「已完成」）。新发现的待办按原表格式追加到
对应分组即可。

## 已完成

- CI/自动发版（2026-10-13）：新增 `ci.yml`（push/PR 跑 lint/typecheck/test）与
  `release.yml`（手动触发，四道预检全绿后 release-it 一键发版，Vercel 跟随部署）；
  tag 自 v2.10.0 起带 v 前缀，历史 35 个 tag / 34 个 Release 已迁移；
  `openapi.yaml` 版本号由发版 hook 自动同步（`scripts/sync-openapi-version.mjs`）；
  Actions secrets：NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / APP_URL。见 `docs/deployment.md`
- `D15` AlertContent/ErrorContent 操作按钮合并为一套：原桌面/移动两套按钮都挂在
  DOM（sm:hidden / hidden sm:block），键盘会 Tab 到隐藏副本。改为单一按钮进内容列，
  内容列 `sm:flex-row`：移动端纵向（按钮在描述下方）、桌面横向（按钮靠右），
  两种视口视觉位置不变（配 5 条 jsdom 用例钉住单按钮与回调）
- `F4` OG 图路由加 `revalidate = 86400`：内容固定不依赖请求参数，
  社交爬虫抓取不再每次重渲染 ImageResponse
- `D20` ColumnsVisibility 选区变更合并为一次函数式 `setColumnVisibility`：
  v9 受控 onChange 单轮同步（原为每列一次 toggleVisibility，O(N) 次写入）；
  隐藏条目缺省即可见，enableHiding: false 功能列不受影响（配单次写入与
  勾选往返用例）
- `T3` 管理端 CRUD 测试补强（+11 条）：23505 唯一性冲突（apis 按约束名区分
  文案、含缺 constraint 回落通用文案；categorys 名称冲突）与删除分类前的
  ea_apis 引用计数检查（有接口拒绝删除 / 无接口正常删除 / 计数查询失败不删），
  全部断言不刷新首页
- `D13` StaggerIn 去掉子元素包装层：原 `Children.map` 包的 motion.div 会破坏
  grid/flex 布局。改为 CSS 动画直接落在真实子元素（globals.css `.stagger-in > *`，
  nth-child 给 40ms 交错延迟，上限 50 与页面 count 上限一致），both 填充保证
  延迟期透明，reduced-motion 走媒体查询且首帧生效无闪动；三个使用页零改动
- `enums/index.tsx` 重命名为 `index.ts`（纯数据无 JSX，扩展名与内容对齐）
- `G4` package.json 补 `packageManager: pnpm@12.11.2`：pnpm 12 把自托管二进制
  记入 lockfile（packageManagerDependencies，+158 行），`--frozen-lockfile`
  验证通过；单独提交
- `F7` GridReveal 引擎拆分 + 首屏外降级：canvas 引擎（buildTree/measureTree/
  orderByDetail/drawScene/readAverages）移入 `components/GridReveal/engine.ts`
  纯模块并配 22 条单测；实例距视口 150px 内才经 IntersectionObserver 激活引擎，
  首屏外保持普通 `<img>`（reduce-motion 同理），random-image 页 20 实例不再
  挂载即全部建树/跑 rAF；7 条 jsdom 行为测试钉住降级与激活。顺带修复原引擎
  采样越界（边缘格子四舍五入顶到画布尺寸）产出 NaN 颜色的问题
- `C6/C7` 代理层整改：守卫上移 `src/proxy.ts`（admin 白名单、登录页互斥跳转），
  `lib/supabase/proxy.ts` 只留会话机制；删除 OAuth `?code=` 的 rewrite 分支
  （不改地址栏且丢刷新 cookie，code 交换由浏览器端 `detectSessionInUrl` 完成）；
  `src/lib/supabase/*.ts` 的修改限制经人工裁决放开（AGENTS.md 已同步）
- `F1/C5` 调用计数：固定 +1、`increment_call_count_by_path` 单轮 RPC，
  去掉每个 `/api` GET 的 `ea_apis` 预查询；SQL 迁移
  `supabase/increment-call-count-by-path.sql` **需先在 Dashboard 执行再部署代码**
  （旧函数 `SECURITY DEFINER` 已确认，新函数保持同款姿态）
- `F8` 字体分片按需加载：`cn-font-split` 把 1.7MB 子集切成 78 个带 unicode-range 的 woff2 分片，
  首屏只下载实际渲染到的字形；源字体挪至 `assets/fonts/`，`pnpm split-font` 再生成（产物随仓库提交）
- `G8` random-image 图源最终形态：`faker.image.url()` 真实照片（faker v10 起指向
  picsum.photos，旧 loremflickr 已 401 不可用）。中途曾改为服务端生成确定性抽象 SVG，
  但观感单一、不是照片，2026-10-12 经人工裁决换回并删除生成器；第三方不可用时
  整页图片会挂，由 GridReveal 的 onerror 重试与灰色揭幕降级兜底
- `T1` 测试基建引入 jsdom + `@testing-library/react`（含 React Aria 的 pointerCapture 垫片），
  admin 两个 save-modal 各 6 条用例：必填拦截（含 `Number("")===0` 隐患由原生校验钉住）、
  Select 弹层交互、payload 形状、失败后按钮文案复位、成功关窗
- `T2` `JsonContent` / `QuoteWorld` 的 SWR key 行为测试：改参数不请求、
  点提交才请求、参数没变走 `mutate()`（6 条用例）
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
- `D1` `useSwrQuery` 拆出 `isLoading`/`isValidating`：`JsonContent` 后台验证改覆盖式 spinner，
  `QuoteWorld`/`random-image` 只有用户主动刷新才卸载重挂载；其余页面 `loading` 语义不变
- `D3` `BackTop` 圆环改由 MotionValue 写 CSS 变量驱动 `stroke-dashoffset`，删掉每帧 `setState`
- `D19` `apis`/`categorys` 列表分页改用 `parseBoundedInt`，`pageIndex` 加上限 10000
- `D16` 404 页改 `render` 函数形式渲染 Link，不再有 `<a><button>` 嵌套交互元素
- `D17` `CopyChip` 的 render 函数改 `useCallback` 稳定引用（Chip 无 `onPress`，点击仍走原生 button）
- `G1` `openapi.yaml` 的 `info.version` 同步 `package.json`（2.9.0；后续跟 `pnpm release` 一起走）
- `G5` `.env.example` 补 `NEXT_PUBLIC_AUTHOR_ROLE`，`docs/deployment.md` 去掉「未登记」提示
- `G6` `ApiCard`：Link 补 `aria-label`、描述补 `title`、「NEW」改挂载后判定以避开 hydration mismatch
- `G2` `openapi.yaml` 4 处漂移全部按 route.ts 实际校验补齐（bmi/random-person/random-string/holiday）
- 公共 `Columns` 删除从未使用的 `user_id` 与错拼的 `emial` 字段
- `A1` B1 B2 B3 B4 B5 B7 B9 C1 C3 D2 D9 D11 D18 + `almanac` UTC 偏移 —— 见 `audit-2026-10.md`
- 测试框架引入 + 122 条测试（`tests/`）—— 见 `docs/code-standards.md`
- `C2` RLS 策略 —— 按裁决跳过（库侧已手工配置），`rls.sql` 已回退到改动前版本
