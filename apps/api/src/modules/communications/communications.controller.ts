import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('communications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CommunicationsController {
    constructor(private readonly communicationsService: CommunicationsService) { }

    @Get()
    findAllByDeal(@TenantId() tenantId: string, @Query('dealId') dealId: string) {
        return this.communicationsService.findAllByDeal(tenantId, dealId);
    }
}
