import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CurrencyService } from '../finance/currency.service';

@Injectable()
export class ContactsService {
    constructor(private prisma: PrismaService, private currencyService: CurrencyService) { }

    async create(tenantId: string, dto: CreateContactDto) {
        // Verify brand belongs to tenant
        const brand = await this.prisma.brand.findFirst({
            where: { id: dto.brandId, tenantId },
        });
        if (!brand) throw new NotFoundException('Brand not found');

        return this.prisma.contact.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, brandId?: string) {
        return this.prisma.contact.findMany({
            where: {
                tenantId,
                ...(brandId ? { brandId } : {}),
            },
            include: {
                brand: {
                    select: { name: true },
                },
            },
        });
    }

    async findOne(tenantId: string, id: string) {
        const contact = await this.prisma.contact.findFirst({
            where: { id, tenantId },
        });

        if (!contact) throw new NotFoundException('Contact not found');
        return contact;
    }

    async update(tenantId: string, id: string, dto: UpdateContactDto) {
        await this.findOne(tenantId, id);

        return this.prisma.contact.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);

        return this.prisma.contact.delete({
            where: { id },
        });
    }

    async getLeaderboard(tenantId: string) {
        const contacts = await this.prisma.contact.findMany({
            where: { tenantId },
            include: {
                brand: { select: { name: true } },
                deals: {
                    select: {
                        stage: true,
                        totalAmount: true,
                        publishDate: true,
                        deliverables: {
                            select: {
                                status: true,
                                dueDate: true,
                                updatedAt: true
                            }
                        },
                        currency: true
                    }
                }
            }
        });

        const leaderboard: any[] = [];

        for (const contact of contacts) {
            let totalLtv = 0;
            let activeDeals = 0;
            let totalDeliverables = 0;
            let onTimeDeliverables = 0;
            let delayedDeliverables = 0;

            for (const deal of contact.deals) {
                if (deal.stage === 'COMPLETED' || deal.stage === 'POSTED') {
                    // Convert foreign deal to TRY
                    const amountInTry = await this.currencyService.convertToTRY(Number(deal.totalAmount), deal.currency);
                    totalLtv += amountInTry;
                } else if (deal.stage !== 'LOST' && deal.stage !== 'CANCELLED') {
                    activeDeals++;
                }

                for (const del of deal.deliverables) {
                    totalDeliverables++;
                    if (del.status === 'DONE') {
                        if (!del.dueDate || new Date(del.updatedAt) <= new Date(del.dueDate)) {
                            onTimeDeliverables++;
                        } else {
                            delayedDeliverables++;
                        }
                    } else {
                        if (del.dueDate && new Date() > new Date(del.dueDate)) {
                            delayedDeliverables++;
                        }
                    }
                }
            }

            let score = 50; // Base score
            if (totalDeliverables > 0) {
                const onTimeRate = onTimeDeliverables / totalDeliverables;
                score += onTimeRate * 30; // Up to 30 points
            }
            const ltvBonus = Math.min((totalLtv / 100000) * 20, 20);
            score += ltvBonus;
            score -= (delayedDeliverables * 5);
            score = Math.max(0, Math.min(100, Math.round(score)));

            leaderboard.push({
                id: contact.id,
                name: contact.name,
                brandName: contact.brand.name,
                position: contact.position,
                totalLtv,
                activeDeals,
                score,
                onTimeRate: totalDeliverables > 0 ? (onTimeDeliverables / totalDeliverables) * 100 : 0,
                totalDeliverables,
                delayedDeliverables
            });
        }

        leaderboard.sort((a, b) => b.score - a.score);
        return leaderboard;
    }
}
