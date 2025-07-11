/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 17:24:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:24:30
 * @Description: 谷歌统计代码
 */
import { GoogleAnalytics } from '@next/third-parties/google';

const GoogleUtilities = () => {
  return process.env.GOOGLE_ANALYTICS && process.env.NODE_ENV === 'production' ? (
    <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS} />
  ) : null;
};
export default GoogleUtilities;