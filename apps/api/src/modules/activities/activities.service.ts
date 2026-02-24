import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityType } from '@inf-crm/types';

@Injectable()
export class ActivitiesService {
    constructor(private prisma: PrismaService) { }

    async log(params: {
        tenantId: string;
        dealId: string;
        type: ActivityType;
        message: string;
        metadata?: any;
    }) {
        return this.prisma.activityLog.create({
            data: params,
        });
    }

    async findAll(tenantId: string, dealId: string) {
        return this.prisma.activityLog.findMany({
            where: { tenantId, dealId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
