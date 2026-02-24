import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('deliverables')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DeliverablesController {
    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() dto: CreateDeliverableDto) {
        return this.deliverablesService.create(tenantId, dto);
    }

    @Get()
    findAll(@TenantId() tenantId: string, @Query('dealId') dealId?: string) {
        return this.deliverablesService.findAll(tenantId, dealId);
    }

    @Patch(':id')
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
        return this.deliverablesService.update(tenantId, id, dto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.deliverablesService.remove(tenantId, id);
    }
}
