/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 16:09:05
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 16:30:23
 * @Description: 底部布局
 */
import { Link, Spacer, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

import pkg from '../../package.json'

export default function Footer() {
  // 渲染备案
  const renderIcp = (url: string, icon: string, name: string = '') => (
    <Link href={url} color="foreground" isExternal size="sm" className="text-gray-500 text-xs">
      <Image src={icon} alt={name} width={16} height={16} />
      <Spacer x={1} />
      {name}
    </Link>
  );

  // 渲染社交图标
  const renderSocial = (tip: string, url: string = '', icon: string) => (
    <Tooltip showArrow content={tip} placement="top">
      <a href={url} target="_blank" className="btn-icon">
        <Icon icon={icon} className="h-6 w-6" />
      </a>
    </Tooltip>
  );
  return (
    <footer className="w-full">
      {/* 顶部分割线 */}
      <div className="flex items-center align-center text-center w-full flex-row">
        <div className="flex border-gray-200 dark:border-gray-800 w-full border-t border-solid"></div>
        <div className="font-medium flex mx-3 whitespace-nowrap">
          <span className="relative inline-flex items-center justify-center rounded-full h-5 w-20 flex-shrink-0">
            <Image src="/logo.svg" alt="logo" priority width={120} height={20} />
          </span>
        </div>
        <div className="flex border-gray-200 dark:border-gray-800 w-full border-t border-solid"></div>
      </div>
      <div className="flex justify-between items-center px-4 md:px-8 lg:px-32 py-3 max-sm:flex-col gap-2">
        {/* 备案 */}
        <div className="flex items-center gap-2 max-sm:flex-col">
          {renderIcp('https://beian.miit.gov.cn/#/Integrated/index', '/icp.png', process.env.NEXT_PUBLIC_SITE_ICP)}
          {renderIcp('https://beian.mps.gov.cn/#/query/webSearch', '/gongan.png', process.env.NEXT_PUBLIC_SITE_GUAN_ICP)}
        </div>
        {/* 社交图标 */}
        <div className="max-sm:order-first flex items-center gap-2">
          {/* 微信 */}
          {renderSocial('微信', pkg.author.wechat, 'ri:wechat-line')}
          {/* 邮箱 */}
          {renderSocial('Email', `mailto:${pkg.author.email}`, 'ri:mail-line')}
          {/* 博客 */}
          {renderSocial('博客', pkg.author.url, 'ri:quill-pen-line')}
        </div>
      </div>
    </footer>
  )
}