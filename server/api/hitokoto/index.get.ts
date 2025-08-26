/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-21 09:47:50
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-26 10:45:49
 * @Description: 每日一言
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // 获取 type, minLength, maxLength 参数
  const type = query.type ? (query.type as string).split(',') : []
  const minLength = query.minLength ? parseInt(query.minLength as string, 10) : 0
  const maxLength = query.maxLength ? parseInt(query.maxLength as string, 10) : 0
  const format = query.format

  const params = new URLSearchParams()

  // 类型：可以有多个，用逗号分隔
  if (type.length > 0) {
    type.forEach((t) => params.append('c', t))
  }

  // 长度限制
  if (minLength) params.set('min_length', String(minLength))
  if (maxLength) params.set('max_length', String(maxLength))

  // 默认返回 json 格式
  params.set('encode', format === 'text' ? 'text' : 'json')

  const url = `https://v1.hitokoto.cn/?${params.toString()}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return formatFail(`每日一言 接口出错：HTTP ${res.status}`)
    }

    if (format === 'text') {
      const data = await res.text()
      // 返回纯文本时，设置 Content-Type 为 text/plain
      setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
      return data
    }

    const data = await res.json()

    return formatSuccess({
      id: data.id,
      uuid: data.uuid,
      hitokoto: data.hitokoto,
      type: data.type,          // 类型：a/b/c/d...
      from: data.from,
      fromWho: data.from_who,
      creator: data.creator,
      creatorUid: data.creator_uid,
      reviewer: data.reviewer ?? data.review,
      length: data.length,
    })
  } catch (error) {
    return formatFail((error as Error)?.message || '获取每日一言失败')
  }
})
