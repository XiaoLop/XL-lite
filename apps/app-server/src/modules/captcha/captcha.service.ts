import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from 'modules/redis/redis.service';
import * as svgCaptcha from 'svg-captcha';
import crypto from 'crypto';

@Injectable()
export class CaptchaService {
    constructor(private readonly redisService: RedisService) {}

    // 生成验证码
    async generateCaptcha() {
        const captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            noise: 2, // 干扰线条数量
            color: true, // 是否使用彩色验证码
            background: '#cc9966', // 验证码背景颜色
        });

        // 将验证码文本存储在 Redis 中，设置过期时间为 5 分钟
        const captchaId = crypto.randomUUID();
        // 哈希
        const hash = crypto
            .createHash('sha256')
            .update(captchaId)
            .digest('hex');

        const base64Data = Buffer.from(captcha.data).toString('base64');
        const base64Image = `data:image/svg+xml;base64,${base64Data}`;

        await this.redisService.set(`captcha:${hash}`, captcha.text, 300);
        return { captchaId: hash, captchaImage: base64Image };
    }

    // 校验验证码
    async validateCaptcha(captchaId: string, captcha: string) {
        const redisCaptcha = await this.redisService.get(
            `captcha:${captchaId}`,
        );
        if (!redisCaptcha) {
            throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
        }

        if (redisCaptcha.toLowerCase() !== captcha.toLowerCase()) {
            throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
        }

        // 验证成功后删除验证码
        await this.redisService.del(`captcha:${captchaId}`);
    }
}
