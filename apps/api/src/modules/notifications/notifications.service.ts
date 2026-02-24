import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string, userId: string) {
        return this.prisma.notification.findMany({
            where: { tenantId, userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async getUnreadCount(tenantId: string, userId: string) {
        return this.prisma.notification.count({
            where: { tenantId, userId, readAt: null },
        });
    }

    async markAsRead(tenantId: string, userId: string, id: string) {
        return this.prisma.notification.updateMany({
            where: { id, tenantId, userId },
            data: { readAt: new Date() },
        });
    }

    async markAllAsRead(tenantId: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: { tenantId, userId, readAt: null },
            data: { readAt: new Date() },
        });
    }
}
