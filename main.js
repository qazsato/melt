const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron')
const fs = require('fs')
const setting = require('./config/setting.json')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    minWidth: 480,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  mainWindow.loadFile('index.html')
  mainWindow.maximize()

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

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
          label: 'New Post',
          accelerator: 'CmdOrCtrl+N',
          click () {
            mainWindow.webContents.send('new-post')
          }
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+P',
          click () {
            mainWindow.webContents.send('open-file')
          }
        },
        { type: 'separator' },
        {
          label: 'Find Text',
          accelerator: 'CmdOrCtrl+F',
          click () {
            mainWindow.webContents.send('search-text')
          }
        },
        {
          label: 'Find Text in folder',
          accelerator: 'CmdOrCtrl+Shift+F',
          click () {
            mainWindow.webContents.send('find-text-in-folder')
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
            mainWindow.webContents.send('toggle-view-mode')
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
        { role: 'front' }
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
    const selected = dialog.showMessageBoxSync({
      message: 'Meltを終了します',
      buttons: ['OK', 'Cancel'],
      cancelId: -1 // Esc押下時の値
    })
    // OK以外は終了させない
    if (selected !== 0) {
      event.preventDefault()
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

// 新規ファイル保存
ipcMain.handle('file-save', async (event, data) => {
  const path = dialog.showSaveDialogSync(mainWindow, {
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
