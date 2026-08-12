<div align="center">
  <img alt="Easy API logo" src="./public/logo.svg" width="80" />
  <h1>Easy API</h1>
  <p>一个把常用 API 收拾得干干净净的小站。</p>
</div>

<div align="center">
  <a href="https://api.baiwumm.com/" target="_blank">
    <img alt="Preview" src="https://img.shields.io/badge/在线预览-api.baiwumm.com-black?style=flat" />
  </a>
  <a href="https://nextjs.org/" target="_blank">
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js" />
  </a>
  <a href="https://www.heroui.com/" target="_blank">
    <img alt="HeroUI" src="https://img.shields.io/badge/HeroUI-v3-black?style=flat" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-v4-black?style=flat&logo=tailwindcss" />
  </a>
  <a href="https://supabase.com/" target="_blank">
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-black?style=flat&logo=supabase" />
  </a>
  <a href="./LICENSE" target="_blank">
    <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue?style=flat" />
  </a>
</div>

## 🌱 简介

`Easy API` 是一个基于 Next.js 与 Supabase 的 API 聚合平台。

它专注做一件小事：把常用 API 收拾得干干净净，打开就能用。覆盖每日推荐、随机生成、心灵语录、生活服务、功能小栈等 30+ 个高频接口，支持亮暗主题、响应式布局、基础 SEO，以及登录后的接口分类与管理。

## 🌿 截图

| 亮色模式 | 暗色模式 |
| --- | --- |
| ![亮色模式](./public/light.png) | ![暗色模式](./public/dark.png) |

| 接口分类 | 接口列表 |
| --- | --- |
| ![分类列表](./public/categorys.png) | ![接口列表](./public/apis.png) |

## ☘️ 技术栈

- Next.js 16 + React 19
- HeroUI v3
- Tailwind CSS v4
- Supabase
- Vercel

## 🪴 本地开发

### 🌱 环境要求

- Node.js >= 18.17
- pnpm

### 🌵 启动项目

```bash
git clone https://github.com/baiwumm/EasyAPI.git
cd EasyAPI
pnpm install
pnpm dev
```

先将 `.env.example` 复制为 `.env.local`，再补全你自己的环境变量。

默认访问：`http://localhost:3000`

## 🌼 环境变量

项目主要使用这些环境变量：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 后台管理员邮箱白名单（逗号分隔多个）。只有此列表内的账号能进入后台/执行增删改查。
ADMIN_EMAILS=me@baiwumm.com,baiwumm@foxmail.com,843348394@qq.com

NEXT_PUBLIC_APP_NAME=EasyApi
NEXT_PUBLIC_APP_TITLE=一个把常用 API 收拾得干干净净的小站
NEXT_PUBLIC_APP_DESC=基于 Next.js 构建的高性能 API 聚合平台，统一管理多服务商接口，支持智能转发与数据缓存，让 API 集成更简单。
NEXT_PUBLIC_APP_KEYWORDS=Easy Api,API聚合,API管理,接口聚合平台,Next.js API,Next.js聚合,API网关,微服务网关,接口代理,请求转发,数据缓存,RESTful API,第三方API集成,Serverless,Next.js 16,TypeScript,API路由,后端即服务,BaaS,低代码平台,开发工具
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_COPYRIGHT=白雾茫茫丶
NEXT_PUBLIC_ICP=粤ICP备2023007649号
NEXT_PUBLIC_GUAN_ICP=粤公网安备44030402006402号

NEXT_PUBLIC_GOOGLE_ID=
NEXT_PUBLIC_CLARITY_ID=
```

完整示例见 [`.env.example`](./.env.example)。

## 🍀 Supabase 配置

开始之前，你需要在 Supabase 中准备好以下内容：

1. 创建项目，并填写 `NEXT_PUBLIC_SUPABASE_URL` 与 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. 配置认证方式，并将你的邮箱加入 `ADMIN_EMAILS` 白名单（只有白名单账号能进入后台增删改查）
3. 初始化项目依赖的数据结构：`ea_categorys`、`ea_apis` 表，以及 `increment_call_count` 函数
4. 建议在 SQL Editor 中执行 [`supabase/rls.sql`](./supabase/rls.sql)，开启行级安全（RLS），防止有人拿浏览器公开的 anon key 直接调用 REST API 绕过应用层

如果你准备把它作为自己的接口站二次使用，最省事的方式是按当前前端字段结构直接在 Supabase 中建表，再根据自己的登录方式补齐鉴权策略。

## 🌲 部署

推荐直接部署到 Vercel：

1. Fork 本项目
2. 在 Vercel 中导入仓库
3. 配置环境变量
4. 点击 Deploy

## 🌸 许可证

[MIT](./LICENSE) © [baiwumm](https://baiwumm.com)
