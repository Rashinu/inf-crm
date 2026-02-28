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
                status: { not: DeliverableStatus.DONE as any }
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

        // Advanced Metrics (Patron Paneli)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        // 1. Monthly Revenue (Payments PAID this month) // Using createdAt or updatedAt as proxy for when it was paid if we don't have paidAt
        const monthlyPayments = await this.prisma.payment.findMany({
            where: {
                tenantId,
                status: PaymentStatus.PAID as any,
                updatedAt: { gte: startOfMonth, lte: endOfMonth }
            }
        });
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

        // 2. Active Pipeline Value
        const activeDeals = await this.prisma.deal.findMany({
            where: {
                tenantId,
                stage: { notIn: ['COMPLETED', 'LOST', 'CANCELLED'] }
            }
        });
        const activePipelineValue = activeDeals.reduce((sum, d) => sum + Number(d.totalAmount), 0);
        const activeDealsCount = activeDeals.length;

        // 3. Win Rate
        const totalClosedDeals = await this.prisma.deal.count({
            where: {
                tenantId,
                stage: { in: ['COMPLETED', 'LOST', 'CANCELLED'] }
            }
        });
        const wonDeals = await this.prisma.deal.count({
            where: {
                tenantId,
                stage: 'COMPLETED'
            }
        });
        const winRate = totalClosedDeals > 0 ? Math.round((wonDeals / totalClosedDeals) * 100) : 0;

        return {
            todayTasks: {
                deliverablesDue: deliverablesDueToday,
                paymentsDue: paymentsDueToday,
            },
            overduePayments: {
                count: overduePaymentsCount,
                totalAmount: overduePaymentsAmount,
            },
            advanced: {
                monthlyRevenue,
                activePipelineValue,
                activeDealsCount,
                winRate
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
