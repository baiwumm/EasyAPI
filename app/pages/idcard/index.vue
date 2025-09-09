<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInput v-model="id" placeholder="请输入公民身份证号码" class="w-60" @keyup.enter="handleSearch" />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
import idCard from "idcard";

const toast = useToast();
const id = ref("510101199502152091");

const title = ref("身份证信息查询");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { id },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  // 验证身份证格式
  const isValid = idCard.verify(id.value);
  if (!id.value || !isValid) {
    toast.add({
      title: "请输入合法的身份证号！",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};
</script>
