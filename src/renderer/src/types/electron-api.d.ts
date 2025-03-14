export interface FontStats {
  size: number
  createdAt: Date
  modifiedAt: Date
}

export interface SaveFontResult {
  success: boolean
  path?: string
  message?: string
}

export interface MinifyResult {
  path: string
  name: string
  size: number
  originalSize: number
  reductionPercent: string
}

export interface ElectronAPI {
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
    electronAPI: ElectronAPI
  }
}
