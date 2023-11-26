import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import fs from 'fs'

const windowState = {} // key: win.id, value: object

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Melt',
    minWidth: 420,
    minHeight: 420,
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  win.maximize()

  win.on('close', (event) => {
    const win = BrowserWindow.getFocusedWindow()
    // win が null なのは、アプリケーション非表示でアプリ終了したケース。
    // そのため win の有無それぞれで、ノートの未保存判定を下記のようにおこなう。
    // 有 : 現在表示しているウィンドウのノートが未保存かどうか
    // 無 : 全ウィンドウのノートに一つでも未保存があるかどうか
    let unsaved
    if (win) {
      // @ts-ignore
      unsaved = windowState[win.id] && !windowState[win.id].isNoteSaved
    } else {
      // @ts-ignore
      unsaved = Object.values(windowState).some((d) => !d.isNoteSaved)
    }
    if (unsaved) {
      const closable = showCloseConfirm()
      if (closable) {
        const win = BrowserWindow.getFocusedWindow()
        // @ts-ignore
        delete windowState[win.id]
      } else {
        event.preventDefault()
      }
    }
  })

  createMenu()
}

app.whenReady().then(async () => {
  createWindow()

  app.on('before-quit', function (event) {
    // 一つでも未保存のノートがある場合 confirm を表示する
    // @ts-ignore
    const unsaved = Object.values(windowState).some((d) => !d.isNoteSaved)
    if (unsaved) {
      const closable = showCloseConfirm()
      if (!closable) {
        event.preventDefault()
      }
    }
  })

  // For Widows and Linux
  // https://www.electronjs.org/docs/tutorial/quick-start#quit-the-app-when-all-windows-are-closed-windows--linux
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

  // For MacOS
  // https://www.electronjs.org/docs/tutorial/quick-start#open-a-window-if-none-are-open-macos
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

function createMenu() {
  const template = [
    {
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        {
          label: 'Preference',
          accelerator: 'CmdOrCtrl+,',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('show-setting')
          },
        },
        { type: 'separator' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'CmdOrCtrl+N',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('new-note')
          },
        },
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+Shift+N',
          click() {
            createWindow()
          },
        },
        { type: 'separator' },
        {
          label: 'Open Note',
          accelerator: 'CmdOrCtrl+P',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('open-note')
          },
        },
        { type: 'separator' },
        {
          label: 'Find Paragraph',
          accelerator: 'CmdOrCtrl+Shift+P',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('find-paragraph')
          },
        },
        {
          label: 'Find Text in folder',
          accelerator: 'CmdOrCtrl+Shift+F',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('find-text-in-folder')
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle View Mode',
          accelerator: 'CmdOrCtrl+E',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('toggle-view-mode')
          },
        },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggledevtools' },
      ],
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { type: 'separator' },
        { role: 'front' },
        {
          type: 'checkbox',
          label: 'Always On Top',
          checked: false,
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.setAlwaysOnTop(!win.isAlwaysOnTop())
          },
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'GitHub',
          click() {
            shell.openExternal('https://github.com/qazsato/melt')
          },
        },
      ],
    },
  ]

  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    template[3].submenu.push({ role: 'reload' })
    // @ts-ignore
    template[3].submenu.push({ role: 'forcereload' })
  }

  // @ts-ignore
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function showCloseConfirm() {
  const selected = dialog.showMessageBoxSync({
    message: 'Meltを終了します',
    buttons: ['OK', 'Cancel'],
    cancelId: -1, // Esc押下時の値
  })
  return selected === 0
}

// 新規ノート保存
ipcMain.handle('new-note-save', async (event, data, directory) => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return
  const path = dialog.showSaveDialogSync(win, {
    defaultPath: `${directory}/Untitled`,
    filters: [{ name: 'Text', extensions: ['md'] }],
    properties: ['createDirectory'],
  })

  // キャンセルで閉じた場合
  if (path === undefined) {
    return {
      status: undefined,
    }
  }

  try {
    fs.writeFileSync(path, data)
    return {
      status: true,
      path: path,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      status: false,
      message: error.message,
    }
  }
})

// ノートの保存状態の更新
ipcMain.handle('is-note-changed', async (event, changed) => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return // NOTE: 画像をドラッグ&ドロップした場合はフォーカス状態とならないため null となる
  // @ts-ignore
  windowState[win.id] = Object.assign(windowState[win.id] || {}, {
    isNoteSaved: !changed,
  })
})
