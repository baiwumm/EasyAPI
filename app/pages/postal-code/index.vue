<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInput v-model="keyword" placeholder="请输入邮政编码" maxLength="6" class="w-60" @keyup.enter="handleSearch" />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const type = ref("1");
const keyword = ref("524200");

const title = ref("邮政编码查询");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { type, keyword },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};
</script>
