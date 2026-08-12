'use client'
import { useRouter } from '@bprogress/next/app'
import {
  Check,
  CircleInfo,
  CircleXmark,
  Envelope,
  Eye,
  EyeSlash,
  Lock,
} from '@gravity-ui/icons'
import {
  Button,
  Card,
  Description,
  FieldError,
  Form,
  InputGroup,
  Label,
  Separator,
  Spinner,
  TextField,
  toast,
} from '@heroui/react'
import Image from 'next/image'
import { useState } from 'react'

import { OAUTH_PROVIDERS } from '@/enums'
import { GithubIcon, GoogleIcon } from '@/lib/icons'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

import type { FC, FormEvent } from 'react'

interface EmailForm {
  email: string
  password: string
}

const ClientComponent: FC = () => {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [emailLoading, setEmailLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  // 是否显示密码
  const [showPassword, setShowPassword] = useState(false)

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const data: Partial<EmailForm> = {}
    formData.forEach((value, key) => {
      data[key as keyof EmailForm] = value.toString()
    })

    setEmailLoading(true)

    // 邮箱 + 密码登录（本站仅管理员使用，不开放注册）
    const authPromise = (async () => {
      const { data: authData, error } = await supabase.auth.signInWithPassword(data as EmailForm)
      if (error) {
        throw error // 统一抛出错误
      }
      return authData
    })()

    toast.promise(authPromise, {
      loading: '登录中...',
      success: () => {
        setEmailLoading(false)
        router.refresh()
        return '登录成功，欢迎回来！'
      },
      error: (err: { message: string }) => {
        setEmailLoading(false)
        return `登录失败，请稍后重试：${err.message}`
      },
    })

    setTimeout(() => {
      toast.clear()
    }, 2000)
  }

  // 谷歌或者 Github 登录
  const handleOAuthLogin = async (provider: typeof OAUTH_PROVIDERS.valueType) => {
    setOauthLoading(true)
    // 加一个短提示，避免跳转等待时间过长无反馈
    toast('登录中...', {
      timeout: 2000,
      indicator: <CircleInfo />,
    })

    // 错误提示
    const errorToast = (msg: string) => {
      toast.danger('登录失败，请稍后重试', {
        description: msg,
        timeout: 2000,
        indicator: <CircleXmark />,
      })
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: process.env.NEXT_PUBLIC_APP_URL,
        },
      })
      if (error) {
        errorToast(error.message)
        setOauthLoading(false)
      }
    }
    catch (err) {
      errorToast((err as Error).message)
      setOauthLoading(false)
    }
  }
  return (
    <div className="flex justify-center items-center flex-1">
      <Card className="w-lg max-w-md shadow-md">
        <Card.Header>
          <div className="flex gap-1 items-center flex-col">
            <div className="w-30 h-8 relative">
              <Image
                alt="Logo"
                fill
                src="/logo.png"
              />
            </div>
            <Description>
              {process.env.NEXT_PUBLIC_APP_TITLE}
              ，马上登录！
            </Description>
          </div>
        </Card.Header>
        <Separator />
        <Card.Content>
          <Form onSubmit={onSubmit} className="flex flex-col gap-4">
            <TextField
              name="email"
              type="email"
              isRequired
              validate={(value) => {
                if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return '请输入合法的邮箱地址!'
                }
                return null
              }}
            >
              <Label>邮箱地址</Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  <Envelope className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input aria-label="Email" placeholder="请输入邮箱地址" />
              </InputGroup>
              <FieldError />
            </TextField>
            <TextField
              name="password"
              type="password"
              isRequired
              maxLength={12}
              minLength={6}
              validate={(value) => {
                if (value.length < 6 || value.length > 12) {
                  return '请输入长度为6-12的字符串.'
                }
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)) {
                  return '密码必须包含大小写字母和数字'
                }
                return null
              }}
            >
              <Label>密码</Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  <Lock className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input aria-label="Password" type={showPassword ? 'text' : 'password'} placeholder="请输入密码" />
                <InputGroup.Suffix className="pr-0">
                  <Button
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    size="sm"
                    variant="ghost"
                    isIconOnly
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye className="size-4" /> : <EyeSlash className="size-4" />}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
              <Description>密码必须包含大小写字母和数字.</Description>
              <FieldError />
            </TextField>
            <Button type="submit" isDisabled={oauthLoading || emailLoading} isPending={emailLoading} className="w-full">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : <Check />}
                  {isPending ? '登录中...' : '登录'}
                </>
              )}
            </Button>
          </Form>
        </Card.Content>
        <Separator />
        <Card.Footer className="flex-col gap-2">
          <div className="flex w-full flex-col gap-3">
            {OAUTH_PROVIDERS.items.map(({ value, label }) => (
              <Button
                key={value}
                variant="outline"
                isDisabled={oauthLoading || emailLoading}
                isPending={oauthLoading}
                onPress={() => handleOAuthLogin(value)}
                className="w-full"
              >
                {({ isPending }) => (
                  <>
                    {isPending ? <Spinner size="sm" /> : value === OAUTH_PROVIDERS.GITHUB ? <GithubIcon /> : <GoogleIcon />}
                    {label}
                  </>
                )}
              </Button>
            ))}
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}
export default ClientComponent
