import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    getSummary(@TenantId() tenantId: string) {
        return this.dashboardService.getSummary(tenantId);
    }

    @Get('pipeline')
    getPipelineStats(@TenantId() tenantId: string) {
        return this.dashboardService.getPipelineStats(tenantId);
    }
}
