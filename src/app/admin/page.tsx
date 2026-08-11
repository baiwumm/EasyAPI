/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 16:01:46
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-26 18:06:14
 * @Description: 管理后台
 */
import { Folder, Globe } from '@gravity-ui/icons'
import { Tabs } from '@heroui/react'

import { ADMIN_TABS } from '@/enums'

import Apis from './components/apis'
import Categorys from './components/categorys'

import type { Metadata } from 'next'
import type { FC } from 'react'

export const metadata: Metadata = {
  title: '后台管理',
}

const Admin: FC = () => {
  return (
    <Tabs>
      <Tabs.ListContainer>
        <Tabs.List aria-label="后台管理">
          <Tabs.Tab id={ADMIN_TABS.CATEGOTYS} className="flex items-center gap-1">
            <Folder />
            {ADMIN_TABS.label(ADMIN_TABS.CATEGOTYS)}
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id={ADMIN_TABS.APIS} className="flex items-center gap-1">
            <Globe />
            {ADMIN_TABS.label(ADMIN_TABS.APIS)}
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel id={ADMIN_TABS.CATEGOTYS}>
        <Categorys />
      </Tabs.Panel>
      <Tabs.Panel id={ADMIN_TABS.APIS}>
        <Apis />
      </Tabs.Panel>
    </Tabs>
  )
}
export default Admin
