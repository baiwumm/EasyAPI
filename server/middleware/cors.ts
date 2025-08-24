/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-23 20:36:33
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-24 20:58:50
 * @Description: 处理跨域中间件
 */

export default defineEventHandler((event) => {
  const allowedOrigin = "https://api-docs.baiwumm.com";
  const origin = getHeader(event, "origin");

  if (origin === allowedOrigin) {
    setHeader(event, "Access-Control-Allow-Origin", origin);
    setHeader(event, "Vary", "Origin"); // 避免缓存污染
  }

  setHeader(event, "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  setHeader(event, "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (getMethod(event) === "OPTIONS") {
    event.node.res.statusCode = 204;
    return "OK";
  }
});
