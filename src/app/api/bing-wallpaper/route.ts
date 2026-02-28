/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:38:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-28 14:41:33
 * @Description: bind 每日壁纸
 */
import { NextRequest, NextResponse } from 'next/server'

import { RESPONSE } from '@/enums'
import { responseMessage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    // 解析 URL 查询参数
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format');
    const response = await fetch(
      "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN"
    );

    // 执行失败
    if (!response.ok) {
      return NextResponse.json(responseMessage(null, `bind 每日壁纸 接口出错：HTTP ${response.status}`, RESPONSE.ERROR))
    }

    const responseBody = await response.json();

    const img = responseBody.images?.[0];

    const getUrl = (url: string) => {
      const id = (new URL(url).searchParams.get('id') || '').replace(/_\d+x\d+\.jpg$/, '')
      return `https://bing.com/th?id=${id}_1920x1080.jpg`
    }

    // https://cn.bing.com//th?id=OHR.GipuzcoaSummer_ZH-CN1926924422_UHD.jpg
    // https://cn.bing.com/th?id=OHR.GipuzcoaSummer_ZH-CN1926924422_1920x1080.jpg
    const get4kUrl = (url: string) => {
      const id = (new URL(url).searchParams.get('id') || '').replace(/_\d+x\d+\.jpg$/, '')
      return `https://bing.com/th?id=${id}_UHD.jpg`
    }

    const url = `https://bing.com${img.url}`;

    const result = {
      url: getUrl(url),
      url_4k: get4kUrl(url),
      title: img.title,
      copyright: img.copyright,
    }

    // 返回 text 格式
    if (format === 'text') {
      return new NextResponse(getUrl(url), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

    return NextResponse.json(responseMessage(result));
  } catch (err) {
    return NextResponse.json(responseMessage(null, (err as Error).message, -1));
  }
}