<template>
  <div class="max-w-4xl mx-auto">
    <!-- 标题与介绍 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">字体精简工具</h1>
      <p class="text-gray-600 dark:text-gray-300">
        上传字体文件，输入需要保留的文字，一键精简字体文件
      </p>
    </div>

    <!-- 卡片容器 -->
    <div class="card mb-6 p-6 rounded-lg shadow-lg bg-white dark:bg-slate-800 highlight-effect">
      <!-- 上传字体区域 -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">上传字体</h2>

        <div
          v-if="!fontFile"
          class="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50/30 dark:hover:bg-primary-900/30 transition-colors flex flex-col items-center justify-center"
          @click="uploadFont"
        >
          <div
            class="mb-4 flex justify-center bg-primary-100/50 dark:bg-primary-900/50 p-3 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p class="text-primary-600 dark:text-primary-400 font-medium mb-2">点击上传字体文件</p>
          <p class="text-sm text-gray-600 dark:text-gray-400">支持 TTF, OTF, WOFF, WOFF2 格式</p>
        </div>

        <div
          v-else
          class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 flex items-center justify-between"
        >
          <div class="flex items-center">
            <div class="bg-primary-100 dark:bg-primary-900/50 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-primary-600 dark:text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-800 dark:text-gray-200">{{ fontFile.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatFileSize(fontFile.size) }}
              </p>
            </div>
          </div>
          <button
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors text-gray-600 dark:text-gray-300"
            @click="resetFont"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 输入文字区域 -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">要保留的文字</h2>
        <textarea
          v-model="text"
          class="input min-h-[150px] resize-y dark:bg-dark-800 dark:border-dark-700 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="输入需要保留的文字，例如：你好，世界！"
          :disabled="!fontFile || isProcessing"
        ></textarea>
        <div class="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>已输入 {{ text.length }} 个字符</span>
          <button
            v-if="text.length > 0"
            class="text-primary-600 dark:text-primary-400 hover:underline"
            :disabled="!fontFile || isProcessing"
            @click="text = ''"
          >
            清空
          </button>
        </div>
      </div>

      <!-- 输出格式选择 -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">输出格式</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="format in outputFormats"
            :key="format.value"
            class="border rounded-lg p-3 cursor-pointer transition-all flex flex-col items-center justify-center"
            :class="[
              selectedFormat === format.value
                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500 dark:ring-primary-400'
                : 'border-gray-300 dark:border-dark-600 hover:border-gray-400 dark:hover:border-dark-500 bg-white dark:bg-slate-800'
            ]"
            :aria-selected="selectedFormat === format.value"
            role="option"
            @click="selectFormat(format.value)"
          >
            <span
              class="text-center font-medium"
              :class="
                selectedFormat === format.value
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300'
              "
            >
              {{ format.label }}
            </span>
            <span class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{
              format.description
            }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center">
        <button
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg flex items-center space-x-2 px-6 py-3 text-lg"
          :disabled="!fontFile || !text || isProcessing"
          :class="{ 'opacity-50 cursor-not-allowed': !fontFile || !text || isProcessing }"
          @click="processFont"
        >
          <span v-if="isProcessing">处理中...</span>
          <span v-else>精简字体</span>
          <svg
            v-if="!isProcessing"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <svg
            v-else
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 处理结果 -->
    <div
      v-if="result"
      class="border border-green-200 dark:border-green-900 rounded-lg p-6 mb-6 bg-white dark:bg-gray-800"
    >
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-green-600 dark:text-green-400 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        处理结果
      </h2>

      <div class="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            class="p-3 bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-600"
          >
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">原始文件</p>
            <p class="font-medium text-gray-800 dark:text-gray-200">
              {{ formatFileSize(result.originalSize) }}
            </p>
          </div>
          <div
            class="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800"
          >
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">精简后</p>
            <div class="flex items-center">
              <p class="font-medium text-green-600 dark:text-green-400">
                {{ formatFileSize(result.size) }}
              </p>
              <span
                class="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full"
                >减小 {{ result.reductionPercent }}%</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-6 py-3 w-full sm:w-auto flex justify-center items-center space-x-2"
          @click="downloadFont"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>下载字体文件</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// 声明 window.electronAPI 类型，确保与实际 API 完全匹配
declare global {
  interface Window {
    electronAPI: {
      uploadFont: () => Promise<string | null>
      getFileStats: (path: string) => Promise<{ size: number }>
      minifyFont: (options: {
        fontPath: string
        text: string
        hinting: boolean
        subsetMode: string
      }) => Promise<{
        success: boolean
        path: string
        message: string
      }>
      saveFont: (options: { fontPath: string }) => Promise<{
        success: boolean
        path: string
        message: string
      }>
    }
  }
}

export default defineComponent({
  name: 'FontMini'
})
</script>

<script setup lang="ts">
import { ref } from 'vue'

interface FontFile {
  name: string
  size: number
  path: string
}

interface Result {
  path: string
  name: string
  size: number
  originalSize: number
  reductionPercent: string
}

interface FormatOption {
  label: string
  value: string
  description: string
}

// 字体文件
const fontFile = ref<FontFile | null>(null)
// 字体路径
const fontPath = ref('')
// 输入的文字
const text = ref('')
// 选择的输出格式
const selectedFormat = ref('ttf')
// 处理状态
const isProcessing = ref(false)
// 处理结果
const result = ref<Result | null>(null)

// 输出格式选项
const outputFormats: FormatOption[] = [
  { label: 'TTF', value: 'ttf', description: '常用格式' },
  { label: 'WOFF', value: 'woff', description: '网页字体' },
  { label: 'WOFF2', value: 'woff2', description: '最小体积' },
  { label: 'EOT', value: 'eot', description: 'IE 兼容' }
]

// 上传字体
const uploadFont = async (): Promise<void> => {
  try {
    const filePath = await window.electronAPI.uploadFont()
    if (filePath) {
      // 文件信息获取
      const name = filePath.split('/').pop() || filePath.split('\\').pop() || ''
      const stats = await window.electronAPI.getFileStats(filePath)

      fontFile.value = {
        name: name,
        size: stats ? stats.size : 0,
        path: filePath
      }

      fontPath.value = filePath
    }
  } catch (error) {
    console.error('上传字体失败:', error)
    alert('上传字体失败: ' + (error as Error).message)
  }
}

// 重置字体
const resetFont = (): void => {
  fontFile.value = null
  fontPath.value = ''
  result.value = null
}

// 处理字体
const processFont = async (): Promise<void> => {
  if (!fontFile.value || !text.value) return

  isProcessing.value = true

  try {
    const res = await window.electronAPI.minifyFont({
      fontPath: fontPath.value,
      text: text.value,
      hinting: true,
      subsetMode: selectedFormat.value
    })

    if (res.success) {
      // 转换返回结果为所需类型
      const newFileName = res.path.split('/').pop() || res.path.split('\\').pop() || ''
      const stats = await window.electronAPI.getFileStats(res.path)

      result.value = {
        path: res.path,
        name: newFileName,
        size: stats ? stats.size : 0,
        originalSize: fontFile.value.size,
        reductionPercent: calculateReductionPercent(fontFile.value.size, stats ? stats.size : 0)
      }
    } else {
      console.error('处理字体失败:', res.message)
      alert('处理字体失败: ' + res.message)
    }
  } catch (error) {
    console.error('处理字体失败:', error)
    alert('处理字体失败: ' + (error as Error).message)
  } finally {
    isProcessing.value = false
  }
}

// 计算减小百分比
const calculateReductionPercent = (originalSize: number, newSize: number): string => {
  if (originalSize === 0) return '0'
  const percent = ((originalSize - newSize) / originalSize) * 100
  return percent.toFixed(1)
}

// 下载字体
const downloadFont = async (): Promise<void> => {
  if (!result.value) return

  try {
    const res = await window.electronAPI.saveFont({
      fontPath: result.value.path
    })

    if (res.success) {
      console.log('字体保存成功:', res.path)
    } else {
      console.error('字体保存失败:', res.message)
      alert('保存失败: ' + res.message)
    }
  } catch (error) {
    console.error('保存字体错误:', error)
    alert('保存字体出错: ' + (error as Error).message)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 选择格式
const selectFormat = (value: string): void => {
  selectedFormat.value = value
}
</script>

<style scoped>
/* Card 样式 */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm dark:shadow-lg dark:shadow-gray-900/30;
}

/* 按钮样式 */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .btn-primary {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(14, 165, 233, 0.2);
}

/* 输入框样式 */
.input {
  @apply w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white;
}

/* 深色模式下特殊效果 */
.dark .card {
  background: rgba(30, 41, 59, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dark .bg-primary-50\/30 {
  background-color: rgba(8, 47, 73, 0.3);
}

/* 深色模式下的悬停效果 */
.dark .border-dashed:hover {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}

/* 输出格式选择项的悬停效果 */
.dark [role='option']:hover {
  transform: translateY(-2px);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* 深色模式下按钮样式优化 */
.dark .btn {
  background: rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  border: 1px solid rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
}

.dark .btn:hover {
  background: rgba(99, 102, 241, 0.3);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
}

/* 深色模式下输入框样式优化 */
.dark input,
.dark textarea,
.dark select {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(148, 163, 184, 0.2);
  color: #e2e8f0;
}

.dark input:focus,
.dark textarea:focus,
.dark select:focus {
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* 深色模式下的特殊效果 */
.dark .highlight-effect {
  position: relative;
  overflow: hidden;
}

.dark .highlight-effect::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.dark .highlight-effect:hover::before {
  opacity: 1;
}

/* 深色模式下的字体预览优化 */
.dark .font-preview {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

/* 深色模式下的文字渐变效果 */
.dark .gradient-text {
  background: linear-gradient(to right, #818cf8, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
