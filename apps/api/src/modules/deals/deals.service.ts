import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';
import { ActivitiesService } from '../activities/activities.service';
import { ActivityType } from '@inf-crm/types';

@Injectable()
export class DealsService {
    constructor(
        private prisma: PrismaService,
        private activities: ActivitiesService,
    ) { }

    async create(tenantId: string, dto: CreateDealDto) {
        // Verify brand belongs to tenant
        const brand = await this.prisma.brand.findFirst({
            where: { id: dto.brandId, tenantId },
        });
        if (!brand) throw new NotFoundException('Brand not found');

        const { value, description, ...rest } = dto;

        const deal = await (this.prisma.deal as any).create({
            data: {
                ...rest,
                totalAmount: value || 0,
                notes: description,
                tenantId,
            },
            include: {
                brand: { select: { name: true } },
            },
        });

        await this.activities.log({
            tenantId,
            dealId: deal.id,
            type: ActivityType.STAGE_CHANGED,
            message: `Deal created in stage ${deal.stage || 'LEAD'}`,
        });

        return deal;
    }

    async findAll(tenantId: string) {
        return (this.prisma.deal as any).findMany({
            where: { tenantId },
            include: {
                brand: { select: { name: true } },
                contact: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const deal = await (this.prisma.deal as any).findFirst({
            where: { id, tenantId },
            include: {
                brand: true,
                contact: true,
                deliverables: true,
                payments: true,
            },
        });

        if (!deal) throw new NotFoundException('Deal not found');

        // Phase 9: Deal Scoring Logic
        let score = 50;

        if (deal.stage === 'NEGOTIATION') score += 10;
        else if (deal.stage === 'APPROVED') score += 20;
        else if (deal.stage === 'IN_PRODUCTION' || deal.stage === 'POSTED') score += 30;
        else if (deal.stage === 'SCHEDULED') score += 40;
        else if (deal.stage === 'COMPLETED') score += 50;
        else if (deal.stage === 'DELAYED') score -= 20;
        else if (deal.stage === 'LOST' || deal.stage === 'CANCELLED') score = 0;

        if (deal.paymentType === 'UPFRONT') score += 15;
        if (deal.paymentType === 'AFTER_DELIVERY') score -= 15;

        // Cap score
        if (score > 100) score = 100;
        if (score < 0) score = 0;

        return {
            ...deal,
            dealScore: score, // Return dynamically calculated score
            predictionMessage: score >= 80 ? "High Likelihood to Close & Get Paid" : score <= 30 ? "High Risk Deal" : "Normal Risk"
        };
    }

    async updateStage(tenantId: string, id: string, dto: UpdateDealStageDto) {
        const deal = await this.findOne(tenantId, id);

        const updated = await this.prisma.deal.update({
            where: { id: deal.id },
            data: { stage: dto.stage },
        });

        await this.activities.log({
            tenantId,
            dealId: id,
            type: ActivityType.STAGE_CHANGED,
            message: `Stage changed from ${deal.stage} to ${dto.stage}`,
        });

        return updated;
    }

    async remove(tenantId: string, id: string) {
        const deal = await this.findOne(tenantId, id);
        return this.prisma.deal.delete({ where: { id: deal.id } });
    }
}
