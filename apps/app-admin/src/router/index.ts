import { createRouter, createWebHistory } from 'vue-router'
import { beforeEach } from './permission'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layout/index.vue'),
      children: [],
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
})

beforeEach(router)

export default router
