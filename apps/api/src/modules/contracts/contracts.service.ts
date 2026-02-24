import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { ActivityType, ContractStatus } from '@inf-crm/types';

@Injectable()
export class ContractsService {
    constructor(
        private prisma: PrismaService,
        private activities: ActivitiesService,
    ) { }

    async create(tenantId: string, dealId: string, data: { fileKey: string; fileName: string; status?: ContractStatus }) {
        const deal = await this.prisma.deal.findFirst({
            where: { id: dealId, tenantId },
        });
        if (!deal) throw new NotFoundException('Deal not found');

        const contract = await this.prisma.contractFile.create({
            data: {
                ...data,
                dealId,
                tenantId,
            },
        });

        await this.activities.log({
            tenantId,
            dealId,
            type: ActivityType.FILE_UPLOADED,
            message: `Contract uploaded: ${data.fileName}`,
        });

        return contract;
    }

    async findAll(tenantId: string, dealId: string) {
        return this.prisma.contractFile.findMany({
            where: { tenantId, dealId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(tenantId: string, id: string, status: ContractStatus) {
        const contract = await this.prisma.contractFile.findFirst({
            where: { id, tenantId },
        });
        if (!contract) throw new NotFoundException('Contract not found');

        const updated = await this.prisma.contractFile.update({
            where: { id },
            data: { status },
        });

        if (status === ContractStatus.SIGNED) {
            await this.activities.log({
                tenantId,
                dealId: contract.dealId,
                type: ActivityType.CONTRACT_SIGNED,
                message: `Contract signed: ${contract.fileName}`,
            });
        }

        return updated;
    }

    async remove(tenantId: string, id: string) {
        const contract = await this.prisma.contractFile.findFirst({
            where: { id, tenantId },
        });
        if (!contract) throw new NotFoundException('Contract not found');

        return this.prisma.contractFile.delete({ where: { id } });
    }
}
