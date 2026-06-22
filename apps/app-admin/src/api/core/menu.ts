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

export interface CreateMenuDto {
  name: string;
  path?: string;
  icon?: string;
  component?: string;
  sort: number;
  permission_code: string;
  type: 'MENU' | 'BUTTON' | 'DIRECT';
  parent_id: number;
  status: boolean;
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {
  id: number;
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

/**
 * 创建菜单
 */
export async function createMenuApi(data: CreateMenuDto) {
  return requestClient.post('/menu', data);
}

/**
 * 更新菜单
 */
export async function updateMenuApi(data: UpdateMenuDto) {
  return requestClient.post(`/menu/${data.id}`, data);
}

/**
 * 删除菜单
 */
export async function deleteMenuApi(id: number) {
  return requestClient.delete(`/menu/${id}`);
}
