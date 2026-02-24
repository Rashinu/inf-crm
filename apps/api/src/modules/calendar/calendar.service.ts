import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CalendarService {
    constructor(private prisma: PrismaService) { }

    async getCalendarEvents(tenantId: string, from: Date, to: Date) {
        const [deliverables, payments] = await Promise.all([
            this.prisma.deliverable.findMany({
                where: {
                    tenantId,
                    OR: [
                        { dueDate: { gte: from, lte: to } },
                        { publishDate: { gte: from, lte: to } },
                    ],
                },
                include: { deal: { include: { brand: true } } },
            }),
            this.prisma.payment.findMany({
                where: {
                    tenantId,
                    dueDate: { gte: from, lte: to },
                },
                include: { deal: { include: { brand: true } } },
            }),
        ]);

        const events: any[] = [];

        // Deliverable due dates
        deliverables.forEach(d => {
            if (d.dueDate && d.dueDate >= from && d.dueDate <= to) {
                events.push({
                    id: `deliverable-due-${d.id}`,
                    type: 'DELIVERABLE_DUE',
                    title: `${d.deal.brand.name} - ${d.type} Due`,
                    date: d.dueDate,
                    dealId: d.dealId,
                    deal: d.deal,
                });
            }

            if (d.publishDate && d.publishDate >= from && d.publishDate <= to) {
                events.push({
                    id: `deliverable-publish-${d.id}`,
                    type: 'PUBLISH_DATE',
                    title: `${d.deal.brand.name} - Publish ${d.type}`,
                    date: d.publishDate,
                    dealId: d.dealId,
                    deal: d.deal,
                });
            }
        });

        // Payment due dates
        payments.forEach(p => {
            events.push({
                id: `payment-due-${p.id}`,
                type: 'PAYMENT_DUE',
                title: `${p.deal.brand.name} - Payment Due`,
                date: p.dueDate,
                amount: p.amount,
                currency: p.deal.currency,
                status: p.status,
                dealId: p.dealId,
                deal: p.deal,
            });
        });

        return events.sort((a, b) => a.date.getTime() - b.date.getTime());
    }
}
