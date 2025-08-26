/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-08-26 21:04:55
 * @LastEditors: baiwumm me@baiwumm.com
 * @LastEditTime: 2025-08-26 23:28:42
 * @Description: 身份证信息查询
 */
import { formatSuccess, formatFail } from "~/lib/constant";
import IDValidator from "id-validator";
import GB2260 from "id-validator//src/GB2260";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  try {
    // 实例化
    const Validator = new IDValidator(GB2260);

    const isValid = Validator.isValid(id);
    if (!isValid) {
      return formatFail("身份证不合法！");
    }

    // 返回身份证信息
    const result = Validator.getInfo(id);

    return formatSuccess({
      ...result,
      sex: result.sex === 1 ? "男" : "女",
    });
  } catch (error) {
    return formatFail((error as Error)?.message || "身份证信息查询失败");
  }
});
