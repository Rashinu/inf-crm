import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('finance')
@UseGuards(JwtAuthGuard, TenantGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get('summary')
    async getSummary(@TenantId() tenantId: string) {
        return this.financeService.getSummary(tenantId);
    }
}
