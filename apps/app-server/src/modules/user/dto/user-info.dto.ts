import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserInfoDto {
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
}
