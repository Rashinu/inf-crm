import { Controller, Get, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, TenantGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    findAll(@TenantId() tenantId: string, @Request() req) {
        return this.notificationsService.findAll(tenantId, req.user.userId);
    }

    @Get('unread-count')
    getUnreadCount(@TenantId() tenantId: string, @Request() req) {
        return this.notificationsService.getUnreadCount(tenantId, req.user.userId).then(count => ({ count }));
    }

    @Patch(':id/read')
    markAsRead(@TenantId() tenantId: string, @Param('id') id: string, @Request() req) {
        return this.notificationsService.markAsRead(tenantId, req.user.userId, id);
    }

    @Patch('read-all')
    markAllAsRead(@TenantId() tenantId: string, @Request() req) {
        return this.notificationsService.markAllAsRead(tenantId, req.user.userId);
    }
}
