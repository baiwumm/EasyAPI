<template>
  <div class="flex justify-center items-center">
    <UButton to="https://docs.baiwumm.com/" target="_blank">接口文档</UButton>
  </div>
</template>

<script setup lang="ts">
defineOgImageComponent("Nuxt", {
  headline: "Greetings",
  title: `${process.env.NUXT_SITE_NAME} 👋`,
  description: "A beautiful and modern API aggregation platform!",
});

definePageMeta({
  title: "一个精美、现代化的 API 聚合平台！",
});
</script>
