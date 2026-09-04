"use client";
import type { UseOverlayStateReturn } from "@heroui/react";
import type { Category, CategorySaveParams } from "@/typings";
import type { FC, FormEvent } from "react";

import { CircleCheckFill, Folder } from "@gravity-ui/icons";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  NumberField,
  Spinner,
  Surface,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";

import { RESPONSE } from "@/enums";
import { useSwrMutation } from "@/hooks/use-swr";
import { addCategory, updateCategory } from "@/services/categorys";

interface SaveModalProps {
  state: UseOverlayStateReturn;
  initialValues: Category | null;
  handleRefresh: VoidFunction;
}

const SaveModal: FC<SaveModalProps> = ({
  state,
  initialValues,
  handleRefresh,
}) => {
  const actionText = initialValues ? "编辑" : "新增";

  // 保存表单（新增/编辑复用，按 initialValues 选择 service）
  const { loading, trigger } = useSwrMutation(
    "/categorys:save",
    (data: CategorySaveParams) =>
      initialValues?.id ? updateCategory(data) : addCategory(data),
    {
      onSuccess: ({ code }) => {
        if (code === RESPONSE.SUCCESS) {
          state.close();
          toast.success("提交成功", {
            timeout: 2000,
            indicator: <CircleCheckFill />,
          });
          handleRefresh?.();
        }
      },
    },
  );

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: CategorySaveParams = {
      name: formData.get("name") as string,
      desc: formData.get("desc") as string,
      sort: Number(formData.get("sort")),
      id: initialValues?.id,
    };

    trigger(data);
  };

  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Folder className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{`${actionText}分类`}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="py-4 px-1">
            <Surface variant="default">
              <Form
                className="flex flex-col gap-4"
                id="category-form"
                onSubmit={onSubmit}
              >
                <TextField
                  isRequired
                  defaultValue={initialValues?.name ?? ""}
                  maxLength={100}
                  minLength={1}
                  name="name"
                  validate={(value) => {
                    if (!value) {
                      return "请输入分类名称";
                    }

                    return null;
                  }}
                >
                  <Label>分类名称</Label>
                  <Input
                    fullWidth
                    aria-label="分类名称"
                    placeholder="请输入分类名称"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>
                <TextField
                  defaultValue={initialValues?.desc ?? ""}
                  maxLength={200}
                  name="desc"
                >
                  <Label>分类描述</Label>
                  <TextArea
                    fullWidth
                    aria-label="分类描述"
                    placeholder="请输入分类描述"
                    rows={4}
                    variant="secondary"
                  />
                </TextField>
                <NumberField
                  isRequired
                  defaultValue={initialValues?.sort ?? 1}
                  maxValue={99}
                  minValue={1}
                  name="sort"
                  validate={(value) => {
                    if (!value) {
                      return "请输入排序";
                    }

                    return null;
                  }}
                  variant="secondary"
                >
                  <Label>排序</Label>
                  <NumberField.Group>
                    <NumberField.DecrementButton />
                    <NumberField.Input />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>
              </Form>
            </Surface>
          </Modal.Body>
          <Modal.Footer>
            <Button isDisabled={loading} slot="close" variant="outline">
              取消
            </Button>
            <Button form="category-form" isPending={loading} type="submit">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {isPending ? "正在提交..." : "确定"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default SaveModal;
