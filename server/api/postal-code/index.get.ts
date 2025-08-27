/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-27 13:45:29
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-27 13:47:00
 * @Description: 邮政编码查询
 */
import { formatSuccess, formatFail } from "~/lib/constant";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string;
  try {
    if (!code) {
      return formatFail('请输入邮政编码！');
    }
    // 调用淘宝邮编接口
    const res: any = await $fetch('http://ip.taobao.com/postcode', {
      method: 'GET',
      query: {
        code,
        accessKey: 'alibaba-inc' // 淘宝官方固定写法
      }
    });
    if (res.code !== 0 || !res.data) {
      return formatFail('未找到该邮编信息');
    }
    return formatSuccess({
      code,
      province: res.data.province,
      city: res.data.city,
      district: res.data.district,
      zipcode: res.data.zipcode
    });
  } catch (error) {
    return formatFail((error as Error)?.message || "邮政编码查询失败");
  }
})