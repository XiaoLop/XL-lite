import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { MenuType } from '../types/menu.type';

const menuType = Object.values(MenuType).join('|');

export class CreateMenuDto {
    @ApiProperty({
        description: '菜单名称',
    })
    @IsString()
    name!: string;

    @ApiProperty({
        description: '菜单路径',
        required: false,
    })
    @IsString()
    path?: string;

    @ApiProperty({
        description: '菜单图标',
        required: false,
    })
    @IsString()
    icon?: string;

    @ApiProperty({
        description: '组件路由',
        required: false,
    })
    @IsString()
    component?: string;

    @ApiProperty({
        description: '排序',
    })
    @IsNumber()
    sort!: number;

    @ApiProperty({
        description: '权限码',
    })
    @IsString()
    permission_code?: string;

    @ApiProperty({
        description: `菜单类型- ${menuType}`,
    })
    type!: MenuType;

    @ApiProperty({
        description: '父级菜单id',
    })
    @IsNumber()
    parent_id?: number;

    @ApiProperty({
        description: '菜单状态',
    })
    @IsBoolean()
    status?: boolean;
}
