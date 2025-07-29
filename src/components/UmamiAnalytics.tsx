/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 17:32:10
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:33:51
 * @Description: Umami 统计代码
 */
import Script from 'next/script';

const UmamiAnalytics = () => {
  return process.env.NEXT_PUBLIC_UMAMI_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <Script src="https://umami.baiwumm.com/script.js" data-website-id={process.env.NEXT_PUBLIC_UMAMI_ANALYTICS} />
  ) : null;
};
export default UmamiAnalytics;