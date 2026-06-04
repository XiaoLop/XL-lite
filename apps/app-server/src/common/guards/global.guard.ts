import { CanActivate, Injectable, type ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { PermissionGuard } from './permission.guard';

@Injectable()
export class GlobalGuard implements CanActivate {
    constructor(
        private readonly authGuard: AuthGuard,
        private readonly permissionGuard: PermissionGuard,
    ) {}
    canActivate(context: ExecutionContext): boolean {
        // 先执行 AuthGuard 进行认证
        const isAuthenticated = this.authGuard.canActivate(context);
        if (!isAuthenticated) {
            return false;
        }
        // 认证通过后执行 PermissionGuard 进行权限检查
        return this.permissionGuard.canActivate(context);
    }
}
