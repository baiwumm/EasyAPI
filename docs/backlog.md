# 待办清单（backlog）

**开工前先读这里。** 已完成的工作见 `audit-2026-10.md` 与文末「已完成」，不要重复做。
本文只列**剩余**项，按优先级分组。

约定：认领某项后在「状态」列标注 `进行中 @名字/日期`，完成后移到文末「已完成」。

---

## 性能

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| F4 | `src/app/opengraph-image.tsx:36-38` | 3 个 `publicAssetToDataUrl` 在模块作用域启动，但 `ImageResponse` 每请求重渲染 | 构建期生成或 `revalidate = 86400` | P3 | 待办 |

## UI / 交互 / 可访问性

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| D13 | `src/components/StaggerIn/index.tsx:34` | `Children.map` 给每个 child 包一层 `motion.div`，**破坏 CSS grid/flex 布局**（`random-color` 靠子元素自身样式兜住） | 改用 `variants` 传播，不额外包 DOM | P3 | 待办 |
| D15 | `src/components/AlertContent/index.tsx:39-56`、`ErrorContent` | 桌面/移动两套 Button 靠 `sm:hidden`/`hidden sm:block`，两个都在 DOM 里，键盘用户会 Tab 到隐藏的重复按钮 | 用一套响应式 class 的按钮 | P3 | 待办 |
| D20 | `src/components/ColumnsVisibility/index.tsx:28-34` | `handleSelectionChange` 每次交互对所有列 `toggleVisibility()`，O(N) 次 state 写入 | 合并为一次批量 set | P3 | 待办 |
| — | `src/enums/index.tsx`、`src/hooks/use-copy.tsx` | 文件扩展名与内容不符：前者是 `.tsx` 但纯数据无 JSX；后者是 `.tsx` 且有 JSX（正确） | 前者重命名为 `.ts` | P3 | 待办 |

## 测试覆盖缺口

| ID | 位置 | 缺口 | 建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| T3 | 管理端 CRUD 路由（`apis`/`categorys` 的 POST/PUT/DELETE） | ~~0 覆盖~~ 写链路与鉴权已由 `tests/app/api/admin-write-routes.test.ts` 覆盖（含空 payload 守卫、失败/未登录不刷首页）；save-modal 前端表单已由 T1 补齐（含 Select 弹层交互、payload 形状、失败复位） | 如需继续补强：唯一性冲突分支（23505）与删除分类前的引用检查（`count` 查询） | P3 | 大部分完成 |

## 文档与工程

| ID | 位置 | 问题 | 处理建议 | 优先级 | 状态 |
|---|---|---|---|---|---|
| G4 | `package.json` | 缺 `packageManager` 字段，pnpm 大版本行为差异曾引发 A1 | 单独一个 commit 处理（会牵动 lockfile） | P3 | 待办 |

## 已完成

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
