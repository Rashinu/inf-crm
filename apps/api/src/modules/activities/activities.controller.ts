import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('activities')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Get('deal/:dealId')
    findAll(@TenantId() tenantId: string, @Param('dealId') dealId: string) {
        return this.activitiesService.findAll(tenantId, dealId);
    }
}
