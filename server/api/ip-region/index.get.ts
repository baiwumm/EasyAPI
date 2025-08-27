/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-27 10:02:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-27 11:27:41
 * @Description: IP 归属地查询
 */
import { formatSuccess, formatFail } from "~/lib/constant";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ip = query.ip as string;
  try {
    // 获取客户端 IP，如果没有传 ip
    const clientIP =
      ip ||
      getHeader(event, 'x-forwarded-for') ||
      getHeader(event, 'x-real-ip') ||
      event.node.req.socket.remoteAddress;

    if (!clientIP) {
      return formatFail('无法获取 IP 地址');
    }
    // 调用淘宝 IP 库接口
    const res: any = await $fetch('http://ip.taobao.com/outGetIpInfo', {
      method: 'GET',
      query: {
        ip: clientIP,
        accessKey: 'alibaba-inc' // 淘宝官方固定写法
      }
    });
    if (res.code !== 0 || !res.data) {
      return formatFail(res.msg || 'IP 查询失败');
    }
    const data = res.data;
    return formatSuccess({
      ip: clientIP,
      country: data.country || '',
      region: data.region || '',
      city: data.city || '',
      isp: data.isp || ''
    });
  } catch (error) {
    return formatFail((error as Error)?.message || "IP 归属地查询失败");
  }
})