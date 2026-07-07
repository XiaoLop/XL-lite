import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Logger,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import type { AccessJwtPayload } from 'modules/base/auth/types/auth.type';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 如果是公开接口，则直接放行
        if (isPublic) return true;

        // 获取请求中的 token
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'] as string;
        if (!authHeader) {
            throw new HttpException(
                'Authorization header is missing',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new HttpException(
                'Token is missing',
                HttpStatus.UNAUTHORIZED,
            );
        }
        try {
            const payload = this.jwtService.verify<AccessJwtPayload>(token);
            request.user = payload;
            return true;
        } catch (error) {
            this.logger.error('Token verification failed', error);
            throw new HttpException(
                'Invalid or expired token',
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
}
