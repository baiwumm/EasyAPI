<template>
  <div class="flex justify-between items-center flex-col min-h-[inherit] container mx-auto gap-6">
    <h1 class="place-self-start text-2xl font-black">{{ title }}</h1>
    <div v-if="status === 'success'" class="flex items-center justify-center w-full px-4 text-xl sm:text-2xl">
      <UCard class="overflow-y-scroll max-h-[30rem]">
        <pre v-if="!isEmpty(data)"><code v-text="JSON.stringify(data,null,2) " /></pre>
        <div v-else class="flex justify-between items-center flex-col">
          <Icon name="my-icon:empty" size="4em" />
          <p class="text-lg text-slate-500 dark:text-slate-200">暂无数据</p>
        </div>
      </UCard>
    </div>
    <div v-else class="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
    <div class="flex justify-center gap-2 mt-6">
      <!-- 输入区交给父组件 -->
      <slot name="input" />
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="onSearch"
      >
        查询
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string;
  status: "pending" | "success" | "error";
  data: any;
  onSearch: () => void; // 查询逻辑交给父组件
}>();

useHead({
  title: props.title,
});
</script>
