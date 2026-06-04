import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { UserStatus } from '../types/user.type';

const userStatus = Object.values(UserStatus).join(', ');

export class CreateUserDto {
    @ApiProperty({
        description: '用户名',
        required: true,
    })
    @IsOptional()
    @IsString()
    username!: string;

    @ApiProperty({
        description: '密码',
        required: true,
    })
    @IsOptional()
    @IsString()
    password!: string;

    @ApiProperty({
        description: '邮箱',
        required: true,
    })
    @IsOptional()
    @IsEmail()
    email!: string;

    @ApiProperty({
        description: `状态 - ${userStatus}`,
        required: false,
    })
    @IsOptional()
    @IsString()
    status!: UserStatus;

    @ApiProperty({
        description: '角色',
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsNumber(
        {
            allowNaN: false,
        },
        {
            message: '角色ID只能是数字',
            each: true,
        },
    )
    roleIds!: number[];
}
