import type { MenuItem } from '@/types/menu.type'
import type { HttpResponse } from '@/types/request.type'
import { request } from '@/utils/request'

// 创建菜单的请求体类型
export interface CreateMenuDto {
  name: string
  icon?: string
  path?: string
  component?: string
  permission_code?: string
  sort?: number
  parent_id?: number
  type?: string
}

// 更新菜单的请求体类型（所有字段可选）
export interface UpdateMenuDto {
  name?: string
  icon?: string
  path?: string
  component?: string
  permission_code?: string
  sort?: number
  parent_id?: number
  type?: string
}

/**
 * 获取所有菜单
 * @returns 菜单列表
 */
export const getMenusApi = async (): Promise<HttpResponse<MenuItem[]>> => {
  return request.get<undefined, MenuItem[]>('/menu')
}

/**
 * 获取活跃菜单
 * @returns 活跃菜单列表
 */
export const getMenusActiveApi = async () => {
  return request.get<undefined, MenuItem[]>('/menu/active')
}

/**
 * 获取指定菜单
 * @param id 菜单ID
 * @returns 菜单详情
 */
export const getMenuByIdApi = async (id: string | number) => {
  return request.get<undefined, MenuItem>(`/menu/${id}`)
}

/**
 * 创建菜单
 * @param data 菜单数据
 * @returns 创建结果
 */
export const createMenuApi = async (data: CreateMenuDto) => {
  return request.post<CreateMenuDto, MenuItem>('/menu', data)
}

/**
 * 更新菜单
 * @param id 菜单ID
 * @param data 更新的菜单数据
 * @returns 更新结果
 */
export const updateMenuApi = async (id: string | number, data: UpdateMenuDto) => {
  return request.patch<UpdateMenuDto, MenuItem>(`/menu/${id}`, data)
}

/**
 * 删除菜单
 * @param id 菜单ID
 * @returns 删除结果
 */
export const deleteMenuApi = async (id: string | number) => {
  return request.delete<undefined, null>(`/menu/${id}`)
}
