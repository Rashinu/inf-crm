import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CommunicationsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: any) {
        return this.prisma.communication.create({
            data: {
                ...dto,
                tenantId,
            }
        });
    }

    async findAllByDeal(tenantId: string, dealId: string) {
        return this.prisma.communication.findMany({
            where: { tenantId, dealId },
            orderBy: { createdAt: 'asc' },
        });
    }
}
