import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ReminderStatus, ReminderChannel } from '@inf-crm/types';

@Processor('reminders')
export class RemindersProcessor extends WorkerHost {
    constructor(
        private readonly prisma: PrismaService,
        private readonly emailService: EmailService,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        console.log('Processing reminder job:', job.id);

        const now = new Date();
        const reminders = await this.prisma.reminder.findMany({
            where: {
                scheduledFor: { lte: now },
                status: 'PENDING',
            },
            include: {
                deal: {
                    include: {
                        tenant: {
                            include: { users: { where: { role: 'OWNER' } } }
                        },
                    },
                },
            },
            take: 100,
        });

        for (const reminder of reminders) {
            try {
                const owner = reminder.deal?.tenant.users[0];
                if (!owner) continue;

                if (reminder.channel === ReminderChannel.EMAIL || reminder.channel === 'EMAIL' as any) {
                    await this.emailService.sendReminder(reminder, owner.email);
                }

                // Create in-app notification
                await this.prisma.notification.create({
                    data: {
                        tenantId: reminder.tenantId,
                        userId: owner.id,
                        title: this.getReminderTitle(reminder.type),
                        body: `Reminder for deal: ${reminder.deal?.title}`,
                    },
                });

                // Mark as sent
                await this.prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { status: ReminderStatus.SENT },
                });

                console.log(`Reminder sent: ${reminder.id}`);
            } catch (error) {
                console.error(`Failed to send reminder ${reminder.id}:`, error);
            }
        }
    }

    private getReminderTitle(type: string): string {
        switch (type) {
            case 'PAYMENT_DUE': return 'Payment Due';
            case 'DELIVERABLE_DUE': return 'Deliverable Due';
            case 'PUBLISH_DATE': return 'Publish Date';
            default: return 'Reminder';
        }
    }
}
