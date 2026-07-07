import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
    @ApiProperty({ description: '真实姓名', required: false })
    @IsOptional()
    @IsString()
    realName?: string;

    @ApiProperty({ description: '邮箱', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: '个人简介', required: false })
    @IsOptional()
    @IsString()
    desc?: string;

    @ApiProperty({ description: '头像', required: false })
    @IsOptional()
    @IsString()
    avatar?: string;
}
