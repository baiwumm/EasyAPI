import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js"; // ESLint v9 内置规则
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. 基础规则
  js.configs.recommended,
  // 2. Next.js 官方规则
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // 3. Import 插件配置
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // 核心验证规则
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/export": "error",

      // 代码风格规则
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-duplicates": "error",
      "import/no-absolute-path": "error",
      "import/no-cycle": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
];

export default eslintConfig;
