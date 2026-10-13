/**
 * 一次性迁移（2026-10-13）：把历史无 v 前缀的 semver tag 与对应 GitHub Release
 * 全部迁到 v 前缀，配合 .release-it.json 的 git.tagName: "v${version}"（此后发版
 * 的 tag 带 v）。CHANGELOG.md 里的 compare 链接同步改写。
 *
 * 单个 tag 的迁移顺序（顺序有讲究，不可调换）：
 *   1. 在同一 commit 上重建 annotated tag（注释 "Release x.y.z"，与 release-it 默认一致）
 *   2. 推送新 tag 到远端
 *   3. 把 GitHub Release 重指到新 tag（PATCH tag_name）
 *   4. 删除远端旧 tag，最后删本地
 *   —— 先建新再删旧，Release 任何时刻都不悬空。
 *
 * 用法：`node scripts/migrate-tags-v-prefix.mjs`（dry-run）/
 *       `node scripts/migrate-tags-v-prefix.mjs --execute`（真执行）
 * 可重复执行：已迁移过的 tag 自动跳过，中途失败可直接重跑。
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const EXECUTE = process.argv.includes("--execute");

const sh = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8" }).trim();

// 升序排列的待迁移 tag（纯 semver、无 v 前缀）
const tags = sh("git", ["tag", "--list"])
  .split("\n")
  .filter((t) => /^\d+\.\d+\.\d+$/.test(t))
  .sort((a, b) => {
    const [x1, y1, z1] = a.split(".").map(Number);
    const [x2, y2, z2] = b.split(".").map(Number);
    return x1 - x2 || y1 - y2 || z1 - z2;
  });

if (tags.length === 0) {
  console.log("没有需要迁移的 tag（可能已全部迁移）");
  process.exit(0);
}

console.log(`待迁移 ${tags.length} 个 tag：${tags.join(", ")}`);
if (!EXECUTE) {
  console.log("\n（dry-run：未做任何改动，加 --execute 真执行）");
  process.exit(0);
}

for (const tag of tags) {
  const vTag = `v${tag}`;
  console.log(`\n== ${tag} -> ${vTag}`);

  // 1. 本地重建 annotated tag（指向同一 commit）
  if (sh("git", ["tag", "--list", vTag])) {
    console.log(`  本地 ${vTag} 已存在，跳过创建`);
  } else {
    const commit = sh("git", ["rev-parse", `${tag}^{commit}`]);
    sh("git", ["tag", "-a", vTag, "-m", `Release ${tag}`, commit]);
    console.log(`  本地新建 ${vTag} -> ${commit.slice(0, 7)}`);
  }

  // 2. 推送新 tag
  sh("git", ["push", "origin", `refs/tags/${vTag}:refs/tags/${vTag}`]);
  console.log(`  已推送远端 ${vTag}`);

  // 3. GitHub Release 重指（历史版本可能没有 Release，容错跳过）
  try {
    const release = JSON.parse(sh("gh", ["release", "view", tag, "--json", "databaseId"]));
    sh("gh", [
      "api",
      `repos/{owner}/{repo}/releases/${release.databaseId}`,
      "-X",
      "PATCH",
      "-f",
      `tag_name=${vTag}`,
    ]);
    console.log(`  Release #${release.databaseId} 已重指到 ${vTag}`);
  } catch {
    console.warn(`  ! 没找到 tag ${tag} 对应的 GitHub Release，跳过重指`);
  }

  // 4. 删除旧 tag（先远端后本地；已删过的情况容错跳过）
  try {
    sh("git", ["push", "origin", `:refs/tags/${tag}`]);
    console.log(`  已删除远端 ${tag}`);
  } catch {
    console.warn(`  ! 远端 ${tag} 已不存在，跳过`);
  }
  sh("git", ["tag", "-d", tag]);
  console.log(`  已删除本地 ${tag}`);
}

// CHANGELOG.md 的 compare 链接改 v 前缀（compare/2.8.1...2.9.0 -> compare/v2.8.1...v2.9.0）
const changelog = new URL("../CHANGELOG.md", import.meta.url);
const content = readFileSync(changelog, "utf8");
const next = content.replace(
  /(compare\/)(\d+\.\d+\.\d+)(\.\.\.)(\d+\.\d+\.\d+)/g,
  "$1v$2$3v$4",
);
if (next !== content) {
  writeFileSync(changelog, next);
  console.log("\nCHANGELOG.md 的 compare 链接已改为 v 前缀（请随本次迁移提交）");
}
console.log("\n迁移完成");
