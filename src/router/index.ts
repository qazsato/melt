import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { PAGE } from '@/constants'
import Main from '@/pages/main.vue'
import Preference from '@/pages/preference.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: PAGE.MAIN, component: Main },
  { path: '/preference', name: PAGE.PREFERENCE, component: Preference },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
