module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      builderOptions: {
        mac: {
          icon: 'src/images/icon.icns',
        },
      },
    },
  },
}
