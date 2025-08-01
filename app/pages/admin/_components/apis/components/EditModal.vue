<template>
  <UModal
    v-model:open="isOpen"
    :title="state.id ? '编辑接口' : '新增接口'"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
    aria-describedby="website-modal"
  >
    <template #body>
      <UForm ref="form" :schema :state class="space-y-4" @submit="onSubmit">
        <UFormField label="所属分类" name="category_id" required>
          <USelect
            v-model="state.category_id"
            placeholder="请选择所属分类"
            value-key="id"
            label-key="name"
            :items="categoryList || []"
            class="w-full"
          />
        </UFormField>

        <UFormField label="接口名称" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="请输入接口名称"
            class="w-full"
            size="lg"
            :maxlength="12"
            aria-describedby="name"
          >
            <template #trailing>
              <div id="character-count" class="text-xs text-muted tabular-nums" aria-live="polite" role="status">
                {{ state.name?.length || 0 }}/12
              </div>
            </template>
          </UInput>
        </UFormField>

        <div class="grid grid-cols-2">
          <UFormField label="置顶" name="pinned">
            <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" v-model="state.pinned" />
          </UFormField>
          <UFormField label="推荐" name="is_featured">
            <USwitch unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" v-model="state.is_featured" />
          </UFormField>
        </div>

        <UFormField name="desc" label="接口描述">
          <UTextarea
            v-model="state.desc"
            placeholder="请输入接口描述"
            :maxrows="4"
            autoresize
            class="w-full"
            :maxlength="120"
            size="lg"
          />
        </UFormField>

        <UFormField name="sort" label="排序" required>
          <UInputNumber v-model="state.sort" placeholder="请输入排序" class="w-full" size="lg" :min="1" :max="9999" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton color="neutral" variant="outline" label="取消" class="cursor-pointer" @click="closeModal" size="lg" />
      <UButton
        color="neutral"
        variant="solid"
        label="确认"
        :loading="loading"
        class="cursor-pointer"
        @click="form?.submit()"
        size="lg"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { ApiEdit, CategoryList } from "~/lib/type";
import { RESPONSE_STATUS_CODE } from "~/lib/enum";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  modelValue: boolean;
  api?: ApiEdit | null;
  categoryList?: CategoryList[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  success: [];
}>();

const form = useTemplateRef("form");

const toast = useToast();

const hexColorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))?$/;

// 表单验证模式
const schema = z.object({
  id: z.string().optional(),
  category_id: z.string("请选择所属分类"),
  name: z.string("请输入接口名称").min(1, "接口名称不能为空").max(12, "接口名称不能超过12个字符"),
  pinned: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  desc: z.string().max(100, "接口描述不能超过100个字符").optional().nullable(),
  sort: z.number(),
});

type Schema = z.output<typeof schema>;

// 定义一个默认值的函数
const getDefaultState = (): Partial<Schema> => ({
  id: undefined,
  category_id: undefined,
  name: undefined,
  pinned: false,
  is_featured: false,
  sort: 1,
  desc: undefined,
});

// 表单数据
const state = reactive<Partial<Schema>>(getDefaultState());

// 加载状态
const loading = ref(false);

// 重置表单
const resetForm = () => {
  Object.assign(state, getDefaultState());
};

// 模态框状态
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 监听 website 变化
watch(
  () => props.api,
  (newApi) => {
    if (newApi) {
      Object.assign(state, newApi);
    } else {
      resetForm();
    }
  },
  { immediate: true, deep: true }
);

// 关闭模态框
const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

// 表单提交
async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const url = "/api/apis";
    const isAdd = !!state.id;
    const method = isAdd ? "PUT" : "POST";

    await $fetch(url, {
      method,
      body: state,
    }).then(({ code, msg }) => {
      if (code === RESPONSE_STATUS_CODE.SUCCESS) {
        toast.add({
          title: isAdd ? "编辑成功" : "新增成功",
          color: "success",
          icon: "ri:checkbox-circle-line",
        });
        emit("success");
        closeModal();
      } else {
        toast.add({
          title: msg,
          color: "error",
          icon: "ri:close-circle-line",
        });
      }
    });
  } catch {
    // 处理其他错误
    toast.add({
      title: "操作失败",
      color: "error",
      icon: "ri:close-circle-line",
    });
  } finally {
    loading.value = false;
  }
}
</script>
