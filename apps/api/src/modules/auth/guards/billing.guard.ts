import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BillingGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.headers['x-tenant-id'];

    if (!user || !tenantId) {
      return true; // Let the JwtAuthGuard or Tenant access logic handle this
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId as string },
      select: { billingStatus: true, trialEndsAt: true },
    } as any);

    if (!tenant) {
      return true;
    }

    if (tenant.billingStatus === 'TRIAL') {
      if (tenant.trialEndsAt && new Date() > tenant.trialEndsAt) {
        // Return 402 Payment Required specifically so frontend can intercept it and redirect to /billing
        throw new HttpException('TRIAL_EXPIRED', HttpStatus.PAYMENT_REQUIRED);
      }
    } else if (
      tenant.billingStatus === 'PAST_DUE' ||
      tenant.billingStatus === 'CANCELLED'
    ) {
      throw new HttpException(
        'SUBSCRIPTION_INACTIVE',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }
}
