import 'dotenv/config'
import { createApp } from 'vue'
import { router } from './router'
import { store } from './store'
import App from './app.vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import '@/assets/styles/element.scss'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/en'
import '@/assets/styles/main.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, { locale })
app.mount('#app')

Object.entries(ElementPlusIconsVue).forEach(([key, value]) => {
  app.component(key, value)
})

Sentry.init({
  app,
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
