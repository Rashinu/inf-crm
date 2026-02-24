import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // From JWT strategy

        if (!user || !user.tenantId) {
            throw new UnauthorizedException('Tenant context not found');
        }

        // Store tenantId in request for easy access in decorators or services
        request.tenantId = user.tenantId;
        return true;
    }
}
