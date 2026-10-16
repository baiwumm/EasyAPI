# AI 工具链与文档查询

## HeroUI 用法查询（三种方式，按优先级）

1. **项目级 Skill** `heroui-react`，位于 `.agents/skills/heroui-react/`：

   ```bash
   node .agents/skills/heroui-react/scripts/list_components.mjs
   node .agents/skills/heroui-react/scripts/get_component_docs.mjs Button
   node .agents/skills/heroui-react/scripts/get_theme.mjs
   ```

2. **MCP** `heroui-react-mcp`（已在 reasonix.toml 配置），工具：
   `list_components` / `get_component_docs` / `get_component_source_styles` /
   `get_theme_variables` 等。

3. **直接拉官方文档**：
   - 组件：`https://heroui.com/docs/react/components/{component-name}.mdx`
   - 指南：`https://heroui.com/docs/react/getting-started/{topic}.mdx`

不确定某个组件怎么组合时先查 Skill，**不要凭 v2 记忆写代码**。

## 需要核验实现细节时

`node_modules/@heroui/react/dist/components/<name>/<name>.js` 是可直接读的
编译产物，行为存疑时先读它而不是猜。例如曾借它确认了两件文档没写的事：

- `Modal.Backdrop` 内部的 RAC `ModalOverlay` 在关闭时 `return null`，
  即整棵子树（含表单）会卸载——所以 uncontrolled `defaultValue` 表单
  每次打开都会重新初始化，不需要额外重置逻辑。
- RAC `Form` 默认 `validationBehavior="native"`，NumberField 的
  `minValue`/`maxValue` 会通过 `useNativeValidation` 接进浏览器约束校验，
  原生 submit 会被拦住——所以表单里不用再手写同类校验。

## Skill 清单

| Skill | 用途 |
|---|---|
| `heroui-react` | HeroUI v3 组件文档与源码查询 |
| `vercel-react-best-practices` | React/Next 性能与正确性规范，**所有代码产出的硬性依据** |

## 推荐使用的工具库

| 库 | 用途 | 说明 |
|----|------|------|
| HeroUI | UI 组件 | `.agents/skills/heroui-react` |
| SWR | 数据获取 | 项目内置，封装见 `src/hooks/use-swr.ts` |
| TanStack Table | 表格 | 类型见 `src/typings/table-types.ts` |
| Motion | 动画 | 已安装（`motion/react`） |
| vitest | 单元测试 | 见 `docs/code-standards.md` |

## 已知的坑

- `@heroui/react` 是巨型 barrel，`next.config.ts` 已配
  `optimizePackageImports: ['@heroui/react']` 按需映射，**不要单独安装子包**。
- `import { Button } from "@heroui/react"` 之外不要 `import "@heroui/button"` 之类的子路径。
- HeroUI 的 `render` 只接受函数，不接受元素：这个版本的 RAC 底层是
  `render ? (props) => render(props, values) : undefined`，写元素形式
  （`render={<Link href="/" />}`）运行时会抛 `render is not a function`。
  正确写法是 `render={(props) => <Link {...props} href="/" />}`；
  Next 的 Link 吃不下 Button 的 DOM props 时，至少把 `props.className` 传过去保住样式
  （见 `src/app/not-found.tsx`）。
