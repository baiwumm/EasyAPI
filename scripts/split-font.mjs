/**
 * Maple Mono CN 字体分包脚本（一次性离线工具，产物随仓库提交）
 *
 * 背景：public 下单个 1.7MB woff2 + 一个大范围 unicode-range，
 * 任何含中文的页面都会触发全量下载（backlog F8）。
 * 本脚本用 cn-font-split 把源字体切成几百个按 unicode-range 索引的小分片，
 * 浏览器只下载当前页面实际渲染到的字形分片，首屏字体负担从 1.7MB 降到几十 KB。
 *
 * 用法：pnpm split-font
 *
 * 输入：assets/fonts/maple-mono-cn-regular.woff2（源字体，OFL-1.1）
 * 输出：public/fonts/maple-mono-cn/            分片 woff2 + 预览文件（仅分片随仓库提交）
 *       src/app/maple-mono-cn.css              分片 @font-face 规则（url 重写为站点绝对路径）
 *
 * 再生成：替换源字体后重跑本脚本即可；globals.css 通过 @import 引用产物 CSS，
 * font-family 名保持 'Maple Mono CN' 不变，业务代码无感知。
 */
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fontSplit } from "cn-font-split";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inputFile = join(root, "assets/fonts/maple-mono-cn-regular.woff2");
const outDir = join(root, "public/fonts/maple-mono-cn");
const cssOutFile = join(root, "src/app/maple-mono-cn.css");

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

await fontSplit({
  input: inputFile,
  outDir,
  css: {
    // 与旧单文件版保持同名的 font-family，--font-sans 与业务代码零改动
    // （工具生成时会自带引号，这里不要再传引号）
    fontFamily: "Maple Mono CN",
    fontWeight: "400",
    fontStyle: "normal",
    fontDisplay: "swap",
    // 产物 CSS 由脚本重写 url 后另存，公共目录里不需要留
    fileName: "maple-mono-cn",
    compress: false,
  },
  previewImage: { task: false },
  testHtml: false,
  reporter: false,
  silent: true,
});

// 分片 CSS 里的 url 是相对路径（./xxx.woff2），重写成站点绝对路径后
// 存到 src/app/，让 Next 把它打进构建产物而不是留在 public 里多一次运行时请求
// css.fileName 生成的是无扩展名文件；index.proto / preview.svg 是工具的
// 预览与上报产物，本项目用不到，一并清掉
const rawCss = await readFile(join(outDir, "maple-mono-cn"), "utf8");
await writeFile(
  cssOutFile,
  `/* 由 scripts/split-font.mjs 生成，勿手改；源字体与再生成说明见脚本头部注释 */
${rawCss.replaceAll(/@font-face\{\}/g, "").replaceAll(
    /url\((['"]?)\.\/([^'")]+?)\1\)/g,
    "url($1/fonts/maple-mono-cn/$2$1)",
  )}`,
  "utf8",
);
await rm(join(outDir, "maple-mono-cn"));
await rm(join(outDir, "index.proto"));
await rm(join(outDir, "preview.svg"));

const files = await readdir(outDir);
let totalSize = 0;
for (const name of files) {
  totalSize += (await stat(join(outDir, name))).size;
}
console.log(
  `分片完成：${files.length} 个文件，共 ${(totalSize / 1024).toFixed(0)}KB -> public/fonts/maple-mono-cn/`,
);
console.log(`CSS 规则 -> src/app/maple-mono-cn.css`);
