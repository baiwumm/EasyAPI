<div align="center">
  <img alt="EasyAPI logo" src="./public/logo.svg" width="80" />
  <h1>EasyAPI</h1>
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
  <a href="https://github.com/baiwumm/EasyAPI" target="_blank">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/baiwumm/EasyAPI?style=social" />
  </a>
  <a href="https://github.com/baiwumm/EasyAPI" target="_blank">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/baiwumm/EasyAPI?style=social" />
  </a>
  <a href="./LICENSE" target="_blank">
    <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue?style=flat" />
  </a>
</div>

### 📺 宣传片

<div align="center">
  <video src="https://github.com/user-attachments/assets/a17d0126-beea-47e2-a6d0-747c95addbd9" width="90%" controls muted playsinline></video>
  <br />
  <sub>53 秒 · 1080p · 中文口播 + 中英字幕（附件载体见 <a href="https://github.com/baiwumm/EasyAPI/issues/1">#1</a>，请勿删除）</sub>
</div>

## 🌱 简介

`EasyAPI` 是一个基于 Next.js 与 Supabase 的 API 聚合平台。

它专注做一件小事：把常用 API 收拾得干干净净，打开就能用。覆盖每日推荐、随机生成、心灵语录、生活服务、功能小栈等 30+ 个高频接口，支持亮暗主题、响应式布局、基础 SEO，以及登录后的接口分类与管理。

## 🌿 截图

| 亮色模式 | 暗色模式 |
| --- | --- |
| ![亮色模式](./public/light.png) | ![暗色模式](./public/dark.png) |

| 接口分类 | 接口列表 |
| --- | --- |
| ![分类列表](./public/categorys.png) | ![接口列表](./public/apis.png) |

## 🔌 开放 API

全部接口公开可直连，在线文档：<https://api.baiwumm.com/docs>（源文件 [`public/openapi.yaml`](./public/openapi.yaml)）。

限流：按客户端 IP **30 次 / 60 秒**，超限返回 `429`（Vercel 边缘层纯文本响应，约 1 分钟自动恢复）。

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

```bash
# Supabase（必填）
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 后台管理员邮箱白名单（逗号分隔多个），只有白名单内的账号能进入后台增删改查
ADMIN_EMAILS=
```

站点标题、SEO、统计、版权与备案等可选项见 [`.env.example`](./.env.example)。

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
