import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import log from 'electron-log'

// 配置日志
log.transports.file.level = 'info'
log.transports.console.level = 'info'
// 设置控制台输出编码为UTF-8
log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
log.transports.console.useStyles = true

// 替换控制台日志，确保所有日志都会写入到文件
console.log = log.info
console.error = log.error
console.warn = log.warn
console.info = log.info

// 尝试加载fontmin模块
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fontmin: any = null

// 动态导入 fontmin
const loadFontmin = async (): Promise<void> => {
  try {
    const fontminModule = await import('fontmin')
    fontmin = fontminModule.default || fontminModule
    console.log('fontmin加载成功')
  } catch (error: unknown) {
    const err = error as Error
    console.error('fontmin模块加载失败:', err)

    try {
      // 尝试从extraResources加载
      const resourcePath = path.join(process.resourcesPath, 'app/node_modules/fontmin')
      console.log('尝试从resources加载fontmin:', resourcePath)

      const fontminModule = await import(resourcePath)
      fontmin = fontminModule.default || fontminModule
      console.log('从resources加载fontmin成功')
    } catch (err: unknown) {
      const error = err as Error
      console.error('从resources加载fontmin失败:', error)
    }
  }
}

// 加载 fontmin
loadFontmin()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// 处理字体上传
ipcMain.handle('upload-font', async () => {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (!mainWindow) return null

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: '字体文件', extensions: ['ttf', 'otf', 'woff', 'woff2'] }]
  })

  return result.canceled ? null : result.filePaths[0]
})

// 获取文件统计信息
ipcMain.handle('get-file-stats', async (_, filePath) => {
  try {
    const stats = fs.statSync(filePath)
    return {
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    }
  } catch (error) {
    console.error('获取文件信息失败:', error)
    return null
  }
})

// 处理字体精简
ipcMain.handle('minify-font', async (_, { fontPath, text, outputFormat }) => {
  // 检查fontmin模块是否可用
  if (!fontmin) {
    throw new Error('FontMin模块未加载，无法处理字体。请确保应用正确安装。')
  }

  try {
    // 创建临时目录用于存储处理后的文件
    const tmpDir = path.join(app.getPath('temp'), 'fontmin-' + Date.now())
    fs.mkdirSync(tmpDir, { recursive: true })

    // 创建输出文件名
    const originalFilename = path.basename(fontPath)
    const fileNameWithoutExt = path.parse(originalFilename).name
    const outputFileName = `${fileNameWithoutExt}-subset.${outputFormat || 'ttf'}`

    // 使用 fontmin 处理字体
    const fm = new fontmin().src(fontPath).use(
      fontmin.glyph({
        text: text,
        hinting: true
      })
    )

    // 根据输出格式添加相应转换器
    if (outputFormat === 'woff') {
      fm.use(fontmin.ttf2woff())
    } else if (outputFormat === 'woff2') {
      fm.use(fontmin.ttf2woff2())
    } else if (outputFormat === 'eot') {
      fm.use(fontmin.ttf2eot())
    } else if (outputFormat === 'svg') {
      fm.use(fontmin.ttf2svg())
    }

    fm.dest(tmpDir)

    // 执行字体处理
    return new Promise((resolve, reject) => {
      fm.run((err, files) => {
        if (err) {
          console.error('字体处理错误:', err)
          reject(err)
          return
        }

        // 返回处理结果
        const resultFile = files.find(
          (file) => file.path.includes(outputFileName) || file.path.endsWith(`.${outputFormat}`)
        )

        if (!resultFile) {
          reject(new Error('未能生成有效的字体文件'))
          return
        }

        const resultPath = resultFile.path
        const resultSize = fs.statSync(resultPath).size
        const originalSize = fs.statSync(fontPath).size

        resolve({
          path: resultPath,
          name: path.basename(resultPath),
          size: resultSize,
          originalSize: originalSize,
          reductionPercent: (((originalSize - resultSize) / originalSize) * 100).toFixed(2)
        })
      })
    })
  } catch (error) {
    console.error('字体处理过程中发生错误:', error)
    throw error
  }
})

// 处理字体保存
ipcMain.handle('save-font', async (_, { fontPath }) => {
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (!mainWindow) return null

  try {
    const defaultName = path.basename(fontPath)

    const result = await dialog.showSaveDialog(mainWindow, {
      title: '保存字体文件',
      defaultPath: defaultName,
      filters: [{ name: '字体文件', extensions: [path.extname(defaultName).substring(1)] }]
    })

    if (result.canceled || !result.filePath) {
      return { success: false, message: '用户取消保存' }
    }

    // 拷贝文件
    fs.copyFileSync(fontPath, result.filePath)

    return {
      success: true,
      path: result.filePath,
      message: '文件保存成功'
    }
  } catch (error: unknown) {
    const err = error as Error
    console.error('保存文件错误:', err)
    return {
      success: false,
      message: `保存文件失败: ${err.message}`
    }
  }
})
