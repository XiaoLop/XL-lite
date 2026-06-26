import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { AccessJwtPayload } from '../types/auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET, // Access Token 密钥
        });
    }

    validate(payload: AccessJwtPayload) {
        // 类型检查后返回用户信息
        if (
            !payload.sub ||
            !payload.username ||
            !payload.email ||
            !payload.permissions
        ) {
            throw new Error('Invalid token payload');
        }

        return {
            userId: payload.sub,
            username: payload.username,
            email: payload.email,
            permissions: payload.permissions,
        };
    }
}
