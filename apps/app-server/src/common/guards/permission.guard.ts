import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

interface RequestWithUser {
    user?: {
        permissions: string[];
    };
}

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 获取当前处理器或类上定义的权限要求
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSION_KEY,
            [context.getHandler(), context.getClass()],
        );

        // 如果没有权限要求，则直接放行
        if (!requiredPermissions) return true;

        // 获取请求中的用户信息和权限列表
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        // 检查用户是否已登录并且是否具有权限列表
        if (!user || !user.permissions) {
            throw new ForbiddenException(
                'User not authenticated or missing permissions',
            );
        }

        // 处理超级级管理员权限
        if (user.permissions.includes(process.env.SUPER_ADMIN_CODE)) {
            return true;
        }

        // 检查用户是否具有所需的权限
        const hasPermission = requiredPermissions.some((perm) => {
            return user.permissions.includes(perm);
        });

        // 如果用户没有所需的权限，则抛出 ForbiddenException
        if (!hasPermission) {
            throw new ForbiddenException('Unauthorized access');
        }

        return true;
    }
}
