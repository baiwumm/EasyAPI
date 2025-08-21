// server/middleware/cors.ts
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
