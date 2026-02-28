import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivityType } from '@inf-crm/types';
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

    @Post('deal/:dealId/note')
    addNote(
        @TenantId() tenantId: string,
        @Param('dealId') dealId: string,
        @Body() body: { message: string }
    ) {
        return this.activitiesService.log({
            tenantId,
            dealId,
            type: ActivityType.NOTE_ADDED,
            message: body.message,
        });
    }
}
