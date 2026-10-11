# 部署说明

推荐部署到 Vercel：

1. Fork 本项目
2. 在 Vercel 中导入仓库
3. 配置环境变量（见下表）
4. 点击 Deploy

自托管同样可行，只需保证 Node 环境可跑 `pnpm build && pnpm start`，
并补齐下方的服务端变量（`SUPABASE_*` 与 `ADMIN_EMAILS` 缺失时接口直接不可用）。

## 环境变量清单

`.env.example` 是唯一权威来源，下面是逐项说明与缺失时的表现。

### 必需（缺失则功能直接不可用）

| 变量 | 用途 | 缺失时 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目地址 | 所有接口 500 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 公开 anon key（进前端 bundle） | 所有接口 500 |
| `ADMIN_EMAILS` | 管理员邮箱白名单，逗号分隔 | 无法登录后台、写接口全部 401 |

> `ADMIN_EMAILS` 与 `supabase/rls.sql` 里的 `admin_emails` 数组是两处，
> 改邮箱要同步。注意：rls.sql 是「DROP 全部旧策略再重建」的形式，
> 执行前确认不会清掉手工策略。

### 站点展示（有默认值，缺失则退化）

| 变量 | 用途 | 缺失时 |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | 站点域名 | `layout.tsx` / `sitemap.ts` / `robots.ts` 有 fallback `https://api.baiwumm.com`；**`login/ClientComponent.tsx` 的 OAuth `redirectTo` 没有 fallback，会让 Google/GitHub 登录直接失败** |
| `NEXT_PUBLIC_APP_NAME` | 站点名 | 标题模板出现字面 `undefined` |
| `NEXT_PUBLIC_APP_TITLE` | 站点标题 | OG 图有 fallback，metadata 无 |
| `NEXT_PUBLIC_APP_DESC` | 站点描述 | metadata 为空 |
| `NEXT_PUBLIC_APP_KEYWORDS` | 关键词 | metadata 为空 |
| `NEXT_PUBLIC_COPYRIGHT` | 版权方 | 页脚版权为空 |
| `NEXT_PUBLIC_AUTHOR_ROLE` | OG 图作者身份 | OG 图有 fallback「独立开发者」 |

### 备案与统计（缺失则对应入口隐藏或不加载）

| 变量 | 用途 | 缺失时 |
|---|---|---|
| `NEXT_PUBLIC_ICP` | ICP 备案号 | 页脚该项不渲染（已按空值过滤） |
| `NEXT_PUBLIC_GUAN_ICP` | 公网安备 | 同上 |
| `NEXT_PUBLIC_GOOGLE_ID` | Google Analytics | 仅在 `NODE_ENV=production` 且非 Vercel preview 时加载 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity | 同上 |

## 构建产物注意

- `src/app/page.tsx` 是 ISR（`revalidate = 300`），后台保存接口/分类后会
  `revalidatePath('/')`，变更最迟在下次访问时生效（F2 已修）。
- `src/app/bing-wallpaper/page.tsx` 是 ISR 24h。`getBingWallpaper()` 已在返回前
  校验地址可解析且带 id，Bing 改返回结构时走缓存兜底不会缓存坏数据（C9 已修）。
- `supabase/rls.sql` 不在构建流程内，需在 Supabase Dashboard 手动执行。
