import { createApp } from 'vue'
import { router } from './router'
import { store } from './store'
import App from './app.vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/en'
import 'element-plus/dist/index.css'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/main.scss'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, { locale })
app.mount('#app')

Sentry.init({
  app,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
