import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ActivitiesService } from '../activities/activities.service';
import { RemindersService } from '../reminders/reminders.service';
import { ActivityType } from '@inf-crm/types';

@Injectable()
export class PaymentsService {
    constructor(
        private prisma: PrismaService,
        private activities: ActivitiesService,
        private reminders: RemindersService,
    ) { }

    async create(tenantId: string, dto: CreatePaymentDto) {
        const deal = await this.prisma.deal.findFirst({
            where: { id: dto.dealId, tenantId },
        });
        if (!deal) throw new NotFoundException('Deal not found');

        const payment = await this.prisma.payment.create({
            data: {
                ...dto,
                tenantId,
                dueDate: new Date(dto.dueDate),
                paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
            },
        });

        await this.activities.log({
            tenantId,
            dealId: dto.dealId,
            type: ActivityType.PAYMENT_UPDATED,
            message: `Payment added: ${dto.amount}`,
        });

        if (payment.dueDate) {
            await this.reminders.createPaymentReminders(dto.dealId, payment.dueDate, tenantId);
        }

        return payment;
    }

    async findAll(tenantId: string, dealId?: string) {
        return this.prisma.payment.findMany({
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
        const payment = await this.prisma.payment.findFirst({
            where: { id, tenantId },
        });
        if (!payment) throw new NotFoundException('Payment not found');

        return this.prisma.payment.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        const payment = await this.prisma.payment.findFirst({
            where: { id, tenantId },
        });
        if (!payment) throw new NotFoundException('Payment not found');

        return this.prisma.payment.delete({ where: { id } });
    }
}
