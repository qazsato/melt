// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv')
process.env.VUE_APP_SENTRY_DSN = dotenv.config().parsed?.SENTRY_DSN
process.env.VUE_APP_MELT_API_KEY = dotenv.config().parsed?.MELT_API_KEY

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      contextIsolation: false,
      builderOptions: {
        mac: {
          icon: 'src/images/icon.icns',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "./src/assets/styles/_variables.scss";`,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        }
      })
  },
}
