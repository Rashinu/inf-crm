import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user?.role === 'SUPER_ADMIN') {
            return true;
        }

        throw new ForbiddenException('Super Admin access required');
    }
}
