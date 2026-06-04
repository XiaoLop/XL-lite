export enum MenuType {
  BUTTON = 'BUTTON',
  DIRECT = 'DIRECT',
  MENU = 'MENU',
}

export type MenuItem = {
  id: number
  name: string
  icon: string
  path: string
  component: string
  permission_code?: string
  sort: number
  parent_id: number
  type: MenuType
}
