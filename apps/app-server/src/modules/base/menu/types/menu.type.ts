import { CreateMenuDto } from '../dto/create-menu.dto';

export enum MenuType {
    MENU = 'MENU', // 菜单
    BUTTON = 'BUTTON', // 按钮
    DIRECT = 'DIRECT', // 目录
}

export interface MenuItem extends CreateMenuDto {
    children?: MenuItem[];
}
