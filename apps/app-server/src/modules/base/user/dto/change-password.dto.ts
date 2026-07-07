import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ description: '旧密码', required: true })
    @IsString()
    oldPassword!: string;

    @ApiProperty({ description: '新密码', required: true })
    @IsString()
    @MinLength(6, { message: '新密码长度不能少于6位' })
    newPassword!: string;
}
