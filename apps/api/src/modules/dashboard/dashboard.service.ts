import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, DeliverableStatus } from '@inf-crm/types';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getSummary(tenantId: string) {
        const today = new Date();
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const deliverablesDueToday = await this.prisma.deliverable.count({
            where: {
                tenantId,
                dueDate: { gte: startOfToday, lte: endOfToday },
                status: { not: DeliverableStatus.DONE as any } // Cast for Prisma schema matching enum
            }
        });

        const paymentsDueToday = await this.prisma.payment.count({
            where: {
                tenantId,
                dueDate: { gte: startOfToday, lte: endOfToday },
            }
        });

        const overduePaymentsResult = await this.prisma.payment.findMany({
            where: {
                tenantId,
                status: { in: [PaymentStatus.PENDING as any, PaymentStatus.PARTIAL as any] },
                dueDate: { lt: startOfToday }
            }
        });

        const overduePaymentsCount = overduePaymentsResult.length;
        const overduePaymentsAmount = overduePaymentsResult.reduce((sum, p) => sum + Number(p.amount), 0);

        const recentActivity = await this.prisma.activityLog.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { deal: { select: { title: true } } }
        });

        return {
            todayTasks: {
                deliverablesDue: deliverablesDueToday,
                paymentsDue: paymentsDueToday,
            },
            overduePayments: {
                count: overduePaymentsCount,
                totalAmount: overduePaymentsAmount,
            },
            recentActivity
        };
    }

    async getPipelineStats(tenantId: string) {
        const deals = await this.prisma.deal.groupBy({
            by: ['stage'],
            where: { tenantId },
            _count: { stage: true }
        });

        const pipelineMap: Record<string, number> = {};
        deals.forEach(d => {
            pipelineMap[d.stage as string] = d._count.stage;
        });

        return pipelineMap;
    }
}
