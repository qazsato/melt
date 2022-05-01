import { createRouter } from 'vue-router'
import { PAGE } from '@/constants'
import Main from '@/pages/main.vue'
import Preference from '@/pages/preference.vue'

const routes = [
  { path: '/', name: PAGE.MAIN, component: Main },
  { path: '/preference', name: PAGE.PREFERENCE, component: Preference },
]

// TODO: vue3
// @ts-ignore
export const router = createRouter({ routes })
