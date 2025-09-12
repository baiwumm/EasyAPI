<template>
  <div class="flex justify-between items-center flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black place-self-start">{{ title }}</h1>
    <div class="relative max-w-[95%] min-w-[20%]">
      <UTable :data="data" :columns="columns" :loading="status === 'pending'" />
    </div>
    <div class="flex justify-center gap-2">
      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          {{ date ? df.format(date.toDate(getLocalTimeZone())) : "请选择日期" }}
        </UButton>

        <template #content>
          <UCalendar v-model="date" class="p-2" />
        </template>
      </UPopover>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { CalendarDate, DateFormatter, getLocalTimeZone } from "@internationalized/date";

type Data = {
  chong: string; // 冲
  date: string; // 日期
  hour: string; // 时辰
  hours: string; // 时段
  ji: string; // 忌
  jiuxing: string; // 九星
  nayin: string; // 纳音
  sha: string; // 煞
  yi: string; // 宜
};

const dayjs = useDayjs();

const df = new DateFormatter("zh-CN", {
  dateStyle: "medium",
});

const title = ref("十二时辰黄历");
const date = shallowRef(new CalendarDate(dayjs().year(), dayjs().month() + 1, dayjs().date()));

// 获取请求路劲
const path = usePath();

// 格式化 date 为 YYYY-MM-DD
const formattedDate = computed(() => {
  const d = date.value;
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
});

// 请求数据
const { data, status } = await useFetch(path, {
  query: { date: formattedDate },
  transform: (res) => (res as any).data,
});

const UBadge = resolveComponent("UBadge");

// 列配置项
const columns: TableColumn<Data>[] = [
  {
    accessorKey: "date",
    header: "日期",
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
        () => row.getValue("date")
      );
    },
  },
  {
    accessorKey: "hours",
    header: "时段",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "hour",
    header: "时辰",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "yi",
    header: "宜",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "ji",
    header: "忌",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "chong",
    header: "冲",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "sha",
    header: "煞",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "nayin",
    header: "纳音",
    meta: {
      class: {
        td: "text-center",
        th: "text-center",
      },
    },
  },
  {
    accessorKey: "jiuxing",
    header: "九星",
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
