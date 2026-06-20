import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: '用户名/邮箱',
    })
    @IsString()
    username!: string;

    @ApiProperty({
        description: '密码',
    })
    @IsString()
    password!: string;

    @ApiProperty({
        description: '验证码',
    })
    @IsString()
    captcha!: string;

    @ApiProperty({
        description: '验证码标识',
    })
    @IsString()
    captchaId!: string;
}

export class LoginResultDto {
    @ApiProperty({
        description: 'token',
    })
    accessToken!: string;
}
