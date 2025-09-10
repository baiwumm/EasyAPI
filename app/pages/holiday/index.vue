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
  name: string; // 假期名称
  start: string; // 开始日期
  end: string; // 结束日期
  distance: number; // 距离现在的天数
  length: number; // 假期长度
  balance: number; // 假期余额
  work: string[]; // work
};

const dayjs = useDayjs();

const title = ref("法定节假日");
const year = ref(dayjs().year());

// 生成年份选项, 目前支持从2001年12月29日到今年的法定假日安排。
const yearOptions = computed(() => {
  const years = [];
  for (let year = dayjs().year(); year >= 2002; year--) {
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
    header: "假期名称",
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
    accessorKey: "range",
    header: "假期范围",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => `${row.original.start} ~ ${row.original.end}`,
  },
  {
    accessorKey: "length",
    header: "假期长度",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => `${row.getValue("length")}天`,
  },
  {
    accessorKey: "balance",
    header: "假期余额",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => `${row.getValue("balance")}天`,
  },
  {
    accessorKey: "balance",
    header: "距离",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const distance = row.original?.distance;
      if (distance === 0) {
        return `太好了，今天是${row.getValue("name")}!`;
      }
      return distance < 0 ? `已过去${Math.abs(distance)}天` : `还有${distance}天`;
    },
  },
  {
    accessorKey: "work",
    header: "调休日期",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
    cell: ({ row }) => {
      const work = row.original?.work || [];
      return work?.length
        ? h(
            "div",
            { class: "flex justify-center gap-1" },
            work.map((v) =>
              h(UBadge, {
                color: "neutral",
                variant: "soft",
                label: v,
              })
            )
          )
        : "--";
    },
  },
];

useHead({
  title,
});
</script>
