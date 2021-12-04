import Vue from 'vue'
import router from './router'
import store from './store'
import App from './app.vue'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'
import dotenv from 'dotenv'

Sentry.init({
  Vue,
  dsn: dotenv.config().parsed?.SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
