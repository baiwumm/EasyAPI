import { describe, expect, it } from "vitest";

import { createPageMetadata } from "@/lib/seo";

describe("createPageMetadata", () => {
  const options = {
    title: "BMI 计算器",
    description: "在线计算 BMI 指数并给出体重状态。",
    path: "/bmi",
  };

  it("返回页面标题、独立描述与站内 canonical 路径", () => {
    const metadata = createPageMetadata(options);

    expect(metadata.title).toBe("BMI 计算器");
    expect(metadata.description).toBe(options.description);
    expect(metadata.alternates?.canonical).toBe("/bmi");
  });

  it("不同页面的 canonical 互不相同（自引用而非全站统一）", () => {
    const other = createPageMetadata({ ...options, path: "/qrcode" });

    expect(other.alternates?.canonical).toBe("/qrcode");
    expect(other.alternates?.canonical).not.toBe(options.path);
  });
});
