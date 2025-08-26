<div align="center">
  <h1>EasyAPI</h1>
  <p>一个基于 Nuxt 4 构建的简单易用的 API 服务平台，提供多种实用的 API 接口和管理后台</p>
</div>

<div align="center">
  <a href="https://nuxt.com/" target="_blank">
    <img alt="Nuxt" src="https://img.shields.io/badge/Nuxt-4.0-00DC82?style=flat&logo=nuxt.js&logoColor=white">
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white">
  </a>
  <a href="https://pnpm.io/" target="_blank">
    <img alt="pnpm" src="https://img.shields.io/badge/pnpm-8.0-F69220?style=flat&logo=pnpm&logoColor=white">
  </a>
  <a href="https://eslint.org/" target="_blank">
    <img alt="ESLint" src="https://img.shields.io/badge/ESLint-9.0-4B32C3?style=flat&logo=eslint&logoColor=white">
  </a>
  <a href="./LICENSE" target="_blank">
    <img alt="LICENSE" src="https://img.shields.io/badge/license-MIT-blue?style=flat">
  </a>
</div>

## ✨ 特性

- 🚀 基于 Nuxt 4 构建，性能优异
- 📱 响应式设计，支持多端访问
- 🎨 现代化 UI 界面，支持暗黑模式
- 🔐 完整的用户认证系统
- 📊 管理后台，支持 API 和分类管理
- 🌐 多种实用 API 接口
- ⚡ TypeScript 支持
- 🎯 RESTful API 设计

## 📋 API 接口

项目提供以下 API 接口：

### 🌅 每日推荐
- **每日一言** - `/api/hitokoto`
- **毒鸡汤** - `/api/chicken-soup`
- **土味情话** - `/api/love-words`
- **每日笑话** - `/api/dairy-joke`
- **每日冷知识** - `/api/cold-fact`
- **舔狗日记** - `/api/dog-diary`
- **每日诗词** - `/api/diary-poetry`
- **必应壁纸** - `/api/bing-wallpaper`


### 📰 新闻资讯
- 📱 **微博热搜** - `/api/weibo`

### 管理接口
- 📊 **API 管理** - `/api/admin/apis`
- 📂 **分类管理** - `/api/admin/categorys`

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 服务器将在 http://localhost:3000 启动
```

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## 📁 项目结构

```
EasyAPI/
├── app/                    # 应用源码
│   ├── components/         # 组件库
│   ├── layouts/           # 布局文件
│   ├── pages/             # 页面文件
│   ├── lib/               # 工具库
│   └── assets/            # 静态资源
├── server/                # 服务端代码
│   ├── api/               # API 接口
│   └── middleware/        # 中间件
├── public/                # 公共静态文件
└── data.js               # 数据文件
```

## 🎯 主要功能

### 前台功能
- 🏠 **首页展示** - 展示所有可用的 API 接口
- 🔍 **接口搜索** - 快速查找所需的 API
- 📖 **接口文档** - 详细的 API 使用说明
- 🌙 **主题切换** - 支持明暗主题切换

### 后台管理
- 👤 **用户登录** - 安全的用户认证
- 📊 **API 管理** - 增删改查 API 接口
- 📂 **分类管理** - 管理 API 分类
- 📈 **调用统计** - API 调用次数统计

## 🔧 配置说明

### 环境变量

创建 `.env` 文件并配置以下变量：

```env
# 应用配置
NUXT_APP_BASE_URL=http://localhost:3000

# 数据库配置（如需要）
DATABASE_URL=your_database_url

# 其他配置...
```

### Nuxt 配置

主要配置在 `nuxt.config.ts` 文件中，包括：
- 应用基础配置
- 模块配置
- 构建配置
- 服务端配置

## 📝 开发指南

### 添加新的 API 接口

1. 在 `server/api/` 目录下创建新的接口文件
2. 在 `data.js` 中添加接口信息
3. 更新前台展示页面

### 组件开发

项目采用组件化开发，所有组件位于 `app/components/` 目录下，每个组件都有独立的文件夹和 `index.vue` 文件。

### 样式规范

- 使用现代 CSS 特性
- 支持响应式设计
- 遵循 BEM 命名规范

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 提交 Issue
- 发起 Pull Request
- 邮件联系

---

⭐ 如果这个项目对你有帮助，请给它一个星标！