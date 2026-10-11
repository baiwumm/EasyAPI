/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:00:11
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-03 14:41:02
 * @Description: 404 页面
 */
// 需要给 HeroUI Button 传 render 函数，服务端组件不能把函数当 props 传给
// 客户端组件，因此整页标成 client（本页无服务端数据，纯静态）
"use client";
import type { FC } from "react";

import { Button, Typography } from "@heroui/react";
import Link from "next/link";

const NotFound: FC = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="text-center">
        <Typography
          align="center"
          className="mt-4 text-5xl font-semibold tracking-tight text-balance text-accent sm:text-7xl"
          type="h1"
        >
          404
        </Typography>
        <Typography
          align="center"
          className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"
          type="body"
        >
          看来这个页面去环球旅行了，还没寄明信片回来。
        </Typography>
        <div className="flex items-center justify-center mt-10">
          {/* HeroUI v3 + RAC：render 只接受函数，元素形式（render={<Link />}）
              运行时会抛 "render is not a function"。这里只把 variants 解析出的
              className 转交给 Link：导航语义由 Link 自己负责，
              既避开 <a><button> 嵌套交互元素，又保留按钮样式 */}
          <Button
            render={(props) => (
              <Link className={props.className} href="/">
                回到首页
              </Link>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
