import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    // 默认 node 环境覆盖纯函数与 route handler；
    // 渲染组件的测试按文件加 // @vitest-environment jsdom
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    // 排除 App Router 的 __tests__（colocated 测试另行约定）
    exclude: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
  },
  resolve: {
    // 与 tsconfig.json 的 paths 保持一致，测试里可直接 import "@/lib/utils"
    alias: {
      "@": r("./src"),
      "#": r("./"),
    },
  },
});
