import QuoteWorld from "@/components/QuoteWorld";
import ToolPage from "@/components/ToolPage";
import { createPageMetadata } from "@/lib/seo";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 15:05:47
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 15:15:43
 * @Description: 歇后语
 */

const seo = {
  title: "歇后语",
  description:
    "歇后语随机查询：随机返回一条歇后语及其答案，可在线学习或调用接口，语文教学与趣味场景适用。",
  path: "/riddle",
};

export const metadata = createPageMetadata(seo);

export default function Riddle() {
  return (
    <ToolPage seo={seo}>
      <QuoteWorld mode="riddle" title={seo.title} />
    </ToolPage>
  );
}
