<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UPopover>
        <UButton :label="color" color="neutral" variant="outline">
          <template #leading>
            <span :style="chip" class="size-3 rounded-full" />
          </template>
        </UButton>

        <template #content>
          <UColorPicker v-model="color" class="p-2" />
        </template>
      </UPopover>
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const toast = useToast();
const color = ref("#2ECC40");

const chip = computed(() => ({ backgroundColor: color.value }));

const title = ref("颜色转换");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { color },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  if (!color.value) {
    toast.add({
      title: "请选择颜色",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};
</script>
