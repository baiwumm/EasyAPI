/**
 * 发版时同步 public/openapi.yaml 的 info.version —— 由 .release-it.json 的
 * after:bump hook 调用（此时 package.json 已写入新版本号），并把改动
 * git add 进 Release 提交。本地手动跑 `pnpm release` 与 CI 发版行为一致。
 *
 * 不从命令行参数取版本号：直接读 bump 后的 package.json，避免依赖
 * release-it 的模板插值行为；两处版本号永远以 package.json 为真源。
 */
import { readFileSync, writeFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const { version } = pkg;

if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error(`[sync-openapi-version] package.json 版本号非法：${version}`);
  process.exit(1);
}

const file = new URL("../public/openapi.yaml", import.meta.url);
const content = readFileSync(file, "utf8");

// 只替换 info: 块下的第一处 `  version: x.y.z`（两空格缩进，与 /api/* 路径的键不冲突）
const next = content.replace(/^(  version: )\d+\.\d+\.\d+.*$/m, `$1${version}`);

if (next === content) {
  console.error("[sync-openapi-version] 未在 openapi.yaml 找到可替换的 version 行，中止");
  process.exit(1);
}

writeFileSync(file, next);
console.log(`[sync-openapi-version] openapi.yaml version -> ${version}`);
