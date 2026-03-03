/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-02 17:56:43
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-02 18:04:36
 * @Description: 密码强度检测
 */
import type { Metadata } from "next";

import ClientComponent from './ClientComponent';

export const metadata: Metadata = {
  title: '密码强度检测',
}

export default function PasswordStrength() {
  return <ClientComponent />
}