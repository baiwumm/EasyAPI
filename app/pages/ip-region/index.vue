<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInput v-model="ip" placeholder="请输入 IP 地址" class="w-60" @keyup.enter="handleSearch" />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const ip = ref("183.14.31.212");

const title = ref("IP 归属地查询");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { ip },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};
</script>
