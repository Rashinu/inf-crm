import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, TenantGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    create(@TenantId() tenantId: string, @Body() dto: CreatePaymentDto) {
        return this.paymentsService.create(tenantId, dto);
    }

    @Get()
    findAll(@TenantId() tenantId: string, @Query('dealId') dealId?: string) {
        return this.paymentsService.findAll(tenantId, dealId);
    }

    @Patch(':id')
    update(@TenantId() tenantId: string, @Param('id') id: string, @Body() dto: any) {
        return this.paymentsService.update(tenantId, id, dto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.paymentsService.remove(tenantId, id);
    }
}
