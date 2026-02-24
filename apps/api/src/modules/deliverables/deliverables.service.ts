import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliverableDto } from './dto/create-deliverable.dto';
import { ActivitiesService } from '../activities/activities.service';
import { RemindersService } from '../reminders/reminders.service';
import { ActivityType } from '@inf-crm/types';

@Injectable()
export class DeliverablesService {
    constructor(
        private prisma: PrismaService,
        private activities: ActivitiesService,
        private reminders: RemindersService,
    ) { }

    async create(tenantId: string, dto: CreateDeliverableDto) {
        const deal = await this.prisma.deal.findFirst({
            where: { id: dto.dealId, tenantId },
        });
        if (!deal) throw new NotFoundException('Deal not found');

        const deliverable = await this.prisma.deliverable.create({
            data: {
                ...dto,
                tenantId,
                type: dto.type as any,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
            },
        });

        await this.activities.log({
            tenantId,
            dealId: dto.dealId,
            type: ActivityType.DELIVERABLE_ADDED,
            message: `Deliverable added: ${dto.type}`,
        });

        if (deliverable.dueDate) {
            await this.reminders.createDeliverableReminders(dto.dealId, deliverable.dueDate, tenantId);
        }

        return deliverable;
    }

    async findAll(tenantId: string, dealId?: string) {
        return this.prisma.deliverable.findMany({
            where: {
                tenantId,
                ...(dealId ? { dealId } : {}),
            },
            include: {
                deal: { select: { title: true } },
            },
            orderBy: { dueDate: 'asc' },
        });
    }

    async update(tenantId: string, id: string, dto: any) {
        const deliverable = await this.prisma.deliverable.findFirst({
            where: { id, tenantId },
        });
        if (!deliverable) throw new NotFoundException('Deliverable not found');

        return this.prisma.deliverable.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        const deliverable = await this.prisma.deliverable.findFirst({
            where: { id, tenantId },
        });
        if (!deliverable) throw new NotFoundException('Deliverable not found');

        return this.prisma.deliverable.delete({ where: { id } });
    }
}
