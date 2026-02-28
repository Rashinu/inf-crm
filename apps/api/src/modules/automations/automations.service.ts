import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@Injectable()
export class AutomationsService {
    private readonly logger = new Logger(AutomationsService.name);

    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
    ) { }

    async create(tenantId: string, dto: CreateAutomationDto) {
        return this.prisma.automation.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.automation.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const automation = await this.prisma.automation.findFirst({
            where: { id, tenantId },
        });
        if (!automation) throw new NotFoundException('Automation not found');
        return automation;
    }

    async update(tenantId: string, id: string, dto: UpdateAutomationDto) {
        await this.findOne(tenantId, id);
        return this.prisma.automation.update({
            where: { id },
            data: dto as any,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        return this.prisma.automation.delete({
            where: { id },
        });
    }

    @OnEvent('deal.stage.changed')
    async handleDealStageChanged(payload: { tenantId: string, dealId: string, oldStage: string, newStage: string }) {
        this.logger.log(`Received deal stage change event for deal $${payload.dealId}`);

        // Query active automations for this tenant
        const automations = await this.prisma.automation.findMany({
            where: {
                tenantId: payload.tenantId,
                isActive: true,
                triggerType: 'DEAL_STAGE_CHANGED',
            },
        });

        for (const auto of automations) {
            this.logger.log(`Executing automation $${auto.name}`);

            if (auto.actionType === 'SEND_EMAIL') {
                const deal = await this.prisma.deal.findUnique({ where: { id: payload.dealId }, include: { contact: true } });
                const email = deal?.contact?.email;
                if (email) {
                    await this.emailService.sendGenericEmail(
                        email,
                        `Update on Deal: $${deal?.title}`,
                        `The stage for your deal has been updated to $${payload.newStage}.<br><br>INF CRM Automation Bot`
                    ).catch(err => this.logger.error(`Error sending email automation: $${err.message}`));
                } else {
                    this.logger.warn(`Automation $${auto.name} (SEND_EMAIL) skipped: No contact email found for deal $${payload.dealId}`);
                }
            } else if (auto.actionType === 'SEND_SLACK_MESSAGE') {
                this.logger.log(`Slack message dummy action executed for deal $${payload.dealId}`);
            }
        }
    }
}
