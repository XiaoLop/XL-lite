import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { RedisModule } from 'modules/redis/redis.module';
import { CaptchaController } from './captcha.controller';

@Module({
    imports: [RedisModule],
    controllers: [CaptchaController],
    providers: [CaptchaService],
    exports: [CaptchaService],
})
export class CaptchaModule {}
