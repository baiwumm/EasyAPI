/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-04 17:09:18
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-04 17:10:27
 * @Description: 百度贴吧热议榜
 */
import type { NewsResponse } from '~/lib/type'
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  const url = 'https://tieba.baidu.com/hottopic/browse/topicList'
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return formatFail(`百度贴吧热议榜 接口出错：HTTP ${response.status}`)
    }

    const responseBody = await response.json()
    if (responseBody.errmsg === 'success') {
      const result: NewsResponse[] = responseBody.data.bang_topic.topic_list.map((v: any) => {
        return {
          id: v.topic_id.toString(),
          title: v.topic_name,
          desc: v.topic_desc,
          pic: v.topic_pic,
          hot: v.discuss_num,
          url: v.topic_url,
          mobileUrl: v.topic_url,
        };
      })
      return formatSuccess(result);
    }
    return formatFail();
  } catch (error) {
    return formatFail((error as Error)?.message || '百度贴吧热议榜接口异常')
  }
})