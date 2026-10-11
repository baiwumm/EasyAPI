# 代码规范与质量门禁

提交前必须全绿，四道门禁任一不过不要提交：

```bash
pnpm lint          # ESLint，且以 --max-warnings 0 为准（有 warning 也算不过）
pnpm typecheck     # tsc --noEmit，覆盖 src/ 与 tests/
pnpm test          # vitest run
pnpm build         # 真实生产构建
```

> `pnpm lint`（即 `eslint`）默认只把 error 当失败，warning 放行。
> 本项目按 0 warning 执行，用 `pnpm exec eslint src --max-warnings 0` 复核。

## Lint 规则

ESLint + Prettier。必须遵守的规则：

| 规则 | 要求 |
|---|---|
| `unused-imports/no-unused-imports` | 移除未使用的导入 |
| `import/order` | type > builtin > object > external > internal > parent > sibling > index，组间空行 |
| `react/jsx-sort-props` | callbacksLast > shorthandFirst > reservedFirst，属性按字典序 |
| `react/self-closing-comp` | `<Component />` 而非 `<Component></Component>` |
| `padding-line-between-statements` | `return` 前必须空一行；声明语句之间必须空行 |
| `no-console` | 禁止 `console`（warn 级别）。确需服务端留痕时用 `// eslint-disable-next-line no-console` 定向豁免并注明原因 |

## TypeScript 规范

- 所有组件和工具函数必须使用 TypeScript。
- 未使用的变量以 `_` 前缀命名（如 `_unused`）。
- 优先使用 `AppTableFeatures`、`AppColumnDef`（`src/typings/table-types.ts`）等统一类型。
- 全局类型集中放 `src/typings/index.ts`；页面内部类型就近声明。

## 测试规范

- 框架 **vitest 5.x**，配置见 `vitest.config.ts`：
  - `environment: "node"`（当前只覆盖纯函数与 route handler，不渲染组件）
  - `include: ["tests/**/*.test.ts"]`
  - 已按 `tsconfig.json` 配好 `@/` 与 `#/` 别名，测试里直接 `import "@/lib/utils"`
- 目录 **`tests/` 镜像 `src/`**：`src/lib/utils.ts` → `tests/lib/utils.test.ts`。
- `tests/` 已被 eslint 的 `globalIgnores` 覆盖，测试代码不参与 lint，
  但**必须通过 `tsc` 类型检查**（tsconfig 的 `include` 覆盖 `**/*.ts`）。
- 写测试的硬要求：
  - 修 bug 时必须配一条**能复现该 bug 的失败用例**，而不是只测正常路径。
  - 安全类修复要断言「不泄露」+「仍留痕」：响应体不含内部信息，且 `console.error`
    确实收到了原文。
  - 拦截类修复要断言**下游完全没被调用**（如 `expect(supabase.from).not.toHaveBeenCalled()`），
    证明拦截发生在上游，而不是查完再过滤。
- 测试按主题分文件、分提交，便于回溯与单独回退。

### 当前覆盖与缺口

已覆盖：`lib/utils`、`lib/server/{api-helpers,bing-wallpaper,rate-limit,avatar-cache,write-guard}`、
14 个路由（含 barcode / password-strength / ip-region / random-avatar / 管理端写路由 / 分页钳制），
共 214 条。

未覆盖（见 `backlog.md` 的 T1/T2/T3）：

- admin 两个 save-modal 表单（需 jsdom + 用户事件模拟）
- D2 的 SWR key 行为（改参数不请求、点提交才请求）

**客户端模块暂不补单测**：`src/lib/request.ts`、`src/hooks/*` 依赖浏览器环境
（`window`、blob、SWR 缓存），当前 vitest 是纯 node 环境，且 `import` 它们会连带
拉进 `@heroui/react`（transform 就要十几秒），性价比太低。等 T1 引入 jsdom 环境后
再按 `tests/lib/request.test.ts`、`tests/hooks/use-image-generation.test.ts` 补。

## Git 提交规范

Conventional Commits：

```
feat: 新功能
fix: 修复
docs: 文档更新
style: 代码格式（不影响逻辑）
refactor: 重构
test: 测试
chore: 构建/工具变动
```

- scope 可选，用目录或模块名（`fix(api):`、`refactor(web):`、`test(route):`）。
- 正文说明「改了什么、为什么」，不要只写「修复若干问题」。
- 混了多类改动时按主题拆成多个提交，一次提交只做一件事。
- ⚠️ PowerShell 没有 heredoc：写多行提交信息请用
  `git commit -F <文件>`，把消息写进一个文件再引用，别用 `git commit -m "多行\n内容"`。
