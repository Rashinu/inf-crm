import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../email/email.service';
import { DeliverableStatus, PaymentStatus } from '@inf-crm/types';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private emailService: EmailService,
  ) {}

  // Run every day at 09:00 AM
  @Cron('0 9 * * *', { timeZone: 'Europe/Istanbul' })
  async handleDailyTasks() {
    this.logger.log('Running daily task checks (09:00 AM)');

    try {
      await this.generateDailySummaries();
    } catch (error) {
      this.logger.error('Error running daily cron:', error);
    }
  }

  // A simpler trigger for demo purposes to test now (Runs every minute ONLY IF UNCOMMENTED)
  // @Cron(CronExpression.EVERY_MINUTE)
  // async testCron() {
  //    this.logger.log('Testing Cron running...');
  //    await this.generateDailySummaries();
  // }

  async generateDailySummaries() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tenants = await this.prisma.tenant.findMany({
      include: {
        users: true,
      },
    });

    for (const tenant of tenants) {
      try {
        // Find overdue payments
        const overduePayments = await this.prisma.payment.findMany({
          where: {
            tenantId: tenant.id,
            status: {
              in: [PaymentStatus.PENDING as any, PaymentStatus.PARTIAL as any],
            },
            dueDate: { lt: today },
          },
          include: { deal: true },
        });

        // Find deliverables due today
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const dueDeliverables = await this.prisma.deliverable.findMany({
          where: {
            tenantId: tenant.id,
            dueDate: { gte: today, lte: endOfToday },
            status: { not: DeliverableStatus.DONE as any },
          },
          include: { deal: true },
        });

        // Find pending CalendarTodos for today
        const pendingTodos = await this.prisma.calendarTodo.findMany({
          where: {
            tenantId: tenant.id,
            date: { gte: today, lte: endOfToday },
            isCompleted: false,
          },
        });

        // Generate notifications
        for (const payment of overduePayments) {
          for (const user of tenant.users) {
            await this.notifications.create({
              tenantId: tenant.id,
              userId: user.id,
              title: 'Overdue Payment Alert ⚠️',
              body: `$${payment.amount} payment for "$${payment.deal?.title}" is overdue. Please follow up.`,
            });
          }
        }

        for (const deliverable of dueDeliverables) {
          for (const user of tenant.users) {
            await this.notifications.create({
              tenantId: tenant.id,
              userId: user.id,
              title: 'Deliverable Due Today 🎯',
              body: `Platform: ${deliverable.type} content for "${deliverable.deal?.title}" is due today.`,
            });
          }
        }

        // Notify specific users about their CalendarTodos
        for (const todo of pendingTodos) {
          await this.notifications.create({
            tenantId: tenant.id,
            userId: todo.userId,
            title: "📅 Today's Reminder",
            body: `You have a pending task today: "${todo.text}"`,
          });
        }

        // Send Daily Summary Email if there are actions needed
        if (
          overduePayments.length > 0 ||
          dueDeliverables.length > 0 ||
          pendingTodos.length > 0
        ) {
          for (const user of tenant.users) {
            // Filter user's specific todos
            const userTodos = pendingTodos.filter((t) => t.userId === user.id);

            const htmlContent = `
                            <h2>Daily Executive Summary</h2>
                            <p>Here is your INF CRM summary for today:</p>
                            
                            <h3>🚨 Overdue Payments (${overduePayments.length})</h3>
                            <ul>
                                $${overduePayments.map((p) => `<li>$${p.deal?.title}: $${p.amount} (Due: $${p.dueDate.toLocaleDateString()})</li>`).join('')}
                            </ul>

                            <h3>🎯 Deliverables Due Today (${dueDeliverables.length})</h3>
                            <ul>
                                ${dueDeliverables.map((d) => `<li>${d.deal?.title || 'Unknown Deal'} - ${d.type || 'Content'}</li>`).join('')}
                            </ul>
                            
                            ${
                              userTodos.length > 0
                                ? `
                                <h3>📅 Your Tasks & Reminders (${userTodos.length})</h3>
                                <ul>
                                    ${userTodos.map((t) => `<li>${t.text}</li>`).join('')}
                                </ul>
                            `
                                : ''
                            }
                            
                            <p>Please log in to your dashboard to take action.</p>
                            <br>
                            <p>INF CRM - The Automation Engine</p>
                        `;

            // If user has email, optionally send it. Make sure Resend API works.
            if (user.email) {
              try {
                await this.emailService.sendGenericEmail(
                  user.email,
                  `INF CRM - Daily Summary (${new Date().toLocaleDateString()})`,
                  htmlContent,
                );
              } catch (e) {
                this.logger.error(
                  `Failed to send daily summary to $${user.email}`,
                  e,
                );
              }
            }
          }
        }
      } catch (err) {
        this.logger.error(
          `Failed to process daily summary for tenant $${tenant.id}`,
          err,
        );
      }
    }
  }
}
