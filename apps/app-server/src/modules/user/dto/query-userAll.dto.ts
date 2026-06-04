import { PaginationDto } from 'common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../types/user.type';

const userStatus = Object.values(UserStatus).join(', ');

export class QueryUserAllDto extends PaginationDto {
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
    @IsString({ each: true })
    roles!: string[];
}
