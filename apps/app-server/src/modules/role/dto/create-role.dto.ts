import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({
        description: '角色名称',
    })
    @IsString({
        message: '角色名称只能是字符串',
    })
    name!: string;

    @ApiProperty({
        description: '角色标识',
    })
    @IsString({
        message: '角色标识只能是字符串',
    })
    code!: string; // 角色标识

    @ApiProperty({
        description: '权限列表',
    })
    @IsArray({
        message: '权限列表只能是数组',
    })
    @IsNumber(
        {
            allowNaN: false, // 允许数字，但不允许 NaN
        },
        {
            message: '权限列表只能是数字',
            each: true,
        },
    )
    permissionIds!: number[];
}
