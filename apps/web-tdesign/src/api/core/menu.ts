import { requestClient } from '#/api/request';

export interface MenuListResponse {
  component: string | null;
  icon: string | null;
  id: number;
  name: string;
  parent_id: number;
  path: string;
  permission_code: string;
  sort: number;
  status: boolean;
  type: 'MENU' | 'BUTTON' | 'DIRECT';
}

/**
 * 获取所有菜单（包含禁用）
 */
export async function getMenuListApi() {
  return requestClient.get<MenuListResponse[]>('/menu');
}

/**
 * 获取用户所有活跃菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<MenuListResponse[]>('/menu/all');
}
