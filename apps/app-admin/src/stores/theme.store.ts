import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordRaw, RouteLocationNormalized, Router } from 'vue-router'
import { MenuType, type MenuItem } from '@/types/menu.type'
import { getMenusActiveApi } from '@/api/menu'
import { getParentMenu, getParentPath } from '@/utils/tools'

export interface BreadcrumbItem {
  label: string
  icon?: string
  route?: string
  url?: string
  target?: string
}

const views = Object.entries(import.meta.glob('@/views/**/*.vue')).map(([path, component]) => {
  // 剔除 path 中前缀 src/views
  return {
    path: path.replace(/^.*src\/views/, ''),
    component: component,
  }
})

export const useThemeStore = defineStore('theme', () => {
  // 展开菜单状态 false 折叠 true 展开
  const expand = ref(true)
  const dynamicLoaded = ref(false)
  const menuList = ref<MenuItem[]>([
    {
      path: 'icons',
      component: '/Icons/index.vue',
      name: 'Icons',
      icon: 'pi pi-fw pi-star',
      sort: 9999,
      parent_id: 0,
      type: MenuType.MENU,
      id: 99999999,
    },
  ])
  // 面包屑列表
  const breadcrumbs = ref<BreadcrumbItem[]>([])
  /**
   * 切换展开菜单状态
   */
  const toggleExpand = () => {
    expand.value = !expand.value
  }

  /**
   * 根据当前路由生成面包屑
   */
  const generateBreadcrumbs = (route: RouteLocationNormalized) => {
    const currentMenu = menuList.value.find((item) => item.id === route.meta.id)
    const parentId: number = route.meta.parentId as number

    const matchedMenu = [currentMenu, ...getParentMenu(menuList.value, parentId)].reverse()
    breadcrumbs.value = matchedMenu.map((item) => ({
      label: item!.name,
      icon: item?.icon ? `pi pi-${item.icon}` : undefined,
      route: item?.component
        ? getParentPath(menuList.value, item!.parent_id) + '/' + item!.path
        : undefined,
    }))
  }

  /**
   * 根据路由路径查找菜单项
   */
  const findMenuByPath = (path: string, menus: RouteRecordRaw[]): RouteRecordRaw | null => {
    for (const menu of menus) {
      if (menu.path === path) {
        return menu
      }
      if (menu.children) {
        const found = findMenuByPath(path, menu.children)
        if (found) return found
      }
    }
    return null
  }

  // 获取菜单列表
  const getMenuList = async () => {
    const result = await getMenusActiveApi()
    menuList.value.push(...result.data)
  }

  // 加载动态路由
  const loadDynamicRoutes = async (router: Router) => {
    try {
      if (localStorage.getItem('access_token')) {
        await getMenuList()

        const menus = menuList.value

        menus.forEach((item) => {
          // 判断 item.component 是否在 views 中
          const route = views.find((v) => v.path === item.component)
          if (route) {
            const path = getParentPath(menus, item.parent_id) + '/' + item.path
            router.addRoute('layout', {
              ...route,
              path,
              meta: {
                id: item.id,
                title: item.name,
                icon: item.icon,
                auth: true,
                isMenu: true,
                permission_code: item.permission_code,
                parentId: item.parent_id,
                sort: item.sort,
              },
            })
          }
        })

        const homeRoute = menus[0]

        router.addRoute('layout', {
          path: '/',
          redirect: homeRoute
            ? getParentPath(menus, homeRoute.parent_id) + '/' + homeRoute.path
            : '/404',
        })

        if (!router.hasRoute('NotFound')) {
          router.addRoute({
            name: 'NotFound',
            path: '/:pathMatch(.*)*',
            redirect: '/404',
          })
        }

        dynamicLoaded.value = true
      }
    } catch (error) {
      // 清除token
      localStorage.removeItem('access_token')
    }
  }

  return {
    dynamicLoaded,
    menuList,
    getMenuList,
    expand,
    toggleExpand,
    breadcrumbs,
    generateBreadcrumbs,
    findMenuByPath,
    loadDynamicRoutes,
  }
})
