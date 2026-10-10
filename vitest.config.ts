import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    // 当前只覆盖纯函数与 route handler，不需要 DOM；
    // 真需要渲染组件时再按文件加 // @vitest-environment jsdom
    environment: "node",
    include: ["tests/**/*.test.ts"],
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
