import type { Router } from 'vue-router'

// 路由拦截
export const beforeEach = (router: Router) => {
  // 路由拦截
  router.beforeEach(async (to) => {
    const token = localStorage.getItem('access_token')

    // 未登录且访问非登录页，统一拦截到登录页
    if (!token && to.path !== '/login') {
      return '/login'
    }

    // 已登录且访问登录页，重定向到首页
    if (token && to.path === '/login') {
      return '/'
    }

    return true
  })
}
