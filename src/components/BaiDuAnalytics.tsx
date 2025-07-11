/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 17:17:31
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:18:26
 * @Description: 百度统计代码
 */
import Script from 'next/script';

const BaiDuAnalytics = () => {
  return process.env.BAIDU_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <Script
      id="baidu-analytics"
      dangerouslySetInnerHTML={{
        __html: `var _hmt=_hmt||[];!function(){var e=document.createElement("script");e.src="https://hm.baidu.com/hm.js?${process.env.BAIDU_ANALYTICS}";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}();`,
      }}
    />
  ) : null;
};
export default BaiDuAnalytics;