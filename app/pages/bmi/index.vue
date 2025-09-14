<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInputNumber
        v-model="height"
        placeholder="请输入身高"
        :format-options="{
          style: 'unit',
          unit: 'centimeter',
          unitDisplay: 'short',
        }"
        class="w-60"
        @keyup.enter="handleSearch"
      />
      <UInputNumber
        v-model="weight"
        placeholder="请输入体重"
        :format-options="{
          style: 'unit',
          unit: 'kilogram',
          unitDisplay: 'short',
        }"
        class="w-60"
        @keyup.enter="handleSearch"
      />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const height = ref(168);
const weight = ref(50);

const title = ref("BMI 计算器");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { height, weight },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};
</script>
