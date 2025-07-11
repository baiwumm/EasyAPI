/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 16:31:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 14:47:45
 * @Description: 主题切换
 */
'use client';
import { Icon } from '@iconify/react'
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { THEME_MODE } from '@/lib/enum'

export default function ThemeMode() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 判断是否是浅色主题
  const isDark = theme === THEME_MODE.DARK;

  useEffect(() => {
    setMounted(true);
  }, []);

  // 判断组件是否挂载
  if (!mounted) {
    return null;
  }
  return (
    <button
      onClick={() => setTheme(isDark ? THEME_MODE.LIGHT : THEME_MODE.DARK)}
      className="btn-icon"
    >
      <div className="relative h-5 w-5">
        <Icon
          icon="ri:sun-line"
          className={`w-5 h-5 absolute transition-all duration-500 transform ${!isDark ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        />
        <Icon
          icon="ri:moon-line"
          className={`w-5 h-5 absolute transition-all duration-500 transform ${!isDark ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
        />
      </div>
    </button>
  )
}