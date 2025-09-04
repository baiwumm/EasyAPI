<template>
  <UCard variant="subtle">
    <UTabs :items="items" class="w-full" color="neutral" :unmount-on-hide="false">
      <template #categorys>
        <Categorys />
      </template>
      <template #apis>
        <Apis />
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import type { TabsItem } from "@nuxt/ui";
import Categorys from "./_components/categorys/index.vue";
import Apis from "./_components/apis/index.vue";

const items = ref<TabsItem[]>([
  {
    label: "分类列表",
    icon: "ri:menu-5-line",
    slot: "categorys" as const,
  },
  {
    label: "接口列表",
    icon: "eos-icons:api-outlined",
    slot: "apis" as const,
  },
]);

useHead({
  title: "后台管理",
});
</script>
