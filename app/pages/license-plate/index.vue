<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInput
        v-model="keyword"
        placeholder="请输入关键字，如粤A"
        maxlength="6"
        class="w-60"
        @keyup.enter="handleSearch"
      />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const toast = useToast();
const keyword = ref("粤A");

const title = ref("车牌归属地查询");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { keyword },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  if (!keyword.value) {
    toast.add({
      title: "请输入关键字",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};
</script>
