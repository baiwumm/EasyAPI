"use client";
import type { UseOverlayStateReturn } from "@heroui/react";
import type { Api, ApiSaveParams, Category } from "@/typings";
import type { FC, FormEvent } from "react";

import { CircleCheckFill, CircleXmarkFill, Globe } from "@gravity-ui/icons";
import {
  Button,
  Checkbox,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  NumberField,
  Select,
  Spinner,
  Surface,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";

import { REQUEST_METHODS, RESPONSE } from "@/enums";
import { useSwrMutation } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { addApi, updateApi } from "@/services/apis";

const SwitchOptions: { name: string; label: string }[] = [
  { name: "pinned", label: "置顶" },
  { name: "is_featured", label: "推荐" },
];

interface SaveModalProps {
  state: UseOverlayStateReturn;
  initialValues: Api | null;
  handleRefresh: VoidFunction;
  categorysList: Category[];
}

const SaveModal: FC<SaveModalProps> = ({
  state,
  initialValues,
  handleRefresh,
  categorysList = [],
}) => {
  const actionText = initialValues ? "编辑" : "新增";

  // 保存表单（新增/编辑复用，按 initialValues 选择 service）
  const { loading, trigger } = useSwrMutation(
    "/apis:save",
    (data: ApiSaveParams) =>
      initialValues?.id ? updateApi(data) : addApi(data),
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

    const data: ApiSaveParams = {
      id: initialValues?.id,

      // string
      category_id: formData.get("category_id") as string,
      name: formData.get("name") as string,
      desc: (formData.get("desc") as string) ?? "",
      path: formData.get("path") as string,
      method: formData.get("method") as typeof REQUEST_METHODS.valueType,
      operation_id: formData.get("operation_id") as string,

      // number
      sort: Number(formData.get("sort")),

      // boolean（checkbox 选中才会存在）
      pinned: formData.has("pinned"),
      is_featured: formData.has("is_featured"),
    };

    // 兜底校验：Select 的空值/非法值不直发服务端（避免 FK/枚举原始错误直接暴露）
    if (
      !data.category_id ||
      !data.name ||
      !data.path ||
      !REQUEST_METHODS.values.includes(data.method as never)
    ) {
      toast.danger("请完整填写表单必填项", {
        indicator: <CircleXmarkFill />,
        timeout: 3000,
      });

      return;
    }

    trigger(data);
  };

  return (
    <Modal.Backdrop
      isKeyboardDismissDisabled
      isDismissable={false}
      isOpen={state.isOpen}
      onOpenChange={state.setOpen}
    >
      <Modal.Container placement="auto">
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Globe className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{`${actionText}接口`}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="py-4 px-1">
            <Surface variant="default">
              <Form
                className="flex flex-col gap-4"
                id="api-form"
                onSubmit={onSubmit}
              >
                <Select
                  isRequired
                  aria-label="所属分类"
                  defaultValue={initialValues?.category_id || null}
                  name="category_id"
                  placeholder="请选择所属分类"
                  validate={(value) => (value ? null : "请选择所属分类")}
                  variant="secondary"
                >
                  <Label>所属分类</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.ClearButton />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {categorysList?.map(({ id, name }) => (
                        <ListBox.Item key={id} id={id} textValue={name}>
                          {name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError />
                </Select>
                <TextField
                  isRequired
                  defaultValue={initialValues?.name ?? ""}
                  maxLength={100}
                  minLength={1}
                  name="name"
                  validate={(value) => {
                    if (!value) {
                      return "请输入接口名称";
                    }

                    return null;
                  }}
                >
                  <Label>接口名称</Label>
                  <Input
                    fullWidth
                    aria-label="接口名称"
                    placeholder="请输入接口名称"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  defaultValue={initialValues?.path ?? ""}
                  maxLength={100}
                  minLength={1}
                  name="path"
                  validate={(value) => {
                    if (!value) {
                      return "请输入接口路径";
                    }
                    if (!value.startsWith("/")) {
                      return "接口路径必须以 / 开头";
                    }

                    return null;
                  }}
                >
                  <Label>接口路径</Label>
                  <Input
                    fullWidth
                    aria-label="接口路径"
                    placeholder="请输入接口路径"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  defaultValue={initialValues?.operation_id ?? ""}
                  maxLength={100}
                  minLength={1}
                  name="operation_id"
                  validate={(value) => {
                    if (!value) {
                      return "请输入operation_id";
                    }

                    return null;
                  }}
                >
                  <Label>operationId</Label>
                  <Input
                    fullWidth
                    aria-label="operationId"
                    placeholder="请输入operation_id"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>
                <Select
                  isRequired
                  aria-label="请求方式"
                  defaultValue={initialValues?.method ?? ""}
                  name="method"
                  placeholder="请选择请求方式"
                  validate={(value) =>
                    value && REQUEST_METHODS.values.includes(value as never)
                      ? null
                      : "请选择请求方式"
                  }
                  variant="secondary"
                >
                  <Label>请求方式</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {REQUEST_METHODS.items.map(({ value, label }) => (
                        <ListBox.Item key={value} id={value} textValue={label}>
                          {label}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError />
                </Select>
                <TextField
                  defaultValue={initialValues?.desc ?? ""}
                  maxLength={200}
                  name="desc"
                >
                  <Label>接口描述</Label>
                  <TextArea
                    fullWidth
                    aria-label="接口描述"
                    maxLength={200}
                    placeholder="请输入接口描述"
                    rows={4}
                    variant="secondary"
                  />
                </TextField>
                <div className="grid grid-cols-2 items-center gap-4">
                  {SwitchOptions.map(({ name, label }) => (
                    <Checkbox
                      key={name}
                      defaultSelected={get(initialValues, name, false)}
                      id={name}
                      name={name}
                      variant="secondary"
                    >
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Label htmlFor={name}>{label}</Label>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
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
            <Button form="api-form" isPending={loading} type="submit">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {loading ? "正在提交..." : "确定"}
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
