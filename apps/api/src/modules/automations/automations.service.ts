import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@Injectable()
export class AutomationsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateAutomationDto) {
        return this.prisma.automation.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.automation.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(tenantId: string, id: string) {
        const automation = await this.prisma.automation.findFirst({
            where: { id, tenantId },
        });
        if (!automation) throw new NotFoundException('Automation not found');
        return automation;
    }

    async update(tenantId: string, id: string, dto: UpdateAutomationDto) {
        await this.findOne(tenantId, id);
        return this.prisma.automation.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);
        return this.prisma.automation.delete({
            where: { id },
        });
    }
}
