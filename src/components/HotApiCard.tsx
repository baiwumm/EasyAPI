/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 10:33:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-29 08:38:01
 * @Description: 热门卡片
 */
import { Alert } from "@heroui/react";

import APICard from '@/components/APICard'; // 接口卡片
import { createClient } from "@/lib/supabase/server";

export default async function HotApiCard() {
  // 创建 Supabase 客户端
  const supabase = await createClient();
  // 获取分类及关联的API接口
  const { data: popularApis } = await supabase.from('ea_apis').select('*,ea_categorys(*)', { count: 'exact' }).order('call_count', { ascending: false }).range(0, 5);
  console.log('popularApis', popularApis)
  return popularApis?.length ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
      {popularApis.map(api => (
        <APICard key={api.id} api={api} />
      ))}
    </div>
  ) : (
    // 空数据提示
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center">
          <Alert color="default" title="暂无数据" />
        </div>
      </div>
    </div>
  )
}