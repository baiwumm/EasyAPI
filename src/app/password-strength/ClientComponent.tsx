'use client'
import { ArrowsRotateLeft } from '@gravity-ui/icons';
import { Button, Card, Input, ScrollShadow, Spinner, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AlertContent from '@/components/AlertContent';
import { get } from '@/lib/utils';
import { getApiData } from '@/services/common';

export default function ClientComponent() {
  const pathname = usePathname();
  const [password, setPassword] = useState('abc123456');

  // 请求数据
  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getApiData(pathname, params), 'data', {}), {
    defaultParams: [{ password }]
  },
  );

  // 请求数据
  const reFresh = () => {
    if (!password?.trim()) {
      toast.danger("参数 password 必填");
      return;
    }
    if (password.length > 128) {
      toast.danger("参数 password 长度不能超过 128 个字符");
      return;
    }
    run({ password });
  }

  // 渲染内容
  const renderContent = () => {
    if (error) {
      return (
        <AlertContent
          status="danger"
          title="请求失败"
          description="服务暂时不可用，请稍后重试。"
          actionText="重新加载"
          buttonVariant="danger"
          buttonAction={reFresh}
        />
      )
    }
    if (loading) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Spinner />
          <span className="text-sm text-muted font-bold">正在检测...</span>
        </div>
      )
    }
    return (
      <div className="flex justify-center items-center w-full">
        <Card className="max-w-full">
          <Card.Content className="p-0">
            <ScrollShadow className="max-h-100 p-4" orientation="vertical">
              <pre><code style={{ fontFamily: 'Maple Mono CN' }}>{JSON.stringify(data, null, 2)}</code></pre>
            </ScrollShadow>
          </Card.Content>
        </Card>
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <h1 className="text-2xl font-black">密码强度检测</h1>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        {renderContent()}
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Input value={password} onChange={(event) => setPassword(event.target.value)} aria-label="密码" placeholder='请输入密码' className="w-50" />
          <Button size='sm' isPending={loading} onPress={reFresh} className="bg-accent-soft text-accent hover:bg-accent-soft-hover">
            {({ isPending }) => (
              <>
                {isPending ? <Spinner color="current" size="sm" /> : <ArrowsRotateLeft />}
                检测
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}