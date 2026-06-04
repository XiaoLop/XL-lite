import type { MenuItem } from '@/types/menu.type'

/**
 * 生成路由完整路径
 * @param menuList
 * @param parentId
 * @returns
 */
export function getParentPath(menuList: MenuItem[], parentId: number): string {
  const parent = menuList.find((item) => item.id === parentId)
  if (parent) {
    return getParentPath(menuList, parent.parent_id) + '/' + parent.path
  }
  return ''
}

/**
 * 生成路由完整路径
 * @param menuList
 * @param parentId
 * @returns
 */
export function getParentMenu(menuList: MenuItem[], parentId: number): MenuItem[] {
  return menuList.reduce<MenuItem[]>((acc, item) => {
    if (item.id === parentId) {
      acc.push(item)
    }
    return acc
  }, [])
}
