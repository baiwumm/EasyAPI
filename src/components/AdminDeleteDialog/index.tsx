/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-28 14:04:22
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-29 14:49:04
 * @Description: 删除确认弹窗（admin 通用，batch-4 合并自 apis/categorys 两份仅实体名不同的实现）
 */
"use client";

import type { UseOverlayStateReturn } from "@heroui/react";
import type { FC } from "react";

import { AlertDialog, Button, Spinner, Typography } from "@heroui/react";

interface AdminDeleteDialogProps {
  state: UseOverlayStateReturn;
  loading: boolean;
  /** 实体名（接口 / 分类），用于标题与正文文案 */
  entity: string;
  handleDelConfirm: VoidFunction;
}

const AdminDeleteDialog: FC<AdminDeleteDialogProps> = ({
  state,
  loading = false,
  entity,
  handleDelConfirm,
}) => {
  return (
    <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-100">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>确认删除该{entity}？</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Typography color="muted" type="body-sm">
              删除后，该{entity}
              及其关联的数据将被
              <strong>永久移除</strong>
              ，且无法恢复。 请确认当前操作不会影响正在使用的业务或历史数据。
            </Typography>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button isDisabled={loading} slot="close" variant="tertiary">
              取消
            </Button>
            <Button
              isPending={loading}
              variant="danger"
              onPress={handleDelConfirm}
            >
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {isPending ? "正在删除..." : "确认删除"}
                </>
              )}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};

export default AdminDeleteDialog;
