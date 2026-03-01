import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
        private eventEmitter: EventEmitter2,
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
                salesRep: { select: { fullName: true, email: true } },
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

        this.eventEmitter.emit('deal.stage.changed', {
            tenantId,
            dealId: id,
            oldStage: deal.stage,
            newStage: dto.stage,
        });

        return updated;
    }

    async sendCommunication(tenantId: string, id: string, dto: { type: 'EMAIL' | 'WHATSAPP', message: string }) {
        const deal = await this.findOne(tenantId, id);

        // Save to the dedicated communications model
        const comm = await this.prisma.communication.create({
            data: {
                tenantId,
                dealId: id,
                type: dto.type,
                direction: 'OUTBOUND',
                message: dto.message,
                recipient: deal.contact?.email || deal.contact?.phone || 'Unknown',
            }
        });

        // Log to timeline
        await this.activities.log({
            tenantId,
            dealId: id,
            type: ActivityType.NOTE_ADDED,
            message: `Outbound $${dto.type}: $${dto.message}`,
        });

        // If email, send actual email
        if (dto.type === 'EMAIL' && deal.contact?.email) {
            // we'd inject EmailService, but to keep dependencies clean, we could fire an event or do it here
            this.eventEmitter.emit('comm.email.send', {
                email: deal.contact.email,
                subject: `Message regarding $${deal.title}`,
                htmlContent: `<p>$${dto.message}</p><br><p>Sent from INF CRM by your Agent</p>`
            });
        }

        return { success: true, communication: comm };
    }

    async remove(tenantId: string, id: string) {
        const deal = await this.findOne(tenantId, id);
        return this.prisma.deal.delete({ where: { id: deal.id } });
    }
}
