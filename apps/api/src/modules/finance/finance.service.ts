import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyService } from './currency.service';

@Injectable()
export class FinanceService {
    constructor(private prisma: PrismaService, private currencyService: CurrencyService) { }

    async getSummary(tenantId: string) {
        // Fetch all payments for tenant
        const payments = await this.prisma.payment.findMany({
            where: { tenantId },
            include: { deal: true }
        });

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let totalExpected = 0;
        let totalCollected = 0;
        let totalOverdue = 0;
        let monthlyRevenue = 0;

        for (const p of payments) {
            const amount = await this.currencyService.convertToTRY(Number(p.amount), p.deal?.currency);
            const paid = await this.currencyService.convertToTRY(Number(p.paidAmount || 0), p.deal?.currency);

            totalExpected += amount;
            totalCollected += paid;

            if (p.status === 'OVERDUE' || (!p.paidAt && new Date(p.dueDate) < now)) {
                totalOverdue += (amount - paid);
            }

            if (p.paidAt && new Date(p.paidAt) >= startOfMonth) {
                monthlyRevenue += paid;
            }
        }

        // Top brands by revenue
        const deals = await this.prisma.deal.findMany({
            where: { tenantId, stage: 'COMPLETED' },
            include: { brand: true },
        });

        const brandRevenue: Record<string, { name: string, value: number }> = {};
        for (const d of deals) {
            if (!brandRevenue[d.brandId]) {
                brandRevenue[d.brandId] = { name: d.brand.name, value: 0 };
            }
            const dealAmount = await this.currencyService.convertToTRY(Number(d.totalAmount || 0), d.currency);
            brandRevenue[d.brandId].value += dealAmount;
        }

        const topBrands = Object.values(brandRevenue)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return {
            totalExpected,
            totalCollected,
            totalOverdue,
            monthlyRevenue,
            topBrands,
            recentPayments: payments
                .filter(p => p.paidAt)
                .sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime())
                .slice(0, 5)
        };
    }
}
