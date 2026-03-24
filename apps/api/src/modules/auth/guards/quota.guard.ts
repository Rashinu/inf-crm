import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { PLAN_LIMITS, PlanType } from '../../billing/constants/plan-limits';

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const quotaType = this.reflector.get<string>('quotaType', context.getHandler());
    if (!quotaType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] || request.user?.tenantId;

    if (!tenantId) {
      return true;
    }

    const tenant = await (this.prisma.tenant as any).findUnique({
      where: { id: tenantId },
      select: { planType: true },
    });

    if (!tenant) return true;

    const planType = (tenant.planType || 'FREE') as PlanType;
    const limits = PLAN_LIMITS[planType];

    if (quotaType === 'influencer') {
      const count = await (this.prisma.influencer as any).count({
        where: { tenantId },
      });
      if (count >= limits.maxInfluencers) {
        throw new ForbiddenException(
          `You have reached the limit of ${limits.maxInfluencers} influencers for your ${planType} plan.`,
        );
      }
    }

    if (quotaType === 'campaign') {
      const count = await (this.prisma.deal as any).count({
        where: { tenantId },
      });
      if (count >= limits.maxCampaigns) {
        throw new ForbiddenException(
          `You have reached the limit of ${limits.maxCampaigns} campaigns for your ${planType} plan.`,
        );
      }
    }

    return true;
  }
}
