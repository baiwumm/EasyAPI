/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-09-05 15:10:36
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-09-05 15:13:38
 * @Description: 英雄联盟更新公告
 */
import { formatSuccess, formatFail } from '~/lib/constant'

export default defineEventHandler(async (event) => {
  try {
    // 请求数据
    const response = await fetch('https://apps.game.qq.com/cmc/zmMcnTargetContentList?page=1&num=50&target=24&source=web_pc');
    if (!response.ok) {
      // 如果请求失败，抛出错误，不进行缓存
      return formatFail(`英雄联盟更新公告 接口出错：HTTP ${response.status}`)
    }
    // 得到请求体
    const responseBody = await response.json();
    // 处理数据
    if (responseBody.status === 1) {
      const result = responseBody.data.result.map((v: Record<string, any>) => {
        return {
          id: v.iDocID,
          title: v.sTitle,
          desc: v.sAuthor,
          pic: v.sIMG,
          hot: Number(v.iTotalPlay),
          url: `https://lol.qq.com/news/detail.shtml?docid=${encodeURIComponent(v.iDocID)}`,
          mobileUrl: `https://lol.qq.com/news/detail.shtml?docid=${encodeURIComponent(v.iDocID)}`,
        };
      });
      return formatSuccess(result);
    }
    return formatFail()
  } catch (error) {
    return formatFail((error as Error)?.message || '英雄联盟更新公告接口异常')
  }
})