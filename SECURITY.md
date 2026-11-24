# 安全策略

## 支持的版本

只维护最新发布版本。旧版本的问题请先升级到最新版再复现。

## 报告漏洞

**不要在公开 issue 或 discussion 中披露漏洞细节。**

请使用 GitHub 私密漏洞报告：

<https://github.com/baiwumm/EasyAPI/security/advisories/new>

报告里请包含：受影响的版本或提交、复现步骤、影响范围（能否读写他人数据、是否需要登录、能否绕过限流），以及你建议的修复方向。收到后会尽快确认，并在修复发布后于 advisory 中公开致谢。

## 重点关注的范围

- 认证与会话：`src/lib/supabase/` 下的验签与 `requireUser`
- 写接口鉴权：`src/app/api/{apis,categorys}/**` 是否在写操作前校验登录（`src/lib/server/write-guard.ts`）
- 行级安全：`supabase/rls.sql` 的 RLS 策略能否被 publishable key 直接调 REST 绕过
- 服务端转发类路由：`/api/avatar-proxy`、`/api/random-image`、`/api/bing-wallpaper` 是否存在 SSRF 或开放转发
- 信息泄露：错误响应是否把上游原始报错、内部路径或密钥带进 body
- 限流绕过：Vercel 边缘 30 次 / 60 秒规则之外是否存在无成本的重资源入口

## 不在范围内

- Supabase / Vercel 平台自身的漏洞（请报告给对应平台）
- 依赖库自身的漏洞（由 Dependabot 与 CodeQL 跟踪；也可直接提 issue）
- 需要物理接触或已获得设备控制权才能利用的问题

## 请不要附带真实密钥

报告与截图里不要出现 Supabase secret key、`.env` 内容或任何登录凭据。需要演示时请用伪造值。
