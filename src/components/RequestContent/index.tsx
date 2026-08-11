import AlertContent from '@/components/AlertContent'
import LoadingContent from '@/components/LoadingContent'

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-10 14:46:58
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-10 14:49:28
 * @Description: 请求失败统一处理
 */
import type { FC, ReactNode } from 'react'

interface RequestContentProps {
  children: ReactNode
  error: Error | undefined
  reFresh: VoidFunction
  loading?: boolean
  loadingText?: string
}

const RequestContent: FC<RequestContentProps> = ({ children, error, reFresh, loading = false, loadingText }) => {
  if (error) {
    return (
      <AlertContent
        title="请求失败"
        actionText="重新加载"
        buttonAction={reFresh}
        buttonVariant="danger"
        description="服务暂时不可用，请稍后重试。"
        status="danger"
      />
    )
  }
  if (loading) {
    return <LoadingContent text={loadingText} />
  }
  return children
}
export default RequestContent
