# 文档索引

本目录存放 EasyAPI 的专题规范与维护记录。`AGENTS.md` 只保留**入口必读**
（项目概览、目录结构、硬性约束、命令），其余操作细则按主题拆到此处。

| 文档 | 内容 | 何时读 |
|---|---|---|
| [api-docs.md](./api-docs.md) | 接口文档维护规范（Scalar + 手工 OpenAPI 3.1） | 新增/修改任何 `/api/*` 路由前后 |
| [code-standards.md](./code-standards.md) | 代码规范与质量门禁（Lint / TypeScript / Git / 测试） | 写代码前、提交前 |
| [ai-tooling.md](./ai-tooling.md) | HeroUI 文档查询方式、Skill、MCP、推荐工具库 | 需要查 HeroUI 用法时 |
| [deployment.md](./deployment.md) | 部署流程与完整环境变量清单 | 首次部署、新增配置项时 |
| [upgrades.md](./upgrades.md) | 待评估的依赖 major 升级清单 | 升级依赖前 |
| [backlog.md](./backlog.md) | **剩余待优化项与待办事项** | 每次开工前，认领任务 |
| [audit-2026-10.md](./audit-2026-10.md) | 本次代码审计的完整问题清单与修复记录 | 想了解某处为什么这么改 |

## 维护约定

- 新增文档后在本表登记一行，并保证「何时读」是可执行的判断条件，不是泛泛而谈。
- 文档里的路径、文件名、命令必须与仓库实际状态一致。修改代码导致文档失效时，
  **同一轮改动里同步修文档**，不要留着过期描述误导后续协作者。
- `AGENTS.md` 保持简洁：只放不看就会踩坑的内容，可查的细则一律指向本目录。
