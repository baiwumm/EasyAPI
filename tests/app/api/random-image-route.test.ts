import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET } from "@/app/api/random-image/route";

const req = (query: string) => new NextRequest(`http://x/api/random-image${query}`);

/** 响应体统一走 responseMessage：data 数组 + code */
async function requestData(query = "") {
  const res = await GET(req(query));
  const body = await res.json();

  return body.data as string[];
}

/** picsum 真实照片地址：https://picsum.photos/seed/{5~10 位字母数字}/{宽}/{高} */
const picsumUrl = (width: number, height: number) =>
  new RegExp(`^https://picsum\\.photos/seed/[A-Za-z0-9]{5,10}/${width}/${height}$`);

describe("GET /api/random-image", () => {
  it("默认返回 5 张图，全部是 picsum 图片地址", async () => {
    const images = await requestData();

    expect(images).toHaveLength(5);

    for (const image of images) {
      expect(image).toMatch(picsumUrl(128, 128));
    }
  });

  it("count 控制数量并夹在 1~20", async () => {
    expect(await requestData("?count=3")).toHaveLength(3);
    expect(await requestData("?count=50")).toHaveLength(20);
    expect(await requestData("?count=0")).toHaveLength(1);
  });

  it("width/height 反映到 URL 尺寸并夹在 16~1024", async () => {
    const [custom] = await requestData("?count=1&width=320&height=240");
    expect(custom).toMatch(picsumUrl(320, 240));

    const [clamped] = await requestData("?count=1&width=5000&height=0");
    expect(clamped).toMatch(picsumUrl(1024, 16));
  });

  it("非数字参数回落默认值 128", async () => {
    const [image] = await requestData("?count=1&width=abc&height=NaN");
    expect(image).toMatch(picsumUrl(128, 128));
  });

  it("同一次响应内各图互不相同，两次请求之间也不同（每次重新随机）", async () => {
    const images = await requestData("?count=5");
    expect(new Set(images).size).toBe(5);

    const again = await requestData("?count=5");
    expect(again).not.toEqual(images);
  });
});
