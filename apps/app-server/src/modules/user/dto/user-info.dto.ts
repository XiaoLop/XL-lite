import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../types/user.type';

export class UserInfoDto {
    @ApiProperty({
        description: '用户ID',
        required: true,
    })
    @IsString()
    userId!: string;

    @ApiProperty({
        description: '用户名',
        required: true,
    })
    @IsString()
    username!: string;

    @ApiProperty({
        description: '真实姓名',
        required: false,
    })
    @IsOptional()
    @IsString()
    realName?: string;

    @ApiProperty({
        description: '头像',
        required: false,
    })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiProperty({
        description: '用户描述',
        required: false,
    })
    @IsOptional()
    @IsString()
    desc?: string;

    @ApiProperty({
        description: '首页地址',
        required: false,
    })
    @IsOptional()
    @IsString()
    homePath?: string;

    @ApiProperty({
        description: '邮箱',
        required: true,
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        description: '状态',
        required: true,
    })
    status!: UserStatus;

    @ApiProperty({
        description: '角色列表',
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roles?: string[];
}
