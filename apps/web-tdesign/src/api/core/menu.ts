import { requestClient } from '#/api/request';


export interface MenuListResponse {
  component: string | null
  icon: string | null
  id: number
  name: string
  parent_id: number
  path: string
  permission_code: string
  sort: number
  type: 'MENU' | 'BUTTON' | 'DIRECT'
}

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<MenuListResponse[]>('/menu/all');
}
