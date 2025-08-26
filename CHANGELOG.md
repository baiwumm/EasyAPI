# Changelog

## [1.4.0](https://github.com/baiwumm/EasyAPI/compare/1.3.0...1.4.0) (2025-08-26)

### ✨ Features | 新功能

* 舔狗日记 从 数据库获取 ([16ebb1c](https://github.com/baiwumm/EasyAPI/commit/16ebb1ca39df4db4bc9d123abf707dc3176c4c9f))
* 新增 处理调用次数中间件 ([34224fe](https://github.com/baiwumm/EasyAPI/commit/34224fe54fca35997cedd9960f0e6e87a9418534))
* 新增 今日诗词 接口 ([6d7a99e](https://github.com/baiwumm/EasyAPI/commit/6d7a99e96c6e18bb00519604767d652d1bb9cfd4))
* 新增 每日冷知识 接口 ([9dad708](https://github.com/baiwumm/EasyAPI/commit/9dad708c67b4af293f7a6fb585c37509f5ecabba))
* 新增 每日笑话 接口 ([7c8f9cb](https://github.com/baiwumm/EasyAPI/commit/7c8f9cbb42fe17ba487a053eed65ebf3392c832e))
* 新增 土味情话 接口 ([ff3df34](https://github.com/baiwumm/EasyAPI/commit/ff3df34296bf0052501237fe1eae73023034ce0e))
* 新增自定义字体 ([c86ce68](https://github.com/baiwumm/EasyAPI/commit/c86ce68fb656a700236580d25db3fbdaeb445748))
* update README.md ([e738cca](https://github.com/baiwumm/EasyAPI/commit/e738ccab0e528bf8f733d127a9a342d2c7a415b0))

### ⚡ Performance Improvements | 性能优化

* 去掉顶部的 Github 链接 ([652502d](https://github.com/baiwumm/EasyAPI/commit/652502df3a2a7a67d1a3d4fb097039944080a975))
* 细节优化 ([0299007](https://github.com/baiwumm/EasyAPI/commit/029900741707a1721c96557a16ee1b5f88d1aa1c))
* 修复 TS 类型报错问题 ([5b13e1c](https://github.com/baiwumm/EasyAPI/commit/5b13e1c4dcc3b7ba339a0b66716809ce3323b43e))

## [1.3.0](https://github.com/baiwumm/EasyAPI/compare/1.2.0...1.3.0) (2025-08-24)

### ✨ Features | 新功能

* 接口新增  operation_id 字段 ([a131367](https://github.com/baiwumm/EasyAPI/commit/a1313677537bc7538cb7d7491c254841723a1b23))
* 添加舔狗日记接口 ([4f5c067](https://github.com/baiwumm/EasyAPI/commit/4f5c067d27bb662493da847ae17bc6dd7d0465ea))
* 新增 毒鸡汤 接口，统一请求响应信息 ([9f11514](https://github.com/baiwumm/EasyAPI/commit/9f11514e9fff061a9035a882283602bf03450140))
* 新增 bind 每日壁纸 接口 ([cb2f48a](https://github.com/baiwumm/EasyAPI/commit/cb2f48a7d4558c6f20fbd45b75ca1b9893dee98f))
* 新增接口配置 ([bfe0daa](https://github.com/baiwumm/EasyAPI/commit/bfe0daaf31d7706c5fee7bf906ef8f996e2edff6))
* 新增跨域中间件 ([ef6dfac](https://github.com/baiwumm/EasyAPI/commit/ef6dfacf790796c488d79b065bb999902f5636b4))
* 新增每日一言接口 ([1b2d6aa](https://github.com/baiwumm/EasyAPI/commit/1b2d6aabbdf7cf02d7e698b57c40ad8dd4d35980))
* 优化页面排版 ([28aadc9](https://github.com/baiwumm/EasyAPI/commit/28aadc9fecce9addfbbdb5558ff7ed24357fa5d2))
* update pnpm-lock.yaml ([e55d677](https://github.com/baiwumm/EasyAPI/commit/e55d67773dc259127dbe28adb4ac38b3a015fdc6))

### ⏪ Reverts | 回退

* Revert "perf: 删除 Supabase 数据库，后续采用 Hashnode 作为接口文档" ([b0615c7](https://github.com/baiwumm/EasyAPI/commit/b0615c7d99cfe5dc647945c348f8ed8e18df8649))

## [1.2.0](https://github.com/baiwumm/EasyAPI/compare/1.0.0...1.2.0) (2025-08-20)

### ✨ Features | 新功能

* 添加微博热搜接口，优化排版 ([445fe9a](https://github.com/baiwumm/EasyAPI/commit/445fe9ae72550f6091210b98e8199471fd808e99))

### 🎫 Chores | 其他更新

* Release v1.1.0 ([5d8e139](https://github.com/baiwumm/EasyAPI/commit/5d8e139546491864693712f74548cb4b158c0a35))

### ⚡ Performance Improvements | 性能优化

* 删除 Supabase 数据库，后续采用 Hashnode 作为接口文档 ([83090ea](https://github.com/baiwumm/EasyAPI/commit/83090eaa6d87b639ba1e4d2ed027ea34b4b2b1b3))

## [1.1.0](https://github.com/baiwumm/EasyAPI/compare/1.0.0...1.1.0) (2025-08-20)

### ✨ Features | 新功能

* 添加微博热搜接口，优化排版 ([445fe9a](https://github.com/baiwumm/EasyAPI/commit/445fe9ae72550f6091210b98e8199471fd808e99))

### ⚡ Performance Improvements | 性能优化

* 删除 Supabase 数据库，后续采用 Hashnode 作为接口文档 ([83090ea](https://github.com/baiwumm/EasyAPI/commit/83090eaa6d87b639ba1e4d2ed027ea34b4b2b1b3))

## [1.0.0](https://github.com/baiwumm/EasyAPI/compare/1.1.0...1.0.0) (2025-08-01)

### ♻ Code Refactoring | 代码重构

* 使用 Nuxt4.0 重构项目 ([b91f16b](https://github.com/baiwumm/EasyAPI/commit/b91f16b5b3fae0ddc2a4d7b1f6351cb52d81cc20))
