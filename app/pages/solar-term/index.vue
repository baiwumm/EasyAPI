<template>
  <div class="flex justify-between items-center flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black place-self-start">{{ title }}</h1>
    <div class="relative max-w-[95%] min-w-[20%]">
      <UTable :data="data" :columns="columns" :loading="status === 'pending'" />
    </div>
    <div class="flex justify-center gap-2">
      <USelect v-model="year" :items="yearOptions" class="w-40" />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

type Data = {
  name: string; // 节气名
  date: string; // 时间
};

const dayjs = useDayjs();

const title = ref("二十四节气");
const year = ref(dayjs().year());

// 生成年份选项, 目前支持从2001年12月29日到今年的法定假日安排。
const yearOptions = computed(() => {
  const years = [];
  for (let year = dayjs().year(); year >= 1990; year--) {
    years.push(String(year));
  }
  return years;
});

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status } = await useFetch(path, {
  query: { year },
  transform: (res) => (res as any).data,
});

const UBadge = resolveComponent("UBadge");

// 列配置项
const columns: TableColumn<Data>[] = [
  {
    accessorKey: "name",
    header: "节气名",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          variant: "soft",
        },
        () => row.getValue("name")
      );
    },
  },
  {
    accessorKey: "date",
    header: "时间",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
];

useHead({
  title,
});
</script>
