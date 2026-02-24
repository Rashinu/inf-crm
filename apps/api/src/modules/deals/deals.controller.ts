import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('deals')
@UseGuards(JwtAuthGuard, TenantGuard)
export class DealsController {
    constructor(private readonly dealsService: DealsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() createDealDto: CreateDealDto) {
        return this.dealsService.create(tenantId, createDealDto);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.dealsService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.dealsService.findOne(tenantId, id);
    }

    @Patch(':id/stage')
    updateStage(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateDealStageDto: UpdateDealStageDto,
    ) {
        return this.dealsService.updateStage(tenantId, id, updateDealStageDto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.dealsService.remove(tenantId, id);
    }
}
