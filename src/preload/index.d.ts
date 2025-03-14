import { ElectronAPI } from '@electron-toolkit/preload'

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

interface FontAPI {
  uploadFont: () => Promise<string | null>
  getFileStats: (filePath: string) => Promise<FontStats | null>
  minifyFont: (options: {
    fontPath: string
    text: string
    outputFormat: string
  }) => Promise<MinifyResult>
  saveFont: (options: { fontPath: string }) => Promise<SaveFontResult>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    electronAPI: FontAPI
  }
}
