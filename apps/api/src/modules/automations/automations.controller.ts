import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('automations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AutomationsController {
    constructor(private readonly automationsService: AutomationsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() createAutomationDto: CreateAutomationDto) {
        return this.automationsService.create(tenantId, createAutomationDto);
    }

    @Get()
    findAll(@TenantId() tenantId: string) {
        return this.automationsService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.automationsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateAutomationDto: UpdateAutomationDto,
    ) {
        return this.automationsService.update(tenantId, id, updateAutomationDto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.automationsService.remove(tenantId, id);
    }
}
