import { ApiProperty } from '@nestjs/swagger';

export class CaptchaResponseDto {
    @ApiProperty({
        description: '验证码标识',
    })
    captchaId!: string;

    @ApiProperty({
        description: '验证码图片',
    })
    captchaImage!: string;
}
