/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 17:34:10
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:35:15
 * @Description: Cloudflare 统计代码
 */
import Script from 'next/script';

const CloudflareAnalytics = () => {
  return process.env.CLOUDFLARE_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <Script src="https://analytics.baiwumm.com/tracker.min.js" data-website-id={process.env.CLOUDFLARE_ANALYTICS} />
  ) : null;
};
export default CloudflareAnalytics;