const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron')
const fs = require('fs')
const setting = require('./config/setting.json')

const windowState = {} // key: win.id, value: object

function createWindow () {
  const win = new BrowserWindow({
    minWidth: 420,
    minHeight: 420,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  win.loadFile('index.html')
  win.maximize()

  win.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }

  win.on('close', (event) => {
    const win = BrowserWindow.getFocusedWindow()
    // win が null なのは、アプリケーション非表示でアプリ終了したケース。
    // そのため win の有無それぞれで、ノートの未保存判定を下記のようにおこなう。
    // 有 : 現在表示しているウィンドウのノートが未保存かどうか
    // 無 : 全ウィンドウのノートに一つでも未保存があるかどうか
    let unsaved
    if (win) {
      unsaved = windowState[win.id] && !windowState[win.id].isNoteSaved
    } else {
      unsaved = Object.values(windowState).some((d) => !d.isNoteSaved)
    }
    if (unsaved) {
      const closable = showCloseConfirm()
      if (closable) {
        const win = BrowserWindow.getFocusedWindow()
        delete windowState[win.id]
      } else {
        event.preventDefault()
      }
    }
  })

  createMenu()
}

function createMenu () {
  const template = [
    {
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New Note',
          accelerator: 'CmdOrCtrl+N',
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.webContents.send('new-note')
          }
        },
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+Shift+N',
          click () {
            createWindow()
          }
        },
        { type: 'separator' },
        {
          label: 'Open Note',
          accelerator: 'CmdOrCtrl+P',
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.webContents.send('open-note')
          }
        },
        { type: 'separator' },
        {
          label: 'Find Paragraph',
          accelerator: 'CmdOrCtrl+Shift+P',
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.webContents.send('find-paragraph')
          }
        },
        {
          label: 'Find Text',
          accelerator: 'CmdOrCtrl+F',
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.webContents.send('find-text')
          }
        },
        {
          label: 'Find Text in folder',
          accelerator: 'CmdOrCtrl+Shift+F',
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.webContents.send('find-text-in-folder')
          }
        }
      ]
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
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle View Mode',
          accelerator: 'CmdOrCtrl+E',
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.webContents.send('toggle-view-mode')
          }
        },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggledevtools' }
      ]
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
          click () {
            const win = BrowserWindow.getFocusedWindow()
            win.setAlwaysOnTop(!win.isAlwaysOnTop())
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'GitHub',
          click () { shell.openExternal('https://github.com/qazsato/melt') }
        }
      ]
    }
  ]

  if (process.env.NODE_ENV === 'development') {
    template[3].submenu.push({ role: 'reload' })
    template[3].submenu.push({ role: 'forcereload' })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
  createWindow()

  app.on('before-quit', function (event) {
    // 一つでも未保存のノートがある場合 confirm を表示する
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
ipcMain.handle('new-note-save', async (event, data) => {
  const win = BrowserWindow.getFocusedWindow()
  const path = dialog.showSaveDialogSync(win, {
    defaultPath: `${setting.directory}/Untitled`,
    filters: [
      { name: 'Text', extensions: ['md'] }
    ],
    properties: ['createDirectory']
  })

  // キャンセルで閉じた場合
  if (path === undefined) {
    return {
      status: undefined
    }
  }

  try {
    fs.writeFileSync(path, data)
    return {
      status: true,
      path: path
    }
  } catch (error) {
    return {
      status: false,
      message: error.message
    }
  }
})

// ノートの保存状態の更新
ipcMain.handle('is-note-changed', async (event, changed) => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return // NOTE: 画像をドラッグ&ドロップした場合はフォーカス状態とならないため null となる
  windowState[win.id] = Object.assign(windowState[win.id] || {}, { isNoteSaved: !changed })
})

function showCloseConfirm () {
  const selected = dialog.showMessageBoxSync({
    message: 'Meltを終了します',
    buttons: ['OK', 'Cancel'],
    cancelId: -1 // Esc押下時の値
  })
  return selected === 0
}
