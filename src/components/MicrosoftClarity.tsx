/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 17:19:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:20:26
 * @Description: 微软统计
 */
import Script from 'next/script';

const MicrosoftClarity = () => {
  return process.env.MICROSOFT_CLARITY && process.env.NODE_ENV === 'production' ? (
    <Script
      id="microsoft-clarity"
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.MICROSOFT_CLARITY}");`,
      }}
    />
  ) : null;
};

export default MicrosoftClarity;
