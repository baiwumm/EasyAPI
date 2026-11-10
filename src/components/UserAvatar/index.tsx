/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 15:44:57
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 14:12:22
 * @Description: 用户头像
 */
import type { FC, Key } from "react";

import { useRouter } from "@bprogress/next/app";
import { ArrowRightFromSquare, GearDot, Person } from "@gravity-ui/icons";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Description,
  Dropdown,
  Label,
  Separator,
  Spinner,
  toast,
  Tooltip,
  Typography,
  useOverlayState,
} from "@heroui/react";
import { useState } from "react";
import { CircleXmarkFill } from "@gravity-ui/icons";

import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { useUserAvatarUrl } from "@/hooks/use-user-avatar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getUserDisplayName } from "@/lib/user-profile";

const UserAvatar: FC = () => {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  // 获取登录用户信息
  const { user, loading } = useSupabaseUser();
  // 注销 Loading
  const [logoutLoading, setLogoutLoading] = useState(false);
  // 退出确认弹窗
  const [open, setOpen] = useState(false);
  const alertState = useOverlayState();
  // 用户名称：GitHub 用户名优先（不展示真名），回退登录资料名、邮箱首字符
  const name = getUserDisplayName(user);
  // 用户头像：候选链预加载降级（GitHub 身份头像 > 登录资料头像 > 本地兜底），
  // 远程候选统一走 /api/avatar-proxy 代理，全部不可达时交给 Fallback
  const avatarUrl = useUserAvatarUrl(user);

  // 点击菜单回调
  const onClickMenu = (key: Key) => {
    switch (key) {
      case "admin":
        router.push("/admin");
        break;
      case "logout":
        // 直接打开确认弹窗（原实现先 setTimeout 500ms 再 open，纯属拖慢交互）
        alertState.open();
        break;
    }
  };

  // 退出登录
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await supabase.auth.signOut();
      alertState.close();
      // 返回首页
      await router.push("/login");
    } catch (err) {
      // 登出失败（多为网络异常）：保持弹窗打开，让用户能直接重试
      toast.danger(`退出登录失败，请稍后重试：${(err as Error).message}`, {
        indicator: <CircleXmarkFill />,
        timeout: 3000,
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  return loading ? (
    <Spinner size="sm" />
  ) : user ? (
    <>
      <Dropdown isOpen={open} onOpenChange={setOpen}>
        <Dropdown.Trigger>
          <Badge.Anchor>
            <Avatar className="size-8">
              <Avatar.Image alt="在线用户" src={avatarUrl} />
              <Avatar.Fallback>
                <Person />
              </Avatar.Fallback>
            </Avatar>
            <Badge
              className="min-h-3 min-w-3"
              color="success"
              placement="bottom-right"
              size="sm"
            />
          </Badge.Anchor>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <div className="flex items-center gap-3 p-3">
            <Avatar size="sm">
              <Avatar.Image alt="在线用户" src={avatarUrl} />
              <Avatar.Fallback>
                <Person />
              </Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0">
              <Typography className="font-black" type="body-sm">
                {name}
              </Typography>
              <Description className="truncate">{user?.email}</Description>
            </div>
          </div>
          <Separator />
          <Dropdown.Menu className="font-normal" onAction={onClickMenu}>
            {/* 注册已关闭，登录用户即受信任（账号仅由管理员在 Dashboard 添加） */}
            <Dropdown.Item id="admin" textValue="Admin">
              <GearDot className="size-4 shrink-0 text-muted" />
              <Label>管理后台</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" textValue="Logout" variant="danger">
              <ArrowRightFromSquare className="size-4 shrink-0 text-danger" />
              <Label>退出登录</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {/* 确认弹窗 */}
      <AlertDialog.Backdrop
        isOpen={alertState.isOpen}
        onOpenChange={alertState.setOpen}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>温馨提示</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>确定要退出登录吗？</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                取消
              </Button>
              <Button
                isPending={logoutLoading}
                variant="danger"
                onPress={() => handleLogout()}
              >
                {({ isPending }) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : null}
                    {isPending ? "正在退出..." : "确认注销"}
                  </>
                )}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  ) : (
    <Tooltip>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        onPress={() => router.push("/login")}
      >
        <Person />
      </Button>
      <Tooltip.Content showArrow>
        <Tooltip.Arrow />
        登录
      </Tooltip.Content>
    </Tooltip>
  );
};

export default UserAvatar;
