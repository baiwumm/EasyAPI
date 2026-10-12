import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "@/app/api/random-image/route";

const req = (query: string) => new NextRequest(`http://x/api/random-image${query}`);

/** 解包 data URI，拿到 SVG 文本 */
const decode = (dataUri: string): string =>
  Buffer.from(dataUri.replace(/^data:image\/svg\+xml;base64,/, ""), "base64").toString(
    "utf8",
  );

/** 响应体统一走 responseMessage：data 数组 + code */
async function requestData(query = "") {
  const res = await GET(req(query));
  const body = await res.json();

  return body.data as string[];
}

describe("GET /api/random-image", () => {
  it("默认返回 5 张图，全部是 svg data URI 且解码为合法 SVG", async () => {
    const images = await requestData();

    expect(images).toHaveLength(5);

    for (const image of images) {
      expect(image).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(decode(image)).toContain("<svg");
    }
  });

  it("count 控制数量并夹在 1~20", async () => {
    expect(await requestData("?count=3")).toHaveLength(3);
    expect(await requestData("?count=50")).toHaveLength(20);
    expect(await requestData("?count=0")).toHaveLength(1);
  });

  it("width/height 反映到 SVG 属性并夹在 16~1024", async () => {
    const [custom] = await requestData("?count=1&width=320&height=240");
    expect(decode(custom)).toContain('width="320"');
    expect(decode(custom)).toContain('height="240"');

    const [clamped] = await requestData("?count=1&width=5000&height=0");
    expect(decode(clamped)).toContain('width="1024"');
    expect(decode(clamped)).toContain('height="16"');
  });

  it("非数字参数回落默认值 128", async () => {
    const [image] = await requestData("?count=1&width=abc&height=NaN");
    const svg = decode(image);

    expect(svg).toContain('width="128"');
    expect(svg).toContain('height="128"');
  });

  it("同一次响应内各图互不相同，两次请求之间也不同（每次重新随机）", async () => {
    const images = await requestData("?count=5");
    expect(new Set(images).size).toBe(5);

    const again = await requestData("?count=5");
    expect(again).not.toEqual(images);
  });
});
