<script setup lang="ts">
// Props
interface Props {
  record: Record<string, any>;
}

const props = defineProps<Props>();

// DOM 引用
const textRef = ref<HTMLElement | null>(null);

// 是否溢出
const isOverflowing = ref(false);

// 是否移动端（使用 vueuse 的 useBreakpoints 或 useMediaQuery）
const isMobile = useMediaQuery("(max-width: 768px)");

// 检测是否溢出
const checkOverflow = () => {
  const el = textRef.value;
  if (el) {
    isOverflowing.value = el.scrollWidth > el.clientWidth;
  }
};

// 监听 record 变化
watch(
  () => props.record,
  async () => {
    await nextTick(); // 等待 DOM 更新
    checkOverflow();
  },
  { immediate: true }
);

// 组件挂载后检测
onMounted(() => {
  checkOverflow();
  useEventListener("resize", checkOverflow);
});

// 点击事件
const handleClick = (event: MouseEvent) => {
  const record = props.record;
  window.open(isMobile.value ? record.mobileUrl : record.url, "_blank");
};
</script>

<template>
  <!-- Tooltip 模拟：仅在溢出时显示 title -->
  <UTooltip :text="record.title" :disabled="!isOverflowing">
    <div
      ref="textRef"
      class="transition ease-in duration-300 cursor-pointer text-sm whitespace-nowrap self-start overflow-hidden text-ellipsis flex-auto relative py-1 after:absolute after:content-[''] after:h-0.5 after:w-0 after:left-0 after:-bottom-0 after:bg-slate-200 after:transition-all after:duration-500 hover:translate-x-1 hover:after:w-full"
      :title="isOverflowing ? record.title : undefined"
      @click="handleClick"
    >
      {{ record.title }}
    </div>
  </UTooltip>
</template>

<style scoped>
/* 防止 span 影响布局 */
span {
  content: "";
}
</style>
