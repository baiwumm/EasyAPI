"use client";
import { CircleCheckFill, Globe } from "@gravity-ui/icons";
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
  type UseOverlayStateReturn
} from "@heroui/react";
import { useRequest } from "ahooks";
import { type FC, type FormEvent, useEffect, useRef } from 'react';

import { REQUEST_METHODS, RESPONSE } from '@/enums';
import { get } from '@/lib/utils'
import { addApi, updateApi } from '@/services/apis';

const SwitchOptions: { name: string, label: string }[] = [
  { name: 'pinned', label: '置顶' },
  { name: 'is_featured', label: '推荐' },
]

type SaveModalProps = {
  state: UseOverlayStateReturn;
  initialValues: App.Api | null;
  handleRefresh: VoidFunction;
  categorysList: App.Category[];
}

const SaveModal: FC<SaveModalProps> = ({
  state,
  initialValues,
  handleRefresh,
  categorysList = [],
}) => {
  // 表单实例
  const formRef = useRef<HTMLFormElement>(null);
  const actionText = initialValues ? '编辑' : '新增';

  // 保存表单
  const { loading, run } = useRequest(initialValues?.id ? updateApi : addApi, {
    manual: true,
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
  });

  // 表单提交
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: App.ApiSaveParams = {
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

    run(data);
  };

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset();
    }
  }, [state.isOpen]);
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} isDismissable={false} isKeyboardDismissDisabled>
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
              <Form ref={formRef} id="category-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
                <Select
                  name='category_id'
                  isRequired
                  aria-label='所属分类'
                  placeholder="请选择所属分类"
                  variant='secondary'
                  defaultValue={initialValues?.category_id ?? ""}
                >
                  <Label>所属分类</Label>
                  <Select.Trigger>
                    <Select.Value />
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
                  name="name"
                  minLength={1}
                  maxLength={100}
                  defaultValue={initialValues?.name ?? ""}
                  validate={(value) => {
                    if (!value) {
                      return "请输入接口名称";
                    }
                    return null;
                  }}
                >
                  <Label>接口名称</Label>
                  <Input aria-label="接口名称" fullWidth variant="secondary" placeholder="请输入接口名称" />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  name="path"
                  minLength={1}
                  maxLength={100}
                  defaultValue={initialValues?.path ?? ""}
                  validate={(value) => {
                    if (!value) {
                      return "请输入接口路径";
                    }
                    if (!value.startsWith('/')) {
                      return '接口路径必须以 / 开头';
                    }
                    return null;
                  }}
                >
                  <Label>接口路径</Label>
                  <Input aria-label="接口路径" fullWidth variant="secondary" placeholder="请输入接口路径" />
                  <FieldError />
                </TextField>
                <TextField
                  isRequired
                  name="operation_id"
                  minLength={1}
                  maxLength={100}
                  defaultValue={initialValues?.operation_id ?? ""}
                  validate={(value) => {
                    if (!value) {
                      return "请输入operation_id";
                    }
                    return null;
                  }}
                >
                  <Label>operationId</Label>
                  <Input aria-label="operationId" fullWidth variant="secondary" placeholder="请输入operation_id" />
                  <FieldError />
                </TextField>
                <Select
                  name='method'
                  isRequired
                  aria-label='请求方式'
                  placeholder="请选择请求方式"
                  variant='secondary'
                  defaultValue={initialValues?.method ?? ""}
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
                <TextField name="desc" maxLength={500} defaultValue={initialValues?.desc ?? ""}>
                  <Label>接口描述</Label>
                  <TextArea aria-label="接口描述" fullWidth variant="secondary" rows={4} maxLength={200} placeholder="请输入接口描述" />
                </TextField>
                <div className="grid grid-cols-2 items-center gap-4">
                  {SwitchOptions.map(({ name, label }) => (
                    <Checkbox key={name} id={name} name={name} defaultSelected={get(initialValues, name, false)} >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <Label htmlFor={name}>{label}</Label>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
                <NumberField
                  isRequired
                  validate={(value) => {
                    if (!value) {
                      return "请输入排序";
                    }
                    return null;
                  }}
                  maxValue={99}
                  minValue={1}
                  name="sort"
                  defaultValue={initialValues?.sort ?? 1}
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
            <Button slot="close" variant="outline" isDisabled={loading}>
              取消
            </Button>
            <Button type="submit" form="category-form" isPending={loading}>
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
  )
}
export default SaveModal;