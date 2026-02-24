import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RemindersService implements OnModuleInit {
    constructor(
        @InjectQueue('reminders') private readonly reminderQueue: Queue,
        private readonly prisma: PrismaService,
    ) { }

    async onModuleInit() {
        await this.scheduleReminderCheck();
    }

    private async scheduleReminderCheck() {
        await this.reminderQueue.add(
            'check-reminders',
            {},
            {
                repeat: {
                    every: 5 * 60 * 1000, // 5 minutes
                },
            }
        );
    }

    async createDeliverableReminders(dealId: string, dueDate: Date, tenantId: string) {
        const twoDaysBefore = new Date(dueDate);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

        const onTheDay = new Date(dueDate);

        await this.prisma.reminder.createMany({
            data: [
                {
                    tenantId,
                    dealId,
                    type: 'DELIVERABLE_DUE',
                    scheduledFor: twoDaysBefore,
                    channel: 'EMAIL',
                    status: 'PENDING',
                },
                {
                    tenantId,
                    dealId,
                    type: 'DELIVERABLE_DUE',
                    scheduledFor: onTheDay,
                    channel: 'IN_APP',
                    status: 'PENDING',
                },
            ],
        });
    }

    async createPaymentReminders(dealId: string, dueDate: Date, tenantId: string) {
        const twoDaysBefore = new Date(dueDate);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

        const onTheDay = new Date(dueDate);

        await this.prisma.reminder.createMany({
            data: [
                {
                    tenantId,
                    dealId,
                    type: 'PAYMENT_DUE',
                    scheduledFor: twoDaysBefore,
                    channel: 'EMAIL',
                    status: 'PENDING',
                },
                {
                    tenantId,
                    dealId,
                    type: 'PAYMENT_DUE',
                    scheduledFor: onTheDay,
                    channel: 'IN_APP',
                    status: 'PENDING',
                },
            ],
        });
    }
}
