<!--
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-04-10 16:25:21
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-08-20 17:45:44
 * @Description: 顶部布局
-->
<template>
  <header
    class="flex gap-4 justify-between items-center sticky top-0 h-14 shadow-md dark:shadow-white-500/50 backdrop-blur transition-all w-full dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)] z-50 px-6"
  >
    <!-- logo -->
    <NuxtLink to="/">
      <div class="flex gap-4 items-center">
        <!-- logo -->
        <NuxtImg src="/logo.svg" alt="logo" class="w-32" />
      </div>
    </NuxtLink>
    <!-- 右侧 社交图标 -->
    <div class="flex items-center">
      <!-- 夜间模式 -->
      <ColorMode />
      <!-- github -->
      <SocialIcon url="https://github.com/baiwumm/EasyApi" tip="Github" icon="i-simple-icons-github" />
    </div>
  </header>
</template>
<script setup lang="ts">
const colorMode = useColorMode();

// 判断是否暗色模式
const isDark = colorMode.preference === "dark";
</script>
