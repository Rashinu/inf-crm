import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MobileService {
    constructor(private prisma: PrismaService) { }

    // 1. Calculate Net Income (with > 100K tax penalty logic)
    calculateNetIncome(grossAmount: number, taxRate: number): number {
        let finalTaxRate = taxRate;

        // Extra tax penalty rule: If income > 100K, tax increases by 5%
        if (grossAmount > 100000) {
            finalTaxRate += 0.05;
        }

        return grossAmount - (grossAmount * finalTaxRate);
    }

    // 2. Late Penalty Check (10% deduction if overdue)
    applyLatePenaltyIfNecessary(netIncome: number, deadline: Date, status: string): number {
        if (status === 'COMPLETED') return netIncome;

        const now = new Date();
        if (now.getTime() > deadline.getTime()) {
            return netIncome * 0.90; // 10% penalty
        }
        return netIncome;
    }

    // 3. Risk Analysis based on PaymentType
    analyzeRisk(paymentType: string): 'LOW' | 'MEDIUM' | 'HIGH' {
        if (paymentType === 'MILESTONE' || paymentType === 'UPFRONT') return 'LOW';
        if (paymentType === 'AFTER_DELIVERY') return 'HIGH';
        return 'MEDIUM';
    }

    // Fetch Contracts mapped for Flutter App
    async getContractsForFlutter(tenantId: string) {
        const deals = await this.prisma.deal.findMany({
            where: { tenantId },
            include: { brand: true, contact: true }
        });

        // Map database Deals to Flutter OOP Contract representation
        return deals.map(deal => {
            const gross = Number(deal.grossAmount) || Number(deal.totalAmount);
            const tax = Number(deal.taxRate) || 0;
            const deadline = deal.deliverableDueDate || new Date();

            let netIncome = this.calculateNetIncome(gross, tax);
            netIncome = this.applyLatePenaltyIfNecessary(netIncome, deadline, deal.stage);

            const risk = this.analyzeRisk(deal.paymentType);
            const isLate = new Date().getTime() > deadline.getTime() && deal.stage !== 'COMPLETED';

            return {
                id: deal.id,
                title: deal.title,
                contractType: deal.contractType, // INFLUENCER, DEVELOPER
                status: deal.stage,
                paymentType: deal.paymentType,
                grossAmount: gross,
                taxRate: tax,
                deadline,
                calculatedNetIncome: netIncome,
                delayedPenaltyApplied: isLate,
                riskLevel: risk,
                // Polymorphic extensions
                influencerData: deal.contractType === 'INFLUENCER' ? {
                    storyCount: deal.storyCount,
                    reelCount: deal.reelCount,
                } : null,
                developerData: deal.contractType === 'DEVELOPER' ? {
                    revisionCount: deal.revisionCount,
                } : null,
                client: {
                    name: deal.brand?.name || 'Unknown',
                }
            };
        });
    }

    async saveDeviceToken(tenantId: string, userId: string, token: string, platform?: string) {
        return this.prisma.deviceToken.upsert({
            where: { token },
            update: { userId, tenantId, platform },
            create: { token, userId, tenantId, platform }
        });
    }
}
