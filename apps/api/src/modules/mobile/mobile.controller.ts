import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MobileService } from './mobile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('mobile')
@UseGuards(JwtAuthGuard, TenantGuard)
export class MobileController {
    constructor(private readonly mobileService: MobileService) { }

    @Get('contracts')
    async getContracts(@TenantId() tenantId: string) {
        return this.mobileService.getContractsForFlutter(tenantId);
    }

    @Post('device-token')
    async registerDeviceToken(
        @TenantId() tenantId: string,
        @Req() req,
        @Body('token') token: string,
        @Body('platform') platform?: string,
    ) {
        return this.mobileService.saveDeviceToken(tenantId, req.user.userId, token, platform);
    }
}
