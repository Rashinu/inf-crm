import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async globalSearch(tenantId: string, query: string) {
        if (!query || query.length < 2) return { brands: [], contacts: [], deals: [] };

        const [brands, contacts, deals] = await Promise.all([
            this.prisma.brand.findMany({
                where: {
                    tenantId,
                    name: { contains: query, mode: 'insensitive' },
                    softDeletedAt: null,
                },
                take: 5,
            }),
            this.prisma.contact.findMany({
                where: {
                    tenantId,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                },
                include: { brand: true },
                take: 5,
            }),
            this.prisma.deal.findMany({
                where: {
                    tenantId,
                    title: { contains: query, mode: 'insensitive' },
                    softDeletedAt: null,
                },
                include: { brand: true },
                take: 5,
            }),
        ]);

        return {
            brands,
            contacts,
            deals,
        };
    }
}
