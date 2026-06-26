import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import type { RefreshJwtPayload } from '../types/auth.type';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'), // 从请求体中获取 refresh_token
            secretOrKey: process.env.JWT_REFRESH_SECRET, // 长效的 Refresh Token 密钥
        });
    }

    validate(payload: RefreshJwtPayload) {
        return {
            userId: payload.sub,
            username: payload.username,
            email: payload.email,
        };
    }
}
