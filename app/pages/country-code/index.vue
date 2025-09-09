<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInput v-model="keyword" placeholder="请输入关键字查询" class="w-60" @keyup.enter="handleSearch" />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const keyword = ref("中国");

const title = ref("国际区号");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { keyword },
  watch: false,
  transform: (res) => (res as any).data,
});

const toast = useToast();

// 查询回调
const handleSearch = async () => {
  if (!keyword.value) {
    toast.add({
      title: "请输入关键字查询！",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};
</script>
