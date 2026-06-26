import { Controller, Get } from '@nestjs/common';
import { ApiResult } from 'common/decorators/api-result.decorator';
import { CaptchaResponseDto } from './dto/captcha.dto';
import { CaptchaService } from './captcha.service';
import { Public } from 'common/decorators/public.decorator';

@Controller()
export class CaptchaController {
    constructor(private readonly captchaService: CaptchaService) {}

    @Get('captcha')
    @Public()
    @ApiResult({
        type: CaptchaResponseDto,
    })
    async getCaptcha() {
        return await this.captchaService.generateCaptcha();
    }
}
