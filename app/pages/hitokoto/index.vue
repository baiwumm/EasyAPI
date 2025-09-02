<template>
  <div class="flex justify-between flex-col min-h-[inherit]">
    <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
      <!-- 左边标题 -->
      <h1 class="text-2xl font-black justify-self-start">每日一言</h1>

      <!-- 中间按钮组 -->
      <div class="justify-self-start sm:justify-self-center">
        <!-- 小屏：flex-wrap，允许换行；大屏：nowrap 强制一行 -->
        <div class="flex flex-wrap sm:flex-nowrap gap-2">
          <UButton
            v-for="v in typesOptions"
            :key="v.value"
            :color="types === v.value ? 'primary' : 'neutral'"
            variant="soft"
            :label="v.label"
            size="sm"
            class="cursor-pointer"
            @click="types = v.value"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center">
      <div class="relative max-w-[80%] min-w-[20%]">
        <UIcon name="ri:double-quotes-l" class="!size-[4rem] absolute -top-10 -left-10" />
        <TextType
          v-if="status === 'pending'"
          text="灵感正在路上..."
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-2xl text-cetner py-6"
        />
        <TextType
          v-else
          :text="data.content || '服务器开小差了...'"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-2xl text-cetner py-6"
        />
        <div v-if="status === 'success'" class="absolute -bottom-4 right-0">
          —— {{ data?.from_who || "" }}{{ data?.from ? `「${data?.from}」` : "" }}
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-2">
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="() => refresh()"
      >
        换一句
      </UButton>
      <UButton icon="ph:copy-bold" size="sm" color="neutral" variant="soft" class="cursor-pointer" @click="copyText">
        复制
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const toast = useToast();

// 请求参数
const types = ref("");
const typesOptions = reactive([
  { value: "", label: "随机" },
  { value: "a", label: "动画" },
  { value: "b", label: "漫画" },
  { value: "c", label: "游戏" },
  { value: "d", label: "文学" },
  { value: "e", label: "原创" },
  { value: "f", label: "网络" },
  { value: "g", label: "其他" },
  { value: "h", label: "影视" },
  { value: "i", label: "诗词" },
  { value: "j", label: "网易云" },
  { value: "k", label: "哲学" },
  { value: "l", label: "抖机灵" },
]);

// 请求数据
const { data, status, refresh } = await useFetch("/api/hitokoto", {
  query: { types },
  transform: (res) => (res as any).data,
});

// 复制当前文案到剪贴板
const copyText = async () => {
  if (data.value?.content) {
    try {
      await navigator.clipboard.writeText(data.value?.content);
      toast.add({
        title: "文案已复制！",
        color: "success",
        icon: "ri:checkbox-circle-line",
      });
    } catch (err) {
      toast.add({
        title: "复制失败，请手动复制!",
        color: "error",
        icon: "ri:close-circle-line",
      });
    }
  }
};
</script>
