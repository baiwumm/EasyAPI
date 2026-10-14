# Changelog

## [2.10.0](https://github.com/baiwumm/EasyAPI/compare/v2.9.0...v2.10.0) (2026-10-14)

### ✨ Features | 新功能

* **api:** GitHub 头像走本站代理，解决部分网络头像不显示 ([20b35c4](https://github.com/baiwumm/EasyAPI/commit/20b35c4c6e93219aa96bd17a00b7035e3d8da211))
* **api:** random-image 换回 picsum 真实照片源 ([d1cc26c](https://github.com/baiwumm/EasyAPI/commit/d1cc26c7b42e05daebf809b3ae44ca97ffc6570b))
* **api:** random-image 改为本地生成 SVG data URI，摆脱第三方图源 ([c2d3e7f](https://github.com/baiwumm/EasyAPI/commit/c2d3e7f42951f3190483a8b93dac95d988b7778c))
* **header:** 顶部导航加 GitHub 入口，开源准备补 repository 元数据 ([1cef8d1](https://github.com/baiwumm/EasyAPI/commit/1cef8d1e382033f6f74a13e51a86f968f7baa847))
* **home:** 后台写操作后立即失效首页 ISR 缓存 ([cc102c3](https://github.com/baiwumm/EasyAPI/commit/cc102c34fefbd87001933e51c11d6b950a69a662))

### 🐛 Bug Fixes | Bug 修复

* **a11y:** 404 页不再嵌套交互元素，CopyChip 稳定 render 引用 ([034a392](https://github.com/baiwumm/EasyAPI/commit/034a3921141e7978adb1cdf4598de799bc3457a5))
* **a11y:** AlertContent/ErrorContent 操作按钮合并为一套 ([2eddaa8](https://github.com/baiwumm/EasyAPI/commit/2eddaa804fdc7a4362717b7c1c9cdcec37c7d18b))
* **a11y:** ApiCard 补 aria-label 与 title，NEW 判定避开 hydration mismatch ([5d75261](https://github.com/baiwumm/EasyAPI/commit/5d752617a824dee39a7bb3cd1a9842d5ab02ab1c))
* **admin:** write-guard 拦截空 payload 并补齐字段取值范围 ([8e23c4c](https://github.com/baiwumm/EasyAPI/commit/8e23c4cd641fa3444d20398c737b503c88539fb6))
* **api:** barcode PNG 栅格化前校验尺寸，不再透出 sharp 原文 ([7ae70e0](https://github.com/baiwumm/EasyAPI/commit/7ae70e0ba4d1d25d67885569e7e8f0e748fda3b6))
* **api:** barcode 只按白名单透传 JsBarcode 选项 ([19ed6ff](https://github.com/baiwumm/EasyAPI/commit/19ed6ff4ed0d160cc8b54c70dccef2b6e1966e26))
* **api:** ip-region 补缓存策略与 JSON 兜底 ([83de45c](https://github.com/baiwumm/EasyAPI/commit/83de45c3e6d643ac9dc7f60ca504f75f4bbd1733))
* **api:** password-strength 改 POST + 限流并不再回显密码 ([e468e29](https://github.com/baiwumm/EasyAPI/commit/e468e29b26cea68d90da80f6234d74a44dd6a132))
* **api:** 修正接口参数校验与空数据返回 ([463d5f2](https://github.com/baiwumm/EasyAPI/commit/463d5f2daf2ef8dbdeb302170362ca2b0f056702))
* **api:** 列表分页改用 parseBoundedInt 并给 pageIndex 加上限 ([6756b28](https://github.com/baiwumm/EasyAPI/commit/6756b284684bb35b4ff839b3b87642e4d5a82c82))
* **api:** 调用计数固定 +1 并按 path 单轮 RPC，去掉每个 GET 的预查询 ([515b954](https://github.com/baiwumm/EasyAPI/commit/515b954374ad52768d9aad15dc50d32801e5ee8d))
* **auth:** OAuth 登录回跳发起登录的源地址，本地与线上各自生效 ([a774a58](https://github.com/baiwumm/EasyAPI/commit/a774a5842c5f34ea38d11ae4c83eb8edbf8de599))
* **auth:** 鉴权守卫上移 src/proxy.ts，删掉 OAuth code 的 rewrite 分支 ([802006b](https://github.com/baiwumm/EasyAPI/commit/802006b2c4204acd196d90b46e1e9031f02093d4))
* **bing:** 修正壁纸地址二次拼接并在返回前校验地址 ([2669c47](https://github.com/baiwumm/EasyAPI/commit/2669c47cc493247c6ea1329923729c746605ec81))
* **ci:** allowBuilds 显式声明跳过字体工具链构建脚本 ([2cd031f](https://github.com/baiwumm/EasyAPI/commit/2cd031f233f22636127bc91af1534aa17bbc03e6))
* **lint:** 摸清 no-img-element 平台差异，opengraph 移除误报豁免、修 proxy.ts 漂移 ([11e0ddf](https://github.com/baiwumm/EasyAPI/commit/11e0ddfdc1fa342ae6a0adf984527d4c0e9e4e5d))
* **security:** 补齐字典表 RLS 策略并停止对外泄露数据库错误 ([b0a7c74](https://github.com/baiwumm/EasyAPI/commit/b0a7c7449d58aaf07b19466956e4368d3391b7a1))
* **styles:** 滚动条规则收拢 :root 并常驻 scrollbar-gutter: stable，修复带滚动条页面弹窗退场卡死关不掉 ([681dba6](https://github.com/baiwumm/EasyAPI/commit/681dba649e6de572f5756a7409215ecfe30038ae))
* **ui:** 修复三个交互缺陷与一个空态破图 ([690bc60](https://github.com/baiwumm/EasyAPI/commit/690bc608aacc06e7181414e746b19312bce4bab5))
* **web:** 拆分 SWR 首屏与后台验证语义，后台刷新不再卸载结果区 ([cdeebe9](https://github.com/baiwumm/EasyAPI/commit/cdeebe9b9786ae91d291e8b291774770b859b299))
* **web:** 首屏 Logo 加 priority，消除 LCP 检测警告 ([cacc1fd](https://github.com/baiwumm/EasyAPI/commit/cacc1fd7e90c448b5de12023f6b2d8aa1c834235))

### 🎫 Chores | 其他更新

* **deps:** next 升级到 16.4.0，同步 @next/third-parties 与 eslint 插件版本 ([9072bac](https://github.com/baiwumm/EasyAPI/commit/9072bac85630659b67fb00efed110aac48c896c2))
* **deps:** react 与 react-dom 升级到 19.3.0，[@types](https://github.com/types) 同步 ([2a56140](https://github.com/baiwumm/EasyAPI/commit/2a56140ef1cdfe7e56c9978f593159de1bc6b85c))
* **deps:** semver 兼容升级 15 个依赖（HeroUI 3.2.6、react-aria 3.53.1、supabase、eslint 10.12 等） ([03508f7](https://github.com/baiwumm/EasyAPI/commit/03508f7a488a514d321f799da01ab51836fd9922))
* **deps:** 升级 theme-switch-animation 依赖包 ([1931905](https://github.com/baiwumm/EasyAPI/commit/193190558a38a94048566757883f2268f75a5999))
* **deps:** 新增 cn-font-split 与 jsdom/testing-library 测试依赖 ([03d98ce](https://github.com/baiwumm/EasyAPI/commit/03d98ce8d866b36e6116890513332b8372051264))
* **deps:** 移除未使用的 @vitejs/plugin-react 与 @types/xmldom ([8d381ea](https://github.com/baiwumm/EasyAPI/commit/8d381ea26025c18b5511c1211dd29f72dfe9e139))
* package.json 补 packageManager 字段钉住 pnpm 版本 ([cd448d5](https://github.com/baiwumm/EasyAPI/commit/cd448d52b0d604e908e8b51af2c71f6339fea33d))
* **release:** Release 标题统一 v 前缀——存量 34 条脚本归一，release-it 补 releaseName 治本 ([71808fb](https://github.com/baiwumm/EasyAPI/commit/71808fb296b6f5a3a39e62244ccb1003a87b0ceb))
* **release:** tag 切换 v 前缀，发版自动同步 openapi.yaml 版本号 ([c457476](https://github.com/baiwumm/EasyAPI/commit/c457476827c1ea146c21ed085caa727a5935691e))
* 修复 pnpm-workspace.yaml 配置项非法导致所有 pnpm 命令无法执行 ([9a1e42b](https://github.com/baiwumm/EasyAPI/commit/9a1e42bd3c2fcdb6041fc775a8f97cb81ddb9576))
* 历史 tag 与 Release 迁移至 v 前缀 ([deaa1f2](https://github.com/baiwumm/EasyAPI/commit/deaa1f21b16a70331f3950d4ebf7e2bd9ddcff5f))
* 清理死文件——.heroui-docs 文档缓存出库、shadcn 残留 components.json、模板遗留 vercel.svg/og.png/数字截图、孤儿组件 SkeletonContent ([7525e5f](https://github.com/baiwumm/EasyAPI/commit/7525e5f791e047f63b0a3f3be5a99d473d766d4d))

### 📝 Documentation | 文档

* **api:** 关闭全站挑战改为边缘限流，文档补限流口径（30 次/60 秒/IP，429 纯文本） ([43cd44e](https://github.com/baiwumm/EasyAPI/commit/43cd44eedc14664c5fd8dc6d8a39a167625a12c3))
* **api:** 按 route.ts 实际校验补齐 openapi.yaml 的 4 处漂移 ([b7ca5ba](https://github.com/baiwumm/EasyAPI/commit/b7ca5ba180e128b875e86299da3bf84fca5ae14a))
* backlog F7 移入已完成（引擎拆分 + 首屏外降级） ([8394478](https://github.com/baiwumm/EasyAPI/commit/83944785c8a2ef7eefb0ce764004fc15971a9eee))
* backlog 待办清零（P3 七项移入已完成）并同步覆盖清单 ([10748a3](https://github.com/baiwumm/EasyAPI/commit/10748a3cc0edc6d74080906e460e155b63f898a6))
* backlog 清空安全与正确性组（C6/C7、F1/C5 完成，含 SQL 上线顺序说明） ([6694305](https://github.com/baiwumm/EasyAPI/commit/6694305bdfd02a9b5191a34a72471699cb7cd3a9))
* **readme:** 去掉截图章节，清理 README 独占截图（light.png 保留供 OG 卡片使用） ([1317a8f](https://github.com/baiwumm/EasyAPI/commit/1317a8fa3d5a31550a779195e031ff4fae976922))
* **readme:** 宣传片升级为 issue 附件内嵌播放器（user-attachments） ([27d2cd1](https://github.com/baiwumm/EasyAPI/commit/27d2cd1c1b3cfb3530906a3f61d53e69e0539f37))
* **readme:** 宣传片改为封面海报 + Release 下载（GitHub README 不放行非 user-attachments 的 video 标签） ([65247ac](https://github.com/baiwumm/EasyAPI/commit/65247ac7acf4605492acbc854e088fefa15967ed))
* **readme:** 嵌入宣传片（promo-film Release 附件）并收敛环境变量说明 ([694d05e](https://github.com/baiwumm/EasyAPI/commit/694d05e874798d89032bed8601a66aac55d709b3))
* **sql:** 计数函数改单引号 language sql 写法，规避 SQL Editor 的 dollar-quote 坑 ([6ea0962](https://github.com/baiwumm/EasyAPI/commit/6ea0962a0558de56499f709c9cce873b1293d7af))
* upgrades.md 补记 motion 14 与 [@scalar](https://github.com/scalar) 0.12 待评估项，移除已完成的 G4 ([c47d8fd](https://github.com/baiwumm/EasyAPI/commit/c47d8fd03bb11f07f5b5b0f709db7030bc8a6af1))
* 同步 backlog 与测试覆盖清单（F8/G8/T1/T2 完成，244 条测试） ([1af5314](https://github.com/baiwumm/EasyAPI/commit/1af5314558f36d012f0e2cfac5df07527640b248))
* 同步 backlog 待办状态与测试覆盖清单（18 项已完成，214 条测试） ([bce4cdc](https://github.com/baiwumm/EasyAPI/commit/bce4cdc2d235fc7bb7e002d6c35d9b9a37a3b784))
* 同步 CI 与自动发版说明 ([04f1124](https://github.com/baiwumm/EasyAPI/commit/04f1124889788a8fd48f35b8a469a9dae3a6cdd3))
* 同步 random-image 图源说明（openapi 描述 + backlog G8 条目） ([f2554aa](https://github.com/baiwumm/EasyAPI/commit/f2554aa245d3aef08cf42d7c949f89446c84b2a4))
* 命名规范措辞对齐实践——路由目录 kebab-case、组件目录 PascalCase ([dace1b2](https://github.com/baiwumm/EasyAPI/commit/dace1b26d9d286b8147dc92899cec10dd6a78734))
* 拆分 AGENTS.md 到 docs/ 并补齐待办清单 ([359a29e](https://github.com/baiwumm/EasyAPI/commit/359a29ecc5a1435331f9993eeb8e23555d5b7d6c))
* 补 env 示例与接口文档版本号对齐 ([0f9e777](https://github.com/baiwumm/EasyAPI/commit/0f9e777ecc9de3ac1edb0caa874b811868cb1dbd))

### 💄 Styles | 风格

* 修复 CI 检出的 8 文件 prettier 格式漂移；actions 升至当前大版本 ([b8be22c](https://github.com/baiwumm/EasyAPI/commit/b8be22c74543dbe90e67869d52a719ea04d466b4))

### ♻ Code Refactoring | 代码重构

* **components:** GridReveal canvas 引擎拆分为纯模块 ([b9361b5](https://github.com/baiwumm/EasyAPI/commit/b9361b5d4d6af9c97d21731d5711a124300fbbad))
* **components:** StaggerIn 去掉子元素包装层，交错动画改 CSS 实现 ([abdd9ad](https://github.com/baiwumm/EasyAPI/commit/abdd9ad0dd47e9983f4f7c1e5a03a1170c95437f))
* **enums:** index.tsx 改名 index.ts（纯数据无 JSX，扩展名与内容对齐） ([eb17b48](https://github.com/baiwumm/EasyAPI/commit/eb17b48fca123cbcde17b396c6f0dc21924448d3))
* **hooks:** 图片生成请求走统一请求层并修掉 blob URL 泄漏 ([a118f80](https://github.com/baiwumm/EasyAPI/commit/a118f8074beb866570d5ea9605993fcc9792d33a))
* **typings:** 删除公共 Columns 上从未使用的 user_id 与错拼 emial 字段 ([54e43aa](https://github.com/baiwumm/EasyAPI/commit/54e43aa1a4f2d0a8592ba99bc94be53562928ed5))
* **web:** 统一 SWR 查询 key 为 [pathname, params] ([b4e816e](https://github.com/baiwumm/EasyAPI/commit/b4e816efffcc08f44f9d72e21abb778fbd604af4))

### ⚡ Performance Improvements | 性能优化

* **avatar:** 批量头像改为单次请求直出 data URI ([3651fa1](https://github.com/baiwumm/EasyAPI/commit/3651fa10b02eea9549219a5f7d0df39fc9237a71))
* **avatar:** 随机头像 SVG 按 seed+style+size 走内存 LRU ([fbf8689](https://github.com/baiwumm/EasyAPI/commit/fbf868985dda369b55e52ee3b3d183dc1896865c))
* **components:** GridReveal 首屏外实例降级为普通 img ([d246148](https://github.com/baiwumm/EasyAPI/commit/d24614840aeae5c72ac84a97f04a812b62361e4b))
* **components:** 列设置选区变更合并为一次批量 set ([6875305](https://github.com/baiwumm/EasyAPI/commit/68753058f9d5ff95cbd67ba37c8149c660557f46))
* **web:** BackTop 进度环改 CSS 变量驱动，删掉每帧 setState ([9adae15](https://github.com/baiwumm/EasyAPI/commit/9adae1511c71dad963a16fee1de4b3890a9e888c))
* **web:** Maple Mono CN 字体分片按需加载，首屏不再全量拉 1.7MB ([b0018ff](https://github.com/baiwumm/EasyAPI/commit/b0018ff5384403e6772fac784ec4a6b3ba6cda01))
* **web:** OG 图路由加 revalidate 一天缓存 ([64c14a0](https://github.com/baiwumm/EasyAPI/commit/64c14a05ca2889c816cdc7a8464e08f5bbd1fb6e))

### ✅ Tests | 测试

* **admin:** 引入 jsdom 渲染测试，补 admin 两个 save-modal 表单用例 ([f8673dd](https://github.com/baiwumm/EasyAPI/commit/f8673ddfdf0f6731c2359f122910feb27a7e057b))
* **api-helpers:** 覆盖 ilikeOr / dbErrorResponse / randomTextResponse ([2bc73c5](https://github.com/baiwumm/EasyAPI/commit/2bc73c50134ea68ebea1b5d0da8e824f88047f0d))
* **api:** 补管理端 CRUD 的 23505 唯一性冲突与删分类引用检查用例 ([cd74641](https://github.com/baiwumm/EasyAPI/commit/cd74641c4fb6139c738d8ca26ed348de7677d665))
* **route:** 覆盖依赖 Supabase 的接口查询与错误路径 ([58f3e16](https://github.com/baiwumm/EasyAPI/commit/58f3e16342e57b0037f2c9798482c9024f88dbab))
* **route:** 覆盖四个不依赖 Supabase 的接口参数校验 ([e33e340](https://github.com/baiwumm/EasyAPI/commit/e33e3404cce517eccb403021fa32095eab3c0ab3))
* **utils:** 补齐 lib/utils 纯函数测试 ([44f3eb8](https://github.com/baiwumm/EasyAPI/commit/44f3eb811921c529f7b16a571dbd33c759376359))
* **web:** 补 JsonContent/QuoteWorld 的 SWR key 行为用例 ([e6f8d79](https://github.com/baiwumm/EasyAPI/commit/e6f8d792be6c29c3091110ba8cfbd923c4aea7f7))
* 修正测试文件的类型错误 ([1087ad9](https://github.com/baiwumm/EasyAPI/commit/1087ad9af0a9b5d610069f22f7f966f21b5f01e5))
* 引入 vitest 并配置路径别名 ([cc8dbb0](https://github.com/baiwumm/EasyAPI/commit/cc8dbb087c5caf5d89428a83da3e24a62f57438e))

### ⏪ Reverts | 回退

* **rls:** 回退字典表 RLS 脚本改动 ([d564a26](https://github.com/baiwumm/EasyAPI/commit/d564a261995bf5b9c9cba4da9d3ab4485d22d698))

### 🔧 Continuous Integration | CI 配置

* 升级 theme-switch-animation 到 ^0.5.1 版本 ([2b7113a](https://github.com/baiwumm/EasyAPI/commit/2b7113ae91bbf537477f1584766703a8acfd6056))
* 升级 theme-switch-animation 到 0.4.0 版本 ([05ec29c](https://github.com/baiwumm/EasyAPI/commit/05ec29cdc9b4dbbd30d428660d8ea48735d8eb5e))
* 接入 GitHub Actions——push/PR 三道门禁与 workflow_dispatch 一键发版 ([aec5876](https://github.com/baiwumm/EasyAPI/commit/aec5876ef5e41fe78d4d9e4db986b604fddc6540))

## [2.9.0](https://github.com/baiwumm/EasyAPI/compare/v2.8.1...v2.9.0) (2026-09-16)

### ✨ Features | 新功能

* 添加 theme-switch-animation 依赖包 ([745e52c](https://github.com/baiwumm/EasyAPI/commit/745e52cb41cd94cf6aa5ea3153200b76c762150d))
* 移除heroui-react-mcp插件配置 ([281ffe1](https://github.com/baiwumm/EasyAPI/commit/281ffe1c7f9df0be500af077a94f0fffeaffb981))
* **docs:** 接入 Scalar 接口文档页并新增手工维护的 OpenAPI 文档 ([478567c](https://github.com/baiwumm/EasyAPI/commit/478567ca517822999fdad9e968f512daae4a60ad))
* **random-image:** 接入 GridReveal 动效展示 ([55d2bd3](https://github.com/baiwumm/EasyAPI/commit/55d2bd3d30d8374b7b1f485acfdd24d49125bc2f))
* **theme:** 使用第三方库替换自定义主题切换动画 ([83dd558](https://github.com/baiwumm/EasyAPI/commit/83dd55819e9db78f840d4c880057e92e4b2a9e26))

### 🐛 Bug Fixes | Bug 修复

* **#10:** 公开列表接口 pageSize 上限 1000 ([8d74353](https://github.com/baiwumm/EasyAPI/commit/8d74353d69a4e7339677c7801ae8f2e45416e53c)), references [#10](https://github.com/baiwumm/EasyAPI/issues/10)
* **#11:** barcode 参数加界，防止超大图形码耗尽内存 ([63ec321](https://github.com/baiwumm/EasyAPI/commit/63ec321979974549216965f695219b99c6e1aba7)), references [#11](https://github.com/baiwumm/EasyAPI/issues/11)
* **#12:** 管理端写接口请求体白名单校验 ([89519f8](https://github.com/baiwumm/EasyAPI/commit/89519f81e7583b305a52e32734a7b13436585647)), references [#12](https://github.com/baiwumm/EasyAPI/issues/12)
* **#13:** 401 会话过期统一提示并跳转登录页 ([b45cfe8](https://github.com/baiwumm/EasyAPI/commit/b45cfe8d677696a7ae10d03749f3db5d29402149)), references [#13](https://github.com/baiwumm/EasyAPI/issues/13)
* **#14:** 删除分类增加服务端引用检查，孤儿数据不再崩表格 ([8b4c023](https://github.com/baiwumm/EasyAPI/commit/8b4c023e0bd161c0611c6a816a08b8645c174704)), references [#14](https://github.com/baiwumm/EasyAPI/issues/14)
* **#15:** categorys 保存弹窗禁止误关，对齐 apis 弹窗防护 ([50912f1](https://github.com/baiwumm/EasyAPI/commit/50912f12a28f594c33994546cf7a6d390850ffa7)), references [#15](https://github.com/baiwumm/EasyAPI/issues/15)
* **#16:** FullLoading 不再以 Splash 替换子树，SSR 内容对爬虫可见 ([bdd6a53](https://github.com/baiwumm/EasyAPI/commit/bdd6a538e8e25f57e47f3d20e570cd4bfdf8fcb2)), references [#16](https://github.com/baiwumm/EasyAPI/issues/16)
* **#17:** 修复 RLS 启用后 call_count 计数静默失效 ([3a5871f](https://github.com/baiwumm/EasyAPI/commit/3a5871fc64d639047c78abe634a716ca8610ed71)), references [#17](https://github.com/baiwumm/EasyAPI/issues/17)
* **#18:** 新增根级 error.tsx 错误边界 ([3754e45](https://github.com/baiwumm/EasyAPI/commit/3754e45a1e46e6fd897f788892d74292c91ddb8b)), references [#18](https://github.com/baiwumm/EasyAPI/issues/18)
* **#19:** TypingAnimation 修复 gsap 泄漏、句间停顿失效与空文本崩溃 ([add8111](https://github.com/baiwumm/EasyAPI/commit/add81118699ce6cb2fed4d3ccc72f0daf0f382b2)), references [#19](https://github.com/baiwumm/EasyAPI/issues/19)
* **#1:** holiday 未传 year 时默认返回当前年份而非 2022 ([6895b40](https://github.com/baiwumm/EasyAPI/commit/6895b404bb5ddcfd34d6be0899dd4d4213c229a0)), references [#1](https://github.com/baiwumm/EasyAPI/issues/1)
* **#20:** RPC/第三方返回为空时 format=text 不再崩 ([ed06800](https://github.com/baiwumm/EasyAPI/commit/ed06800ab52222ffdceb2d83412de257fd393594)), references [#20](https://github.com/baiwumm/EasyAPI/issues/20)
* **#21:** 数值参数 NaN 不再静默返回空数组 ([b6f969b](https://github.com/baiwumm/EasyAPI/commit/b6f969b2f667df010fe8e002c196f8d685b9d302)), references [#21](https://github.com/baiwumm/EasyAPI/issues/21)
* **#22:** country-code/license-plate 数据库错误如实返回 ([e9279cc](https://github.com/baiwumm/EasyAPI/commit/e9279cc96143d7289acb8d7ed94105d94d795e8d)), references [#22](https://github.com/baiwumm/EasyAPI/issues/22)
* **#23:** dairy-joke/tongue-twister 只输出 content 字段 ([367c6b6](https://github.com/baiwumm/EasyAPI/commit/367c6b6da7a42342142a631ceab1c51df9a69d17)), references [#23](https://github.com/baiwumm/EasyAPI/issues/23)
* **#24:** 修 response.json() 返回 any 赋值 cached 的类型错误 ([552976a](https://github.com/baiwumm/EasyAPI/commit/552976ae8339e123fdfb23b0bfac44d138c5fc9f)), references [#24](https://github.com/baiwumm/EasyAPI/issues/24)
* **#24:** diary-poetry 增加模块级缓存与超时降级 ([3c004c0](https://github.com/baiwumm/EasyAPI/commit/3c004c0e3a1afa24e4886135d54b9e71b959103c)), references [#24](https://github.com/baiwumm/EasyAPI/issues/24)
* **#26:** hitokoto 参数校验补全 ([228ccf1](https://github.com/baiwumm/EasyAPI/commit/228ccf16ccad37c4c5acb797f7738aae9dc41d25)), references [#26](https://github.com/baiwumm/EasyAPI/issues/26)
* **#27:** 唯一性冲突错误码 -1 收进 RESPONSE.DUPLICATE 枚举 ([cfa9134](https://github.com/baiwumm/EasyAPI/commit/cfa913440385232495f1b33ee7d92454678a1304)), references [#27](https://github.com/baiwumm/EasyAPI/issues/27)
* **#28:** almanac 输出日期补零，与 YYYY-MM-DD 入参契约一致 ([fb774bf](https://github.com/baiwumm/EasyAPI/commit/fb774bfd4bd43cfdbfac4c142dc81a0925cb1ceb)), references [#28](https://github.com/baiwumm/EasyAPI/issues/28)
* **#29:** 表格页首屏加载不再闪"暂无数据" ([cec087c](https://github.com/baiwumm/EasyAPI/commit/cec087c7d6880eeb3c919a21c1ee793cfa140708)), references [#29](https://github.com/baiwumm/EasyAPI/issues/29)
* **#30 回归:** QuoteWorld 恢复替换式 loading，修复换一句不更新内容 ([abb5472](https://github.com/baiwumm/EasyAPI/commit/abb547268710dcfda009e7df9d6cb8e54af6159a)), references [#30](https://github.com/baiwumm/EasyAPI/issues/30) [#30](https://github.com/baiwumm/EasyAPI/issues/30) [#30](https://github.com/baiwumm/EasyAPI/issues/30)
* **#30:** 替换式页面刷新时不再清空内容闪 Spinner ([3eb0099](https://github.com/baiwumm/EasyAPI/commit/3eb00999cf1a2e1d6c8dd6c1d6068660959bf38b)), references [#30](https://github.com/baiwumm/EasyAPI/issues/30)
* **#31:** 业务失败后不再残留旧内容误导用户 ([e546dcb](https://github.com/baiwumm/EasyAPI/commit/e546dcb4b0b232ccd6dfeb3e5110a67b08f42f0e)), references [#31](https://github.com/baiwumm/EasyAPI/issues/31)
* **#32:** 输入页支持回车提交 ([a5e47f4](https://github.com/baiwumm/EasyAPI/commit/a5e47f47ee2f6ea1d1c2b8619543f8525d495c3d)), references [#32](https://github.com/baiwumm/EasyAPI/issues/32)
* **#33:** 修正三处复制粘贴残留文案 ([9c12ad5](https://github.com/baiwumm/EasyAPI/commit/9c12ad5efd664da104ae59c13b34a3d0a59624af)), references [#33](https://github.com/baiwumm/EasyAPI/issues/33)
* **#34:** 删除当前页最后一条后回退一页，不再滞留越界空页 ([1a6d839](https://github.com/baiwumm/EasyAPI/commit/1a6d839c4d4399a994f971d94e2a675ae076293b)), references [#34](https://github.com/baiwumm/EasyAPI/issues/34)
* **#35:** 补 CircleXmarkFill 导入（前一提交门禁失误的修正） ([43e77f7](https://github.com/baiwumm/EasyAPI/commit/43e77f74b674e9b69c8247a0a0e6b375246c7ac7)), references [#35](https://github.com/baiwumm/EasyAPI/issues/35)
* **#35:** apis 保存弹窗 Select 补校验并加提交兜底 ([7c3d103](https://github.com/baiwumm/EasyAPI/commit/7c3d1036c486cb6ff337c13b8b9a57dee149a4a0)), references [#35](https://github.com/baiwumm/EasyAPI/issues/35)
* **#36:** useCallback 依赖改为稳定的 open 引用，恢复 columns memo ([98abcf0](https://github.com/baiwumm/EasyAPI/commit/98abcf0978fa78e76e742f8793103cb22157163d)), references [#36](https://github.com/baiwumm/EasyAPI/issues/36)
* **#37:** 分类保存后联动刷新 apis tab 的分类下拉缓存 ([58466d4](https://github.com/baiwumm/EasyAPI/commit/58466d4ff320915205e26539e180aeed06bb8ccf)), references [#37](https://github.com/baiwumm/EasyAPI/issues/37)
* **#38:** handleReset 手动刷新条件补 pageSize 判断，消除双请求竞态 ([8eb30c0](https://github.com/baiwumm/EasyAPI/commit/8eb30c0298663966306ed38b228df73b5f09cd16)), references [#38](https://github.com/baiwumm/EasyAPI/issues/38)
* **#39:** 移除登录页 2 秒后无条件 toast.clear() ([b5eb08c](https://github.com/baiwumm/EasyAPI/commit/b5eb08cbb8d9b8e63eb52dcb089b18b3d45896a4)), references [#39](https://github.com/baiwumm/EasyAPI/issues/39)
* **#3:** holiday 调休上班日不再被后续休息日清空 ([d716f1c](https://github.com/baiwumm/EasyAPI/commit/d716f1c222c2aaaba9fa93b7e573953a58eb3274)), references [#3](https://github.com/baiwumm/EasyAPI/issues/3)
* **#40:** 结果图懒加载、稳定行键与列定义提升 ([fefcf74](https://github.com/baiwumm/EasyAPI/commit/fefcf7429f67d278148769c05836528e0a388dd2)), references [#40](https://github.com/baiwumm/EasyAPI/issues/40)
* **#41:** CopyText 卸载清理定时器并移除死代码 try/catch ([41a9d06](https://github.com/baiwumm/EasyAPI/commit/41a9d06806779129d294944509dc3d9349907b6e)), references [#41](https://github.com/baiwumm/EasyAPI/issues/41)
* **#42:** 会话获取去重请求，UserAvatar 匿名跳过 /auth/me 并清理定时器 ([5597dcc](https://github.com/baiwumm/EasyAPI/commit/5597dccd02273fcdefd67fe0964997cfdc2ba240)), references [#42](https://github.com/baiwumm/EasyAPI/issues/42)
* **#43:** 类型错误已清零，恢复构建期类型拦截 ([632a8d2](https://github.com/baiwumm/EasyAPI/commit/632a8d218c1c04447be3d670487f269b56bb8c0a)), references [#43](https://github.com/baiwumm/EasyAPI/issues/43)
* **#43:** 新增 typecheck 脚本并清零存量类型错误 ([e3f64df](https://github.com/baiwumm/EasyAPI/commit/e3f64df9b0069d38eabae4dea9d93a0bf4ccdb32)), references [#43](https://github.com/baiwumm/EasyAPI/issues/43)
* **#44:** @gravity-ui/icons 从 devDependencies 移入 dependencies ([1d8cf5c](https://github.com/baiwumm/EasyAPI/commit/1d8cf5cca8096927d0ee451056c4f381d4e3e024)), references [#44](https://github.com/baiwumm/EasyAPI/issues/44)
* **#45:** 兼容 @xmldom/xmldom Document 类型（运行时结构兼容，显式收窄） ([f01dfd4](https://github.com/baiwumm/EasyAPI/commit/f01dfd459dbd11ae6e4408a0136ada99c98c6e60)), references [#45](https://github.com/baiwumm/EasyAPI/issues/45)
* **#45:** xmldom@0.6 替换为维护版 @xmldom/xmldom ([2b0ad5b](https://github.com/baiwumm/EasyAPI/commit/2b0ad5b2d6fe588d558a1bb31ceb36bdd0960c84)), references [#45](https://github.com/baiwumm/EasyAPI/issues/45)
* **#46:** 移除六项零引用依赖 ([8a53fcb](https://github.com/baiwumm/EasyAPI/commit/8a53fcb24cbbe4b4bd1385c884fd22f896a986a7)), references [#46](https://github.com/baiwumm/EasyAPI/issues/46)
* **#48:** sitemap 收录全部 36 个公开工具页，robots 修正受限路径 ([4ca1e39](https://github.com/baiwumm/EasyAPI/commit/4ca1e39ea7799595bfaad8aaa3caf7b0106c11f5)), references [#48](https://github.com/baiwumm/EasyAPI/issues/48)
* **#49:** 低频数据路由加 HTTP 缓存，首页 force-dynamic 改 ISR ([6fa86b5](https://github.com/baiwumm/EasyAPI/commit/6fa86b5970aff538f1d87ece37f1a18515d0192b)), references [#49](https://github.com/baiwumm/EasyAPI/issues/49)
* **#4:** country-code 列标签与字段对应关系修正 ([a732aa6](https://github.com/baiwumm/EasyAPI/commit/a732aa6620e7ada6e3ee2f7c806c8a0931eb4832)), references [#4](https://github.com/baiwumm/EasyAPI/issues/4)
* **#4:** prettier 格式修正（lint:fix 产物，归属 [#4](https://github.com/baiwumm/EasyAPI/issues/4)） ([e4759cd](https://github.com/baiwumm/EasyAPI/commit/e4759cd426db8726a819a95877b3b40e492bd32e))
* **#51:** call_count 计数移出响应关键路径并减负 ([9f7568c](https://github.com/baiwumm/EasyAPI/commit/9f7568cf1611b62f57665badcd2761a79ab0c940)), references [#51](https://github.com/baiwumm/EasyAPI/issues/51)
* **#52:** bing-wallpaper 外部 fetch 补 5s 超时 ([2c9c926](https://github.com/baiwumm/EasyAPI/commit/2c9c926918fb9875090f9a09baebe3d97e6c4d74)), references [#52](https://github.com/baiwumm/EasyAPI/issues/52)
* **#53:** 数据请求不再触发顶部进度条，与页内 Spinner 二选一 ([0face1d](https://github.com/baiwumm/EasyAPI/commit/0face1d4a870b5ca83e3efd63ba0410bc9850587)), references [#53](https://github.com/baiwumm/EasyAPI/issues/53)
* **#54:** 动画一致性补齐（reduced-motion 与视图过渡容错） ([c169422](https://github.com/baiwumm/EasyAPI/commit/c169422a1b7b6d0f676c2e8bf2c5f8368e168496)), references [#54](https://github.com/baiwumm/EasyAPI/issues/54)
* **#55:** 登录页细节完善 ([507cd43](https://github.com/baiwumm/EasyAPI/commit/507cd432e7227b9361eeb5d59f12f5b327d9d68b)), references [#55](https://github.com/baiwumm/EasyAPI/issues/55)
* **#56:** 补基础安全响应头并关闭 X-Powered-By ([cf5ab69](https://github.com/baiwumm/EasyAPI/commit/cf5ab6992df1bce40855f987ec5433e561d77282)), references [#56](https://github.com/baiwumm/EasyAPI/issues/56)
* **#57:** Vercel preview 环境不再加载 GA/Clarity ([92d9ff8](https://github.com/baiwumm/EasyAPI/commit/92d9ff8814df2c71a9bdcbae8a95de87ebfe8d37)), references [#57](https://github.com/baiwumm/EasyAPI/issues/57)
* **#58:** 杂项清理 ([66c6369](https://github.com/baiwumm/EasyAPI/commit/66c63695db389a257660085a8ebfa28d5d6355b2)), references [#58](https://github.com/baiwumm/EasyAPI/issues/58)
* **#58:** apis 唯一性冲突按约束名区分提示文案 ([db149e2](https://github.com/baiwumm/EasyAPI/commit/db149e29e9e95c93a9a992399086cd56ec4c942e)), references [#58](https://github.com/baiwumm/EasyAPI/issues/58)
* **#5:** qrcode 业务错误 JSON 不再被当图片数据解析 ([c88d453](https://github.com/baiwumm/EasyAPI/commit/c88d453e6c2ff03512a081d549ac2830a7ca7944)), references [#5](https://github.com/baiwumm/EasyAPI/issues/5)
* **#6:** 随机初始值改为确定性初值，消除 SSR/CSR 水合不一致 ([7d45dfa](https://github.com/baiwumm/EasyAPI/commit/7d45dfa53444b36d69436c78d90fec416123f4d9)), references [#6](https://github.com/baiwumm/EasyAPI/issues/6)
* **#7:** 补充挂载期 setState 的定向 lint 豁免（时区今日只能在客户端确定） ([f0f50ef](https://github.com/baiwumm/EasyAPI/commit/f0f50efc196658498b5ccbb63d319f7b94e655dd)), references [#7](https://github.com/baiwumm/EasyAPI/issues/7)
* **#7:** almanac 初始日期改为挂载后取用户本地时区 ([4f0aae5](https://github.com/baiwumm/EasyAPI/commit/4f0aae5e80b83f8ec7b562fd1bfdb5c77752e0fc)), references [#7](https://github.com/baiwumm/EasyAPI/issues/7)
* **#7:** lint 豁免注释移至 setState 调用行，lint 恢复全绿 ([8477570](https://github.com/baiwumm/EasyAPI/commit/847757000c4e52407f5c68dbcb1f70256a426ca8)), references [#7](https://github.com/baiwumm/EasyAPI/issues/7)
* **#8:** ip-region 增加 IP 格式校验、超时与响应检查 ([3e9a3d7](https://github.com/baiwumm/EasyAPI/commit/3e9a3d7691aaf2f81d8ac9fec162efcffbde666c)), references [#8](https://github.com/baiwumm/EasyAPI/issues/8)
* **#9:** 模糊搜索关键字净化，拦截 like/.or() 过滤器注入 ([0385379](https://github.com/baiwumm/EasyAPI/commit/0385379a955cbb6fa9e57e898087577073b1c942)), references [#9](https://github.com/baiwumm/EasyAPI/issues/9)
* 恢复生成页加载反馈并锁定首屏遮罩滚动 ([9f83b00](https://github.com/baiwumm/EasyAPI/commit/9f83b0043d2efa2f8998d19ba20940994a6a93a0))

### 🎫 Chores | 其他更新

* 安装 heroui-react 和 vercel-react-best-practices skills，更新 AGENTS.md ([199b58a](https://github.com/baiwumm/EasyAPI/commit/199b58a3322c197df052ec4a0459b75ec4211f45))
* **deps:** 升级依赖版本 ([dc1d8ad](https://github.com/baiwumm/EasyAPI/commit/dc1d8ad9ec53ca235608d677802d9ea16e355383))

### 📝 Documentation | 文档

* 归档审查清单与修复报告 ([1f68ac2](https://github.com/baiwumm/EasyAPI/commit/1f68ac22875d3fafc87731944068cbb8245b20b2))
* 删除项目审查清单文件 ([94d08d6](https://github.com/baiwumm/EasyAPI/commit/94d08d64c935108b806981d6facf902797f728a6))
* 删除已完成的历史工作文档 ([aed8fc3](https://github.com/baiwumm/EasyAPI/commit/aed8fc39df828794f7de2c238d5b160fce286a66))

### 💄 Styles | 风格

* 代码规范修复与 ESLint 全绿通过 ([08bd798](https://github.com/baiwumm/EasyAPI/commit/08bd798abae0ce4930fad09da37fe7ecbe85fad1))
* HeroUI 组件 onClick 改为 onPress ([63ba9a0](https://github.com/baiwumm/EasyAPI/commit/63ba9a0f67b569d56321cdaf7149735eb4da533e))

### ♻ Code Refactoring | 代码重构

* 将远程字体改为本地自托管方式 ([752bccd](https://github.com/baiwumm/EasyAPI/commit/752bccd0fc66c548752a483c5fd273f39d949e06))
* **batch-1:** T5 图片生成 hook + T6 已提交参数 hook + 共享常量组件 ([d0992a5](https://github.com/baiwumm/EasyAPI/commit/d0992a59bbbb4c0a7febea18fe799198d3750cf3))
* **batch-2:** T1 引言页模板统一 12 页 + T3 KV 校验 + T4 chips stagger ([8843c51](https://github.com/baiwumm/EasyAPI/commit/8843c5176bd3a8940339b97b81aad35575503db4))
* **batch-3:** API 路由模板抽取 ([4d6d1a5](https://github.com/baiwumm/EasyAPI/commit/4d6d1a5477129b7072e04a92c1c5c4bf2895b672))
* **batch-4:** admin 表格壳与删除弹窗合并为共享组件 ([f827ae9](https://github.com/baiwumm/EasyAPI/commit/f827ae99ca53d356c6a7d3ca52ad0f7902832594))
* **eslint:** 将 @antfu/eslint-config 替换为标准 eslint 配置 ([aa68094](https://github.com/baiwumm/EasyAPI/commit/aa68094d546835268dfbdb4ec6c81695b2121c2c))
* **Header:** 移除社交链接功能并优化组件依赖 ([dd7c571](https://github.com/baiwumm/EasyAPI/commit/dd7c571f291d54e8e8c88396883674e32e79ec0e))
* **loading:** 删除路由加载组件 ([7076997](https://github.com/baiwumm/EasyAPI/commit/7076997b58ec4c95d6b28bd0e70f74aa6e47f1ba))
* **QuoteWorld:** 移除未使用的isLoading变量 ([13ba784](https://github.com/baiwumm/EasyAPI/commit/13ba784124127eb6cb89c455dbb191b9bad52451))
* **types:** 将全局命名空间 App 改为 ES module 导出 ([78c9ca2](https://github.com/baiwumm/EasyAPI/commit/78c9ca283c3ddf693e00163f9d435f498e523960))

## [2.8.1](https://github.com/baiwumm/EasyAPI/compare/v2.8.0...v2.8.1) (2026-08-12)

### ✨ Features | 新功能

* **admin:** 非管理员隐藏后台入口，参考 better-nav 做法 ([6ae1912](https://github.com/baiwumm/EasyAPI/commit/6ae1912d094d5f127890791d3b0544e5cc8b572d))

### 🎫 Chores | 其他更新

* **heroui:** 同步 HeroUI 依赖补丁并补充 AGENTS.md ([05c7c98](https://github.com/baiwumm/EasyAPI/commit/05c7c980b0e8e198864b4d9eb8d2724f90cd5c59))

### ♻ Code Refactoring | 代码重构

* 将自实现 useRequest 迁移到 SWR ([0e24c61](https://github.com/baiwumm/EasyAPI/commit/0e24c61c13eaf208b37372439ba5e7ddf84e1503))

## [2.8.0](https://github.com/baiwumm/EasyAPI/compare/v2.7.5...v2.8.0) (2026-08-12)

### ✨ Features | 新功能

* **branding:** 登录页隐藏注册入口并统一站点 Logo 为 logo.png ([5fb693a](https://github.com/baiwumm/EasyAPI/commit/5fb693a70e247b6a628e53c9f10f22b0cc151a80))
* **branding:** 更新站点图标，统一应用名为 EasyApi 并同步 better-nav 字体与 OG 图 ([3f4d26b](https://github.com/baiwumm/EasyAPI/commit/3f4d26bd25f8e7cf1d6be26b77ff6d1f66e0d9ef))
* **home:** 首页对齐 better-nav，改用服务端取数并新增锚点指示器 ([a27ac64](https://github.com/baiwumm/EasyAPI/commit/a27ac64545f088b48a685a7a6f067fad6da1b99a))
* **security:** 后台增加管理员邮箱白名单鉴权与数据库 RLS 兜底 ([3ecfd65](https://github.com/baiwumm/EasyAPI/commit/3ecfd65979b8662d29b71751e56319e0e784bdd4))
* **transition:** 路由转场改为方向感知滑动，与 better-nav 一致 ([bce2aa9](https://github.com/baiwumm/EasyAPI/commit/bce2aa99299d2f6652968d16b217797db6f55510))

### 🐛 Bug Fixes | Bug 修复

* **admin:** 移除 Tabs.Panel 的 shouldForceMount 导致两个面板同时显示 ([da8ad2e](https://github.com/baiwumm/EasyAPI/commit/da8ad2edfd9374d88dbd557ca65d443a36f0ef22))
* **admin:** 优化 CRUD 逻辑，修复搜索页码、假排序与表单 id 问题 ([426313b](https://github.com/baiwumm/EasyAPI/commit/426313bab6ef05ca2b443da0f58e557fb756ec17))
* **loading:** 恢复 hydration 前全屏加载遮罩，隐藏水合等待期 ([6417532](https://github.com/baiwumm/EasyAPI/commit/6417532eb08d699971c96eddc7b2f7e31b126359))

### 🎫 Chores | 其他更新

* **branding:** 更新站点 logo 并移除 favicon.png，忽略 .impeccable 审查产物 ([bdd5b17](https://github.com/baiwumm/EasyAPI/commit/bdd5b175046f8ad91d68823438b607d966c6355a))
* **config:** 添加 HeroUI MCP server 配置 ([084f6f4](https://github.com/baiwumm/EasyAPI/commit/084f6f4186daf8473ac9df6531adab82aa9c8ccf))
* **deps:** 升级 HeroUI 3.2.4、Next.js 16.3.0 及协同依赖 ([141360c](https://github.com/baiwumm/EasyAPI/commit/141360c063dab34fa2e63c1afd282865353f3461))
* **eslint:** 迁移 @antfu/eslint-config 并修复全部 lint 问题 ([e25dfdc](https://github.com/baiwumm/EasyAPI/commit/e25dfdcd8359187e747bd46b333804ca42e08551))
* **eslint:** 升级 eslint 至 v10 并同步 @antfu/eslint-config ([caea527](https://github.com/baiwumm/EasyAPI/commit/caea52721156e2b78d9579059092aa4f5251feb9))

### 📝 Documentation | 文档

* **readme:** 对齐 better-nav 风格重写 README，同步更新演示截图 ([8fafb41](https://github.com/baiwumm/EasyAPI/commit/8fafb410a3f6b25dc9761420f7a84c98bff7c903))

### ♻ Code Refactoring | 代码重构

* **back-top:** 优化回到顶部动画与交互 ([193d429](https://github.com/baiwumm/EasyAPI/commit/193d4297a2c891dcb3a57dfb17a013e60e7f417d))
* **dependencies:** 移除 ahooks 和 axios 依赖 ([8297e89](https://github.com/baiwumm/EasyAPI/commit/8297e899420c1965a9d4c8b10134a97983212df1))
* **hooks:** 进度条改用 useProgress，与 better-nav 一致 ([e384e12](https://github.com/baiwumm/EasyAPI/commit/e384e12c8b45d13ae9283360c4e18538bd88aef7))
* **layout:** 移除 useAvailableHeight，改用 flex 布局，与 better-nav 一致 ([911e8be](https://github.com/baiwumm/EasyAPI/commit/911e8be4478a073b76b4f6d03ccdab6d1b31cae0))
* **perf:** 性能与安全最佳实践优化 ([1758900](https://github.com/baiwumm/EasyAPI/commit/1758900cee96ece172f047ac388364005936de3a))
* **theme-switcher:** 主题切换改用模糊圆扩散动画，与 better-nav 一致 ([378ad8d](https://github.com/baiwumm/EasyAPI/commit/378ad8d79c1667f6e87e751e299f0a31ab9d0428))
* **typography:** 文本元素平替为 HeroUI Typography 并修复居中 ([670d886](https://github.com/baiwumm/EasyAPI/commit/670d886b7ef9d4ddef203317426f264ac80053af))

## [2.7.5](https://github.com/baiwumm/EasyAPI/compare/v2.7.4...v2.7.5) (2026-07-22)

### ⚡ Performance Improvements | 性能优化

* **layout:** 优化布局结构 ([b6d103d](https://github.com/baiwumm/EasyAPI/commit/b6d103da17a56dd2ce84b48e237c5bd85cc9f1f7))

## [2.7.4](https://github.com/baiwumm/EasyAPI/compare/v2.7.3...v2.7.4) (2026-07-21)

### 🐛 Bug Fixes | Bug 修复

* **CopyText:** 修复复制成功提示重复的问题 ([057a933](https://github.com/baiwumm/EasyAPI/commit/057a93356e353cfa8c5077d3953969bcc23d0f9c))

## [2.7.3](https://github.com/baiwumm/EasyAPI/compare/v2.7.2...v2.7.3) (2026-07-15)

### 💄 Styles | 风格

* 优化加载和错误界面 UI ([196b9e9](https://github.com/baiwumm/EasyAPI/commit/196b9e91485fb51f7c40d5f4f3a0deca05acc752))

## [2.7.2](https://github.com/baiwumm/EasyAPI/compare/v2.7.1...v2.7.2) (2026-07-07)

### 💄 Styles | 风格

* UI 调整 ([b0861de](https://github.com/baiwumm/EasyAPI/commit/b0861dead85f86a8d979f3b132c31abf1e9c864e))

## [2.7.1](https://github.com/baiwumm/EasyAPI/compare/v2.7.0...v2.7.1) (2026-07-07)

### ✨ Features | 新功能

* 更改图标 ([a5ff0ff](https://github.com/baiwumm/EasyAPI/commit/a5ff0ff929e6c44410290106a80833fffb2d4167))

## [2.7.0](https://github.com/baiwumm/EasyAPI/compare/v2.6.2...v2.7.0) (2026-07-07)

### ✨ Features | 新功能

* 更新 demo 截图，添加 .env.example 文件 ([0b19310](https://github.com/baiwumm/EasyAPI/commit/0b193105cec61ab447609b445cafe5774d24e8ba))

### 💄 Styles | 风格

* **ApiCard:** 更新卡片样式 ([e1bc7ba](https://github.com/baiwumm/EasyAPI/commit/e1bc7ba3fda02d3ee83cb1728c330007935366fb))

### ⚡ Performance Improvements | 性能优化

* 使用 motion.create 代替 motion() ([3621005](https://github.com/baiwumm/EasyAPI/commit/362100506abaef7eebbd79e1bc669a75933aa51b))
* 移除 @bprogress/core 包 ([136823a](https://github.com/baiwumm/EasyAPI/commit/136823ac702ede0c876a3503b683dd0596932bec))
* 移除 query-string 包 ([5c555b5](https://github.com/baiwumm/EasyAPI/commit/5c555b581cc66eb218c5fca6c457a271fe5c23ed))
* 重构页面排版 ([3c3714a](https://github.com/baiwumm/EasyAPI/commit/3c3714a5a3eeac79e97ad0f69f9c5e8e8b354301))

### 👷‍ Build System | 构建

* 修复 bing-wallpaper 页面导致打包报错的问题 ([20c4eb2](https://github.com/baiwumm/EasyAPI/commit/20c4eb2ada49d4cd1904d3a3eeb010faaf957de2))

## [2.6.2](https://github.com/baiwumm/EasyAPI/compare/v2.6.1...v2.6.2) (2026-07-02)

### ✨ Features | 新功能

* 删除 umami 统计代码 ([62d1cb3](https://github.com/baiwumm/EasyAPI/commit/62d1cb3ca32286465a514c2bc6fc212dffbcd120))
* 替换 demo 图 ([33adaa2](https://github.com/baiwumm/EasyAPI/commit/33adaa25d48f6e83e76d5e8ff9c3f612b75d6b78))
* 修改背景动画属性 ([dfd93f8](https://github.com/baiwumm/EasyAPI/commit/dfd93f8105f8b1566e764fb65bfb0b1e8fe33809))

### 💄 Styles | 风格

* 优化 UI 样式 ([cbed35e](https://github.com/baiwumm/EasyAPI/commit/cbed35e862bd0c912c722dcc642f3f5eb5402530))
* **components:** 更新 Status 组件 variant 样式 ([199e1da](https://github.com/baiwumm/EasyAPI/commit/199e1da153e34a46f2d8c86fb3796d77b20dacc9))

### 🔧 Continuous Integration | CI 配置

* 更新 Hero UI 版本 ([ee37cf2](https://github.com/baiwumm/EasyAPI/commit/ee37cf22c75f3008f4416ffb88664f223806c4b1))
* 更新 Hero UI 版本 ([bc84b91](https://github.com/baiwumm/EasyAPI/commit/bc84b919c31a6350b673d06294ecbe8454e2dd49))

## [2.6.1](https://github.com/baiwumm/EasyAPI/compare/v2.6.0...v2.6.1) (2026-03-16)

### ✨ Features | 新功能

* 更新 Hero UI 版本 ([4540f6e](https://github.com/baiwumm/EasyAPI/commit/4540f6e36606add95cdc14f25341743f604fc291))
* 新增 clamp 函数，优化代码逻辑 ([4abd40b](https://github.com/baiwumm/EasyAPI/commit/4abd40b4eda85bac9720704555c72719dead8a26))

### ⚡ Performance Improvements | 性能优化

* 删除 ProgressCircle 组件 ([c221142](https://github.com/baiwumm/EasyAPI/commit/c2211423b25b93eaf784a0a90a27d50816095e63))
* **BackTop:** 使用 Hero UI 的 ProgressCircle 组件，优化卡顿 ([e6e6986](https://github.com/baiwumm/EasyAPI/commit/e6e698623da09b5336dbaf72d3ebfe40eabae890))
* **TailwindColorPalette:** 新增《Tailwind 色板生成器》接口和页面 ([3f95d30](https://github.com/baiwumm/EasyAPI/commit/3f95d304a52cb09b9ef5041c69b501eaede980ab))

### 🔧 Continuous Integration | CI 配置

* 新增 uicolors-generator包 ([6a9f749](https://github.com/baiwumm/EasyAPI/commit/6a9f74901c70cfebe4566375d4fc3e2171e02810))

## [2.6.0](https://github.com/baiwumm/EasyAPI/compare/v2.5.2...v2.6.0) (2026-03-13)

### ✨ Features | 新功能

* **password-strength:** 优化接口信息中文展示 ([a465193](https://github.com/baiwumm/EasyAPI/commit/a46519362ad85cfaa52303fc3ccd71ea8e851c14))

### ⚡ Performance Improvements | 性能优化

* 统一组件代码格式 ([bdea0a9](https://github.com/baiwumm/EasyAPI/commit/bdea0a9330453250bbea0da8f6f355112d2f6f43))
* **PostalCode:** 优化接口和页面逻辑 ([c9652bf](https://github.com/baiwumm/EasyAPI/commit/c9652bf88e3638c92aba40c920259631a2436b5b))
* **Qrcode:** 优化接口和页面逻辑 ([8fe3b47](https://github.com/baiwumm/EasyAPI/commit/8fe3b47e2b88b33c6d9e4ef69922c02d55f122e9))
* **RandomAvatar:** 优化接口和页面展示 ([266d828](https://github.com/baiwumm/EasyAPI/commit/266d8286deca09978aeaa4bb64fc9fafd1e456b7))
* **RandomColor:** 优化接口和页面逻辑 ([9bd0855](https://github.com/baiwumm/EasyAPI/commit/9bd08553429d8283c709204d047e5fc1e516063b))
* **RandomImage:** 新增《随机图片》接口和页面 ([29cd461](https://github.com/baiwumm/EasyAPI/commit/29cd461abd8464f7c7e239452c7f35c87970ba73))
* **RandomPerson:** 新增《随机人物》接口和页面 ([c25b8e1](https://github.com/baiwumm/EasyAPI/commit/c25b8e1258f5aa82e0cc31d5caa44c10ec0f4a7f))
* **RandomString:** 优化接口和页面逻辑 ([7f41106](https://github.com/baiwumm/EasyAPI/commit/7f41106e9129329b0c11426a0768bf36108dae81))
* **RandomUser:** 优化接口和页面逻辑 ([35ca3ad](https://github.com/baiwumm/EasyAPI/commit/35ca3ad629c605e275b3e70d7a48ebf9f4cbe72c))

### 🔧 Continuous Integration | CI 配置

* 新增 @zxcvbn-ts/language-zh 包 ([9d98e31](https://github.com/baiwumm/EasyAPI/commit/9d98e312d57e54db544dd556d414a59d9b2656e8))

## [2.5.2](https://github.com/baiwumm/EasyAPI/compare/v2.5.1...v2.5.2) (2026-03-12)

### ✨ Features | 新功能

* 优化接口 catch 错误编码 ([dccc0e4](https://github.com/baiwumm/EasyAPI/commit/dccc0e440d2063ac2279de1562ef07d415f21bad))

### ⚡ Performance Improvements | 性能优化

* 统一处理 route 的 catch 错误 ([585a2ed](https://github.com/baiwumm/EasyAPI/commit/585a2edc8e4247300506b556b213da801abeca3d))
* **Barcode:** 新增《生成条形码》接口和页面 ([c5765a0](https://github.com/baiwumm/EasyAPI/commit/c5765a01016c983eac265ebff8ddb6c61be29931))
* **Barcode:** 优化 UI 显示和错误提示 ([aed3044](https://github.com/baiwumm/EasyAPI/commit/aed304452b322177110fcd20843f04b2474a9876))
* **RandomIdCard:** 新增《随机身份证号》接口和页面 ([9f32f04](https://github.com/baiwumm/EasyAPI/commit/9f32f0435bf132bb8abe1cd82155de67aed2faac))

### 🔧 Continuous Integration | CI 配置

* 新增 jsbarcode、xmldom、sharp包 ([1004172](https://github.com/baiwumm/EasyAPI/commit/1004172d9f205e77dbf0163e8e06bc4d5983c2e9))

## [2.5.1](https://github.com/baiwumm/EasyAPI/compare/v2.5.0...v2.5.1) (2026-03-11)

### 💄 Styles | 风格

* 细节调整 ([fba8f9a](https://github.com/baiwumm/EasyAPI/commit/fba8f9a992751ab5d37ecb344893d70b3b030010))

### ⚡ Performance Improvements | 性能优化

* 删除没用的代码 ([6bbb6f8](https://github.com/baiwumm/EasyAPI/commit/6bbb6f8ac8b38d0fd551b369b4f41543fd904c5a))

## [2.5.0](https://github.com/baiwumm/EasyAPI/compare/v2.4.2...v2.5.0) (2026-03-11)

### ✨ Features | 新功能

* **components:** 新增 RequestContent 组件，统一处理请求失败等 UI 展示 ([886ac57](https://github.com/baiwumm/EasyAPI/commit/886ac578411927e6780a8a3524adab3a935710ec))

### ⚡ Performance Improvements | 性能优化

* 删除 images 冗余的配置 ([c4251a4](https://github.com/baiwumm/EasyAPI/commit/c4251a4b13a3889f6115ba1f997a18a8da1f1565))
* 优化 JsonContent 组件 JSON 显示展示格式 ([d78168f](https://github.com/baiwumm/EasyAPI/commit/d78168fc04fbe91cb8b4b575c9eb8df960fd1518))
* **Almanac:** 优化代码逻辑 ([7dd396c](https://github.com/baiwumm/EasyAPI/commit/7dd396cf5092835af5cecf8c624813182bf8a22b))
* **Bmi:** 优化代码逻辑 ([5fcc85a](https://github.com/baiwumm/EasyAPI/commit/5fcc85a4e6f971b08643d0247f04d740af95b158))
* **ChinesePoetry:** 优化代码逻辑 ([66729e4](https://github.com/baiwumm/EasyAPI/commit/66729e48ad62f0ad8d8ee785c3c582563c936e66))
* **ColorConversion:** 优化代码逻辑 ([36746ba](https://github.com/baiwumm/EasyAPI/commit/36746bac2974b30b444c1d78dbd138874016b073))
* **CountryCode:** 优化代码逻辑 ([2ab2280](https://github.com/baiwumm/EasyAPI/commit/2ab22809f9d323ba53b9b7f88fec90e11c5e137f))
* **Hitokoto:** 优化代码逻辑 ([0444f08](https://github.com/baiwumm/EasyAPI/commit/0444f082a45cb09d468aaca7b1ed57826ecd1df5))
* **Holiday:** 优化代码逻辑 ([9782d5c](https://github.com/baiwumm/EasyAPI/commit/9782d5c45f65effef819499d14058e2d2ebee14f))
* **JsonContent:** 优化代码逻辑 ([1a42136](https://github.com/baiwumm/EasyAPI/commit/1a42136321b2c128899ec5056695770c98c2f31d))
* **LicensePlate:** 优化代码逻辑 ([fb1a789](https://github.com/baiwumm/EasyAPI/commit/fb1a7898451047185bdb43b633a2e9ed55e2727e))
* **PostalCode:** 优化代码逻辑 ([f5bd59b](https://github.com/baiwumm/EasyAPI/commit/f5bd59b4442c7a451e561218f3c01c320c080b70))
* **Qrcode:** 优化代码逻辑 ([385ca1e](https://github.com/baiwumm/EasyAPI/commit/385ca1e2f8c3eb9c2e29ee8dcec1dc7f491eb919))
* **QuoteWorld:** 优化代码逻辑 ([359803a](https://github.com/baiwumm/EasyAPI/commit/359803ac2a8e31c1b6812f768efdd34936c8213f))
* **RandomColor:** 优化代码逻辑 ([1b5125f](https://github.com/baiwumm/EasyAPI/commit/1b5125feaba7d38a93cf029748f718cc597c9235))
* **RandomEmoji:** 优化代码逻辑 ([ba221fe](https://github.com/baiwumm/EasyAPI/commit/ba221fe55b1a48ab5e913f0f6bdd89030a123c76))
* **RandomString:** 优化代码逻辑 ([69105a3](https://github.com/baiwumm/EasyAPI/commit/69105a3f2606cea5a3fb5fd271627be0f01a20b8))
* **RandomUser:** 优化代码逻辑 ([dccfac6](https://github.com/baiwumm/EasyAPI/commit/dccfac66ea3921ac92db1d890e216c965de41c49))
* **Riddle:** 优化代码逻辑 ([1b9a2ed](https://github.com/baiwumm/EasyAPI/commit/1b9a2ed788e41c64d09542c134dd0b4450ee67b2))
* **SolarTerm:** 优化代码逻辑 ([49c9be0](https://github.com/baiwumm/EasyAPI/commit/49c9be07e60887c20ad61960bf7d25e1a0051acc))

## [2.4.2](https://github.com/baiwumm/EasyAPI/compare/v2.4.1...v2.4.2) (2026-03-09)

### ✨ Features | 新功能

* **components:** 新增 RefreshButton 组件 ([5b12085](https://github.com/baiwumm/EasyAPI/commit/5b12085c9a52d01d2a5d7b1dda51b75fe563018c))

### ⚡ Performance Improvements | 性能优化

* 统一项目 Loading 状态 ([3d23bb6](https://github.com/baiwumm/EasyAPI/commit/3d23bb65aa7a6a94b0f1e1af7d19866c3ff8aa06))

## [2.4.1](https://github.com/baiwumm/EasyAPI/compare/v2.4.0...v2.4.1) (2026-03-09)

### ✨ Features | 新功能

* **ApiCard:** 新增 “NEW” 标签显示 ([cb9ae89](https://github.com/baiwumm/EasyAPI/commit/cb9ae892809ba62476e60c038bbf6c2d9b754db2))
* **hooks:** 新增 useCopy，统一处理 copy 逻辑 ([043a355](https://github.com/baiwumm/EasyAPI/commit/043a35587683f76a52bc523d7850afbc9b43dd6a))
* **proxy:** 完善中间件逻辑 ([d1bd454](https://github.com/baiwumm/EasyAPI/commit/d1bd454f14f5624b1d7c7531891cc3c6a8a73213))
* **RandomAvatar:** 新增《随机头像》接口和页面 ([1ada729](https://github.com/baiwumm/EasyAPI/commit/1ada729e0e40a7980259e39799983b936312dd1c))
* **RandomEmoji:** 新增《随机表情》接口和页面 ([6f6c3bf](https://github.com/baiwumm/EasyAPI/commit/6f6c3bf00a042ba7e56d210c55ecafc13e427070))
* **RandomUser:** 新增《随机用户》接口和页面 ([045a951](https://github.com/baiwumm/EasyAPI/commit/045a951e23af69d0cf7d72fc3306e0ecaf2a04b0))

### ⚡ Performance Improvements | 性能优化

* 细节调整 ([d0cf40e](https://github.com/baiwumm/EasyAPI/commit/d0cf40e363752435b01bcfcaa97ea5c4853a2138))

### 🔧 Continuous Integration | CI 配置

* 新增 @dicebear/collection、@dicebear/core 包 ([982cf8e](https://github.com/baiwumm/EasyAPI/commit/982cf8ee56a12b60bc005fc99fe99ee3d53558ac))
* 新增 @faker-js/faker 包 ([e5e1941](https://github.com/baiwumm/EasyAPI/commit/e5e1941b3577f98ec4e46405734170d57f93cc31))
* 新增 node-emoji 包 ([959ba61](https://github.com/baiwumm/EasyAPI/commit/959ba61779af2fd4014844dbc1c37d50341df8ce))

## [2.4.0](https://github.com/baiwumm/EasyAPI/compare/v2.3.0...v2.4.0) (2026-03-06)

### ✨ Features | 新功能

* 更新 demo 图 ([29166d4](https://github.com/baiwumm/EasyAPI/commit/29166d42d62800ec7ce6e332bbad5583a40b829d))

### ⚡ Performance Improvements | 性能优化

* 删除 store 相关的文件 ([cd98d64](https://github.com/baiwumm/EasyAPI/commit/cd98d64fbb2901971bfda990c896b9bc5113c099))

### 🔧 Continuous Integration | CI 配置

* 删除 zustand 库 ([8c9ec86](https://github.com/baiwumm/EasyAPI/commit/8c9ec868be23953f0fc6c126e798c2b8bc22358a))

## [2.3.0](https://github.com/baiwumm/EasyAPI/compare/v2.2.1...v2.3.0) (2026-03-05)

### ✨ Features | 新功能

* update README.md ([ef28988](https://github.com/baiwumm/EasyAPI/commit/ef28988eed2c2918f66565df626cb709297c901d))

### 💄 Styles | 风格

* UI 细节优化 ([a25519a](https://github.com/baiwumm/EasyAPI/commit/a25519a1c5c72a8b23df49a4c52447c1327d03ec))

### ⚡ Performance Improvements | 性能优化

* 删除没用的文件 ([146e56d](https://github.com/baiwumm/EasyAPI/commit/146e56d7f7179340dbd0cbec666b130d0be2f89c))
* **Apis:** 更换 Table 和 Pagination 组件，优化页面 UI 显示 ([7629478](https://github.com/baiwumm/EasyAPI/commit/7629478b18611fc2f96b2921741b6fbac206973f))
* **Categorys:** 更换 Table 和 Pagination 组件，优化页面 UI 显示 ([c546426](https://github.com/baiwumm/EasyAPI/commit/c5464263c80881b8729d4a83df32df5ed20e41ce))

## [2.2.1](https://github.com/baiwumm/EasyAPI/compare/v2.2.0...v2.2.1) (2026-03-05)

### ✨ Features | 新功能

* 更新 HeroUI 版本到 3.0.0-beta.8 ([09e40e4](https://github.com/baiwumm/EasyAPI/commit/09e40e4958502e13552f0dfb6175658ac1925072))
* 新增 @internationalized/date 包 ([2cb759a](https://github.com/baiwumm/EasyAPI/commit/2cb759a5fd95a50faadaabb00c1698a2932085b2))
* 新增 idcard 包 ([6f9a4af](https://github.com/baiwumm/EasyAPI/commit/6f9a4af8082fc37a796057f4f8a16d654b4153c2))
* 新增 lunar-typescript 包 ([bbfce35](https://github.com/baiwumm/EasyAPI/commit/bbfce352924753fbfcac021e8f2f46d50d5ad5af))
* **Almanac:** 新增《十二时辰黄历》接口和页面 ([515622c](https://github.com/baiwumm/EasyAPI/commit/515622c1cd49320cf45de52bf927f5078b203266))
* **BMI:** 新增《BMI 计算器》接口和页面 ([ac04cd6](https://github.com/baiwumm/EasyAPI/commit/ac04cd604c7944c6fba198bcb5d9236e684f3876))
* **components:** 新增 《JsonContent》组件 ([5ec3470](https://github.com/baiwumm/EasyAPI/commit/5ec3470ead0e9a0c35de5b44ae6b49177f82fd66))
* **CountryCode:** 新增《国际区号查询》接口和页面 ([7a6acf3](https://github.com/baiwumm/EasyAPI/commit/7a6acf376078b3d8b01be7c9660087f86339ee94))
* **Holiday:** 新增《法定节假日》接口和页面 ([c108c6b](https://github.com/baiwumm/EasyAPI/commit/c108c6b640da4191ee8985cb237edc91d73ea29d))
* **Idcard:** 新增《身份证信息查询》页面 ([12340a7](https://github.com/baiwumm/EasyAPI/commit/12340a7e7457cfdcb80bb791ef51dc6c414598f8))
* **IpRegion:** 新增《IP 归属地查询》页面 ([e7ea794](https://github.com/baiwumm/EasyAPI/commit/e7ea794b543a92adf887f9c762ccece3c6d313de))
* **PostalCode:** 新增《邮政编码查询》页面 ([0ec8262](https://github.com/baiwumm/EasyAPI/commit/0ec826207204fb1eae16aadddd496e3d5d7f5aa4))
* **SolarTerm:** 新增《二十四节气》接口和页面 ([25dece8](https://github.com/baiwumm/EasyAPI/commit/25dece8f9689af6711aadb127684980b6c7b49f1))

### 💄 Styles | 风格

* **LicensePlate:** 使用 Table 形式展示数据 ([81ca8e2](https://github.com/baiwumm/EasyAPI/commit/81ca8e27ce6556ad3f0a9ade4bd3c47907dea9bf))

### ⚡ Performance Improvements | 性能优化

* **RandomString:** 优化组件逻辑 ([748a47b](https://github.com/baiwumm/EasyAPI/commit/748a47b5d96e9617a46227d98a7d75d553cb793f))

## [2.2.0](https://github.com/baiwumm/EasyAPI/compare/v2.1.0...v2.2.0) (2026-03-03)

### ✨ Features | 新功能

* 新增 qrcode 包 ([aaa97ed](https://github.com/baiwumm/EasyAPI/commit/aaa97ed1b92a6fcd76520ee5f3ac92b24e56a59d))
* 新增 tinycolor2 包 ([460ac27](https://github.com/baiwumm/EasyAPI/commit/460ac27c81f27d2441944551cf273840a0b0d53a))
* **BingWallpaper:** 新增《bind 每日壁纸》页面 ([6c129c3](https://github.com/baiwumm/EasyAPI/commit/6c129c328e56aa726429f3ce26363277b2ee87fa))
* **ChickenSoup:** 新增《毒鸡汤》页面 ([552ba28](https://github.com/baiwumm/EasyAPI/commit/552ba28377f2243047e913f4ae83dd13a5191325))
* **ChinesePoetry:** 新增《中文诗词》页面 ([3d6d63e](https://github.com/baiwumm/EasyAPI/commit/3d6d63e597176214d7ba4df984046bff815e1c5c))
* **ColdFact:** 新增《每日冷知识》页面 ([373a6d1](https://github.com/baiwumm/EasyAPI/commit/373a6d16d00761735694b2f648a2baaf6f985486))
* **ColorConversion:** 新增 《颜色转换》接口和页面 ([c3720af](https://github.com/baiwumm/EasyAPI/commit/c3720af5ca3abfa4d84bd6671a7ca583b8ede6d9))
* **DiaryPoetry:** 新增《今日诗词》页面 ([21887db](https://github.com/baiwumm/EasyAPI/commit/21887dbdc3aae4aafb9be7005ffef7bdb377ca9a))
* **DogDiary:** 新增《舔狗日记》页面 ([9208166](https://github.com/baiwumm/EasyAPI/commit/92081665cf7e1c1cea79a87e62dc6826c7d04057))
* **Kfc:** 新增《疯狂星期四》页面 ([e1f7800](https://github.com/baiwumm/EasyAPI/commit/e1f78005904cdf15ec35e4707bea0e5153cc0ab7))
* **LoveWords:** 新增《土味情话》页面 ([4f8bd42](https://github.com/baiwumm/EasyAPI/commit/4f8bd42e956f6301b856a6e99737def38c97d132))
* **PasswordStrength:** 新增 《密码强度检测》接口和页面 ([9669197](https://github.com/baiwumm/EasyAPI/commit/96691973d5f047e2f1658447293a3671a806b8eb))
* **Qrcode:** 新增 《生成二维码》页面 ([52b0133](https://github.com/baiwumm/EasyAPI/commit/52b0133f1c24131141a65d7e5df832eff7d1a4a0))
* **RandomColor:** 新增《随机颜色》页面 ([ea05390](https://github.com/baiwumm/EasyAPI/commit/ea05390b62a323d60481ed8010b9baa8c38243ac))
* **RandomString:** 新增《随机字符串》页面 ([d54bcda](https://github.com/baiwumm/EasyAPI/commit/d54bcdac2d6c296f8bf80ce32d54111ce6d5a8c0))
* **Riddle:** 新增《歇后语》页面 ([e6e3c67](https://github.com/baiwumm/EasyAPI/commit/e6e3c67252956419a852576ff506d44636072b1a))
* **Swearing:** 新增《骂人宝典（祖安语录）》页面 ([04cc2da](https://github.com/baiwumm/EasyAPI/commit/04cc2da1507a637272353613882a71932f095b72))
* **TongueTwister:** 新增《每日绕口令》页面 ([dbf1ea1](https://github.com/baiwumm/EasyAPI/commit/dbf1ea106151806600469d2545d1c2ec790f1368))
* **TongueTwister:** 新增《每日笑话》页面 ([ddcfda6](https://github.com/baiwumm/EasyAPI/commit/ddcfda63a43a415361ad322a0e35b5526ecbe0a0))

### ⚡ Performance Improvements | 性能优化

* 细节调整 ([b3331d1](https://github.com/baiwumm/EasyAPI/commit/b3331d18bd53c0961dbf94371d6099078eaea1d2))
* **RandomColor:** 优化页面逻辑 ([a1cf480](https://github.com/baiwumm/EasyAPI/commit/a1cf480b80a703b67db0b3d212eb740d9151bf34))

## [2.1.0](https://github.com/baiwumm/EasyAPI/compare/v2.0.0...v2.1.0) (2026-02-27)

### ✨ Features | 新功能

* 新增 gsap 包 ([d7978cf](https://github.com/baiwumm/EasyAPI/commit/d7978cff8bf9e736c945f111dbbe940ac1a60b0d))
* 新增 TypingAnimation 组件 ([0b38b91](https://github.com/baiwumm/EasyAPI/commit/0b38b9178508ce38886a8722d4c0d4ad19b0d68b))
* 新增《每日一言》接口 ([7a699c0](https://github.com/baiwumm/EasyAPI/commit/7a699c0e1762254643d90ce6931ef49055032703))
* 新增复制按钮组件 ([da10c5f](https://github.com/baiwumm/EasyAPI/commit/da10c5fe80323ff344066eceb12d043820ab4fc8))
* 优化 SEO 标题显示 ([b770ea2](https://github.com/baiwumm/EasyAPI/commit/b770ea2c3a77b6802e130998c6bd3e929697ff2d))
* 中间件新增接口 "increment_call_count" 调用 ([2a629bb](https://github.com/baiwumm/EasyAPI/commit/2a629bb665dbcb3a45edb31377a5cfca8d14fc90))
* **Hitokoto:** 新增《每日一言》页面 ([cee2256](https://github.com/baiwumm/EasyAPI/commit/cee2256cd311af261d3aafbef871826da0b11199))

### ⚡ Performance Improvements | 性能优化

* 细节优化 ([7c44ff3](https://github.com/baiwumm/EasyAPI/commit/7c44ff31d9c12237405c7364d5c9bba3db91cf13))

## [2.0.0](https://github.com/baiwumm/EasyAPI/compare/v1.6.0...v2.0.0) (2026-02-25)

### ✨ Features | 新功能

* 更新底部信息 ([dd937fa](https://github.com/baiwumm/EasyAPI/commit/dd937fa783b03abbc5638131b194fa241d1af7b3))
* 添加 googletagmanager 代码 ([9b5ec4c](https://github.com/baiwumm/EasyAPI/commit/9b5ec4c82a58f2385489b55f2a39b71dcec5b7e3))
* 新增 Vercel 统计 ([56c1e11](https://github.com/baiwumm/EasyAPI/commit/56c1e11554bcf4c7787cad3abc3f3d2558eae7f4))
* 修改 umami 统计代码 ([70094df](https://github.com/baiwumm/EasyAPI/commit/70094df2c13e11e75a709671108c203858d94e4c))
