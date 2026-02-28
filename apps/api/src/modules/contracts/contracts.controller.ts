import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { ContractStatus } from '@inf-crm/types';

@Controller('contracts')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ContractsController {
    constructor(private readonly contractsService: ContractsService) { }

    @Post('deal/:dealId')
    create(
        @TenantId() tenantId: string,
        @Param('dealId') dealId: string,
        @Body() body: { fileKey: string; fileName: string; status?: ContractStatus },
    ) {
        return this.contractsService.create(tenantId, dealId, body);
    }

    @Get('generate/:dealId')
    generateAutoContract(@TenantId() tenantId: string, @Param('dealId') dealId: string) {
        return this.contractsService.generateAutoContract(tenantId, dealId);
    }

    @Get('deal/:dealId')
    findAll(@TenantId() tenantId: string, @Param('dealId') dealId: string) {
        return this.contractsService.findAll(tenantId, dealId);
    }

    @Patch(':id/status')
    updateStatus(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body('status') status: ContractStatus,
    ) {
        return this.contractsService.updateStatus(tenantId, id, status);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.contractsService.remove(tenantId, id);
    }
}
