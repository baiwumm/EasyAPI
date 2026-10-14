#!/usr/bin/env bash
# 把 GitHub Release 标题统一为 v 前缀：`Release 2.9.0` → `Release v2.9.0`。
# 只处理版本类标题；promo-film 等非版本 Release 自动跳过。幂等，可重复执行。
#
# 用法：
#   DRY_RUN=1 bash scripts/normalize-release-titles.sh   # 预览（默认）
#   DRY_RUN=0 bash scripts/normalize-release-titles.sh   # 实际写入
#   REPO=owner/repo bash scripts/normalize-release-titles.sh  # 指定其他仓库
set -euo pipefail
REPO="${REPO:-baiwumm/EasyAPI}"
DRY_RUN="${DRY_RUN:-1}"

changed=0
skipped=0
while IFS=$'\t' read -r id tag title; do
  [ -n "$id" ] || continue
  new=""
  case "$title" in
    "Release v"*) skipped=$((skipped + 1)); continue ;;
    "Release "*) new="Release v${title#Release }" ;;
    *) skipped=$((skipped + 1)); continue ;; # 非版本标题（宣传片等）不动
  esac
  if [ "$DRY_RUN" = "1" ]; then
    echo "[dry] $tag: $title -> $new"
  else
    gh api --method PATCH "repos/$REPO/releases/$id" -f name="$new" -q '.name' >/dev/null
    echo "[ok]  $tag: $title -> $new"
  fi
  changed=$((changed + 1))
done < <(gh api "repos/$REPO/releases?per_page=100" -q '.[] | [.id, .tag_name, .name] | @tsv')

echo "changed=$changed skipped=$skipped"
