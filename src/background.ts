'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import fs from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

const windowState = {} // key: win.id, value: object

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    minWidth: 420,
    minHeight: 420,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.maximize()

  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

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
          label: 'Find Text',
          accelerator: 'CmdOrCtrl+F',
          click() {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return
            win.webContents.send('find-text')
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

app.whenReady().then(async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
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

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
