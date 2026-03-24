import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@Req() req) {
    return this.dashboardService.getSummary(req.user.tenantId);
  }

  @Get('analytics')
  getAnalytics(@Req() req) {
    return this.dashboardService.getAnalytics(req.user.tenantId);
  }

  @Get('pipeline')
  getPipelineStats(@Req() req) {
    return this.dashboardService.getPipelineStats(req.user.tenantId);
  }
}
