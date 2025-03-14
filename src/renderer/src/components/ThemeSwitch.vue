<template>
  <button
    class="relative overflow-hidden rounded-lg p-2 group transition-all duration-300 ease-in-out hover:scale-105 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700"
    :aria-label="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <!-- 背景动画效果 -->
    <div
      class="absolute inset-0 bg-gradient-to-tr from-sky-400 to-indigo-600 opacity-0 dark:opacity-10 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300"
    ></div>

    <!-- 太阳图标 (浅色模式) -->
    <svg
      v-if="!isDarkMode"
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-yellow-500 transition-transform duration-300 hover:rotate-90"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- 月亮图标 (深色模式) -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-indigo-300 transition-transform duration-300 group-hover:rotate-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>

    <!-- 主题切换提示 -->
    <span
      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    >
      {{ isDarkMode ? '切换到浅色模式' : '切换到深色模式' }}
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ThemeSwitch'
})
</script>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

// 暗黑模式状态
const isDarkMode = ref(false)

// 切换主题
const toggleTheme = (): void => {
  isDarkMode.value = !isDarkMode.value
}

// 监听暗黑模式状态变化并应用主题
watch(
  isDarkMode,
  (newValue) => {
    // 使用requestAnimationFrame确保DOM已更新
    requestAnimationFrame(() => {
      if (newValue) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      // 保存主题设置
      localStorage.setItem('darkMode', newValue ? 'true' : 'false')

      // 使用变量避免 linter 错误
      const height = document.body.offsetHeight
      console.log('Theme changed, reflow enforced, height:', height)
    })
  },
  { immediate: true }
)

// 系统主题变化处理
let mediaQuery: MediaQueryList
const handleSystemThemeChange = (e: MediaQueryListEvent): void => {
  // 只有当用户没有手动设置过主题时才跟随系统变化
  if (localStorage.getItem('darkMode') === null) {
    isDarkMode.value = e.matches
  }
}

onMounted(() => {
  // 初始化主题设置前添加预加载类，防止闪烁
  document.documentElement.classList.add('theme-preload')

  // 等待DOM加载完成后应用主题
  setTimeout(() => {
    // 初始化主题设置
    const savedDarkMode = localStorage.getItem('darkMode')

    if (savedDarkMode === 'true') {
      isDarkMode.value = true
    } else if (savedDarkMode === 'false') {
      isDarkMode.value = false
    } else {
      // 默认使用系统偏好
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDarkMode
    }

    // 监听系统主题变化
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // 移除预加载类，允许过渡效果
    document.documentElement.classList.remove('theme-preload')
  }, 50)
})

onUnmounted(() => {
  // 清理事件监听
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})

// 导出组件状态，使父组件可以访问
defineExpose({
  isDarkMode
})
</script>

<style>
/* 主题过渡期间禁用过渡效果，避免闪烁 */
.theme-preload * {
  transition: none !important;
}

/* 全局主题过渡效果 */
html {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

/* 主题切换按钮特效 */
button {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 深色模式特效 */
.dark button {
  box-shadow: 0 2px 15px rgba(79, 70, 229, 0.2);
}
</style>
