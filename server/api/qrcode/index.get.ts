/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-19 10:40:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-19 11:00:30
 * @Description: 生成二维码
 */

import { formatFail } from "~/lib/constant";
import QRCode from "qrcode"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const text = query.text as string
    const format = (query.format as string) || "png" // png | svg | dataurl
    const size = parseInt(query.size as string) || 256
    if (!text || text.trim().length === 0) {
      return formatFail('参数 text 必填');
    }
    if (text.length > 2000) {
      return formatFail('参数 text 长度不能超过 2000 个字符');
    }
    const allowedFormats = ["png", "svg", "dataurl"]
    if (!allowedFormats.includes(format)) {
      return formatFail(`参数 format 必须是 ${allowedFormats.join(", ")}`);
    }
    if (isNaN(size) || size < 64 || size > 1000) {
      return formatFail('参数 size 必须在 64 ~ 1000 之间');
    }
    if (format === "svg") {
      const svg = await QRCode.toString(text, { type: "svg", width: size })
      setHeader(event, "Content-Type", "image/svg+xml")
      return svg
    } else if (format === "dataurl") {
      const dataUrl = await QRCode.toDataURL(text, { width: size })
      return { data: dataUrl }
    } else {
      const buffer = await QRCode.toBuffer(text, { width: size })
      setHeader(event, "Content-Type", "image/png")
      return buffer
    }
  } catch (error) {
    return formatFail((error as Error)?.message || "生成二维码失败");
  }
})