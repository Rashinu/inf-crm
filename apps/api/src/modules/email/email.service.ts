import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    }

    async sendReminder(reminder: any, userEmail: string) {
        const template = this.getTemplate(reminder.type);
        const subject = this.getSubject(reminder.type);

        const fromEmail = this.configService.get('EMAIL_FROM') || 'INF CRM <noreply@infcrm.com>';

        await this.resend.emails.send({
            from: fromEmail,
            to: userEmail,
            subject,
            html: template(reminder),
        }).catch(err => {
            console.error('Failed to send email via Resend:', err.message);
        });
    }

    async sendGenericEmail(toEmail: string, subject: string, htmlContent: string) {
        const fromEmail = this.configService.get('EMAIL_FROM') || 'INF CRM <noreply@infcrm.com>';

        await this.resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject,
            html: htmlContent,
        }).catch(err => {
            console.error('Failed to send generic email via Resend:', err.message);
        });
    }

    @OnEvent('comm.email.send')
    async handleCommEmailSend(payload: { email: string, subject: string, htmlContent: string }) {
        await this.sendGenericEmail(payload.email, payload.subject, payload.htmlContent);
    }

    private getSubject(type: string): string {
        switch (type) {
            case 'PAYMENT_DUE': return 'Payment Due SOON';
            case 'DELIVERABLE_DUE': return 'Deliverable Due SOON';
            case 'PUBLISH_DATE': return 'Publish Date Upcoming';
            default: return 'INF CRM Reminder';
        }
    }

    private getTemplate(type: string) {
        const baseUrl = this.configService.get('APP_BASE_URL') || 'http://localhost:3000';

        const templates: Record<string, (r: any) => string> = {
            PAYMENT_DUE: (reminder) => `
                <h2>Payment Due Soon</h2>
                <p>You have a payment due for the deal: <strong>${reminder.deal?.title}</strong>.</p>
                <p>Please check your pipeline or finance dashboard.</p>
                <a href="${baseUrl}/dashboard/deals/${reminder.dealId}">View Deal</a>
            `,
            DELIVERABLE_DUE: (reminder) => `
                <h2>Deliverable Due Soon</h2>
                <p>A deliverable for <strong>${reminder.deal?.title}</strong> is due soon.</p>
                <a href="${baseUrl}/dashboard/deals/${reminder.dealId}">View Deal</a>
            `,
            PUBLISH_DATE: (reminder) => `
                <h2>Publish Date Upcoming</h2>
                <p>A post for <strong>${reminder.deal?.title}</strong> is scheduled to be published soon.</p>
                <a href="${baseUrl}/dashboard/deals/${reminder.dealId}">View Deal</a>
            `,
        };

        return templates[type] || ((r) => `<p>Reminder for deal: ${r.deal?.title}</p>`);
    }
}
