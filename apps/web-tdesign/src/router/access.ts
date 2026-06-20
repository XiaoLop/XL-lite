import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent
} from '@vben/types';
import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { message } from '#/adapter/tdesign';
import { getAllMenusApi, type MenuListResponse } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');


// 处理菜单格式
function handleMenu(menuList: MenuListResponse[]): RouteRecordStringComponent[] {
  // 过滤按钮权限，只保留菜单和目录
  const menus = menuList.filter((item) => item.type !== 'BUTTON');

  // 递归构建路由树
  function buildTree(parentId: number): RouteRecordStringComponent[] {
    return menus
      .filter((item) => item.parent_id === parentId)
      .sort((a, b) => a.sort - b.sort)
      .map((item) => {
        const children = buildTree(item.id);

        const route: RouteRecordStringComponent = {
          name: item.name,
          path: item.path,
          meta: {
            ...(item.icon ? { icon: item.icon } : {}),
            title: item.name,
            order: item.sort,
          },
          component:
            item.type === 'DIRECT'
              ? 'BasicLayout'
              : item.component || 'IFrameView',
        };

        if (children.length > 0) {
          route.children = children;
        }

        return route;
      });
  }

  const accessibleRoutes = buildTree(0);
  console.log('accessibleRoutes', accessibleRoutes);
  return accessibleRoutes;
}


async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1500,
      });
      return handleMenu(await getAllMenusApi());
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
