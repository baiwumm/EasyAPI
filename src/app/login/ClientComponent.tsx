"use client";
import type { FC, FormEvent } from "react";

import { useRouter } from "@bprogress/next/app";
import {
  Check,
  CircleInfo,
  CircleXmark,
  Envelope,
  Eye,
  EyeSlash,
  Lock,
} from "@gravity-ui/icons";
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
} from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { OAUTH_PROVIDERS } from "@/enums";
import { GithubIcon, GoogleIcon } from "@/lib/icons";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface EmailForm {
  email: string;
  password: string;
}

const ClientComponent: FC = () => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [emailLoading, setEmailLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  // 是否显示密码
  const [showPassword, setShowPassword] = useState(false);

  // 会话过期跳转提示（来自 request.ts 的 401 统一处理），展示后清理查询参数
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (!params.get("expired")) {
      return;
    }

    toast.danger("登录已过期，请重新登录", {
      indicator: <CircleXmark />,
      timeout: 3000,
    });
    params.delete("expired");

    const query = params.toString();

    window.history.replaceState(
      null,
      "",
      window.location.pathname + (query ? `?${query}` : ""),
    );
  }, []);

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Partial<EmailForm> = {};

    formData.forEach((value, key) => {
      data[key as keyof EmailForm] = value.toString();
    });

    setEmailLoading(true);

    // 邮箱 + 密码登录（本站仅管理员使用，不开放注册）
    const authPromise = (async () => {
      const { data: authData, error } = await supabase.auth.signInWithPassword(
        data as EmailForm,
      );

      if (error) {
        throw error; // 统一抛出错误
      }

      return authData;
    })();

    toast.promise(authPromise, {
      loading: "登录中...",
      success: async () => {
        setEmailLoading(false);
        // 显式跳转：不再仅依赖中间件对 /login 的间接重定向
        try {
          const res = await fetch("/api/auth/me");
          const { data } = await res.json();

          await router.replace(data?.isAdmin ? "/admin" : "/");
          router.refresh();
        } catch {
          router.replace("/");
        }

        return "登录成功，欢迎回来！";
      },
      error: (err: { message: string }) => {
        setEmailLoading(false);

        return `登录失败，请稍后重试：${err.message}`;
      },
    });
  };

  // 谷歌或者 Github 登录
  const handleOAuthLogin = async (
    provider: typeof OAUTH_PROVIDERS.valueType,
  ) => {
    setOauthLoading(true);
    // 加一个短提示，避免跳转等待时间过长无反馈
    toast("登录中...", {
      timeout: 2000,
      indicator: <CircleInfo />,
    });

    // 错误提示
    const errorToast = (msg: string) => {
      toast.danger("登录失败，请稍后重试", {
        description: msg,
        timeout: 2000,
        indicator: <CircleXmark />,
      });
    };

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // 回到发起登录的地址：本地开发回 localhost、线上回线上，
          // 不依赖 NEXT_PUBLIC_APP_URL 与部署环境对齐。
          // 各环境地址需在 Supabase Dashboard → Authentication →
          // URL Configuration → Redirect URLs 白名单内，否则回退 Site URL
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        errorToast(error.message);
        setOauthLoading(false);
      }
    } catch (err) {
      errorToast((err as Error).message);
      setOauthLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-1">
      <Card className="w-lg max-w-md shadow-md">
        <Card.Header>
          <div className="flex gap-1 items-center flex-col">
            <div className="w-30 h-8 relative">
              <Image fill priority alt="Logo" src="/logo.png" />
            </div>
            <Description>
              {process.env.NEXT_PUBLIC_APP_TITLE}
              ，马上登录！
            </Description>
          </div>
        </Card.Header>
        <Separator />
        <Card.Content>
          <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <TextField
              isRequired
              autoComplete="email"
              name="email"
              type="email"
              validate={(value) => {
                if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "请输入合法的邮箱地址!";
                }

                return null;
              }}
            >
              <Label>邮箱地址</Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  <Envelope className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  aria-label="Email"
                  placeholder="请输入邮箱地址"
                />
              </InputGroup>
              <FieldError />
            </TextField>
            <TextField
              isRequired
              autoComplete="current-password"
              maxLength={72}
              minLength={6}
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 6) {
                  return "密码长度至少为 6 位";
                }
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)) {
                  return "密码必须包含大小写字母和数字";
                }

                return null;
              }}
            >
              <Label>密码</Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  <Lock className="size-4 text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  aria-label="Password"
                  placeholder="请输入密码"
                  type={showPassword ? "text" : "password"}
                />
                <InputGroup.Suffix className="pr-0">
                  <Button
                    isIconOnly
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    size="sm"
                    variant="ghost"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeSlash className="size-4" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
              <Description>密码至少 6 位，需包含大小写字母和数字.</Description>
              <FieldError />
            </TextField>
            <Button
              className="w-full"
              isDisabled={oauthLoading || emailLoading}
              isPending={emailLoading}
              type="submit"
            >
              {({ isPending }) => (
                <>
                  {isPending ? (
                    <Spinner color="current" size="sm" />
                  ) : (
                    <Check />
                  )}
                  {isPending ? "登录中..." : "登录"}
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
                className="w-full"
                isDisabled={oauthLoading || emailLoading}
                isPending={oauthLoading}
                variant="outline"
                onPress={() => handleOAuthLogin(value)}
              >
                {({ isPending }) => (
                  <>
                    {isPending ? (
                      <Spinner size="sm" />
                    ) : value === OAUTH_PROVIDERS.GITHUB ? (
                      <GithubIcon />
                    ) : (
                      <GoogleIcon />
                    )}
                    {label}
                  </>
                )}
              </Button>
            ))}
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ClientComponent;
