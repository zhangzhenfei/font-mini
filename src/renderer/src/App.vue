<script setup lang="ts">
import ThemeSwitch from './components/ThemeSwitch.vue'
import FontMini from './components/FontMini.vue'
import { ref } from 'vue'

// 应用版本号
const version = ref('1.0.0')
</script>

<template>
  <div class="h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <header
      class="py-3 px-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur-sm shadow-sm dark:shadow-slate-800/30 sticky top-0 z-10"
    >
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <img
            src="./assets/icon.png"
            alt="Font Mini Logo"
            class="w-8 h-8 filter dark:drop-shadow-[0_0_6px_rgba(99,102,241,0.7)] transition-all duration-300"
          />
          <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Font Mini</h1>
        </div>

        <!-- 主题切换按钮 -->
        <div class="flex items-center">
          <ThemeSwitch />
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900">
      <div class="p-4 max-w-4xl mx-auto">
        <FontMini />
      </div>
    </main>

    <!-- 底部状态栏 -->
    <footer
      class="py-2 px-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
    >
      <p>Font Mini v{{ version }}</p>
    </footer>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  background-color: #f9fafb;
  color: #1f2937;
}

/* 确保暗黑模式正确应用 */
html.dark,
html.dark body {
  background-color: #0f172a;
  color: #f9fafb;
}

/* 添加全局过渡效果 */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    fill 0.3s ease,
    box-shadow 0.3s ease;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
}

/* 主题色变量 */
:root {
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;
}

/* 暗色主题变量 */
.dark {
  --color-dark-50: #f9fafb;
  --color-dark-100: #f3f4f6;
  --color-dark-200: #e5e7eb;
  --color-dark-300: #d1d5db;
  --color-dark-400: #9ca3af;
  --color-dark-500: #6b7280;
  --color-dark-600: #4b5563;
  --color-dark-700: #374151;
  --color-dark-800: #1f2937;
  --color-dark-900: #111827;

  /* 深色模式下主题色调整 */
  --color-primary-50: #082f49;
  --color-primary-100: #0c4a6e;
  --color-primary-200: #075985;
  --color-primary-300: #0369a1;
  --color-primary-400: #0284c7;
  --color-primary-500: #0ea5e9;
  --color-primary-600: #38bdf8;
  --color-primary-700: #7dd3fc;
  --color-primary-800: #bae6fd;
  --color-primary-900: #e0f2fe;
}

/* 添加全局过渡效果 */
.h-screen {
  min-height: 100vh;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
