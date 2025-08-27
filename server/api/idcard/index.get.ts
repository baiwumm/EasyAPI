/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-26 21:04:55
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-27 09:13:16
 * @Description: 身份证信息查询
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import idCard from 'idcard'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  try {

    if (!id) {
      return formatFail("请输入合法的身份证号！");
    }

    const isValid = idCard.verify(id);
    if (!isValid) {
      return formatFail("身份证不合法！");
    }

    // 返回身份证信息
    const result = idCard.info(id);

    if (!result) {
      return formatFail("无法解析身份证信息！");
    }

    return formatSuccess({
      ...result,
      sex: result.gender === 'M' ? '男' : '女'
    });
  } catch (error) {
    return formatFail((error as Error)?.message || "身份证信息查询失败");
  }
});
