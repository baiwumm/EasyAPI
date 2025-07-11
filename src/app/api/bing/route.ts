/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 11:25:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:59:15
 * @Description: Bing 每日图片
 */
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiRes = await fetch(
      'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
    );
    const data = await apiRes.json();
    const imageUrl = `https://cn.bing.com${data.images[0].url}`;

    return NextResponse.redirect(imageUrl, 302);
  } catch {
    // 失败时重定向到备用图片
    return NextResponse.redirect('https://picsum.photos/1200/630', 302);
  }
}