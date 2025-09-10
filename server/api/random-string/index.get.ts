/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-10 09:56:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-10 10:16:29
 * @Description: 随机字符串
 */
import { formatSuccess, formatFail } from "~/lib/constant";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    // 参数
    const type = (query.type as string) || "number" // number, lower, upper, 也可以逗号组合
    const length = Math.min(Math.max(parseInt(query.length as string) || 16, 1), 100) // 默认16，最大100
    const count = Math.min(Math.max(parseInt(query.count as string) || 1, 1), 50)   // 默认1，最大50

    // 字符集
    const charsetMap: Record<string, string> = {
      number: "0123456789",
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    }

    // 解析 type
    const types = type.split(",").map((t) => t.trim())
    let charset = ""
    types.forEach((t) => {
      if (charsetMap[t]) charset += charsetMap[t]
    })
    if (!charset) charset = charsetMap["number"] // 默认数字

    // 生成函数
    const generateString = () => {
      let str = ""
      for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * charset.length)
        str += charset[idx]
      }
      return str
    }

    // 批量生成
    const result = Array.from({ length: count }, generateString)

    return formatSuccess(result)
  } catch (error) {
    return formatFail((error as Error)?.message || '获取随机字符串失败')
  }
})