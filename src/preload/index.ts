import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 字体处理 API 类型
interface FontStats {
  size: number
  createdAt: Date
  modifiedAt: Date
}

interface SaveFontResult {
  success: boolean
  path?: string
  message?: string
}

interface MinifyResult {
  path: string
  name: string
  size: number
  originalSize: number
  reductionPercent: string
}

// 字体处理 API
const fontAPI = {
  uploadFont: (): Promise<string | null> => ipcRenderer.invoke('upload-font'),
  getFileStats: (filePath: string): Promise<FontStats | null> =>
    ipcRenderer.invoke('get-file-stats', filePath),
  minifyFont: (options: {
    fontPath: string
    text: string
    outputFormat: string
  }): Promise<MinifyResult> => ipcRenderer.invoke('minify-font', options),
  saveFont: (options: { fontPath: string }): Promise<SaveFontResult> =>
    ipcRenderer.invoke('save-font', options)
}

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', fontAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.electronAPI = fontAPI
}
