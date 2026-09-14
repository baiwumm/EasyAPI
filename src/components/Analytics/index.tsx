import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-21 09:16:01
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-02 11:06:13
 * @Description: 统计代码
 *
 * 生产判定：Vercel preview 部署的 NODE_ENV 也是 production，
 * 需叠加 VERCEL_ENV 判断；非 Vercel 自托管无 VERCEL_ENV，默认按生产处理
 */
const IS_PROD =
  process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview";

/**
 * @description: 谷歌统计
 */
export function GoogleUtilities() {
  return process.env.NEXT_PUBLIC_GOOGLE_ID && IS_PROD ? (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID} />
  ) : null;
}

/**
 * @description: 微软统计
 */
export function MicrosoftClarity() {
  return process.env.NEXT_PUBLIC_CLARITY_ID && IS_PROD ? (
    <Script
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`,
      }}
      id="microsoft-clarity"
    />
  ) : null;
}
