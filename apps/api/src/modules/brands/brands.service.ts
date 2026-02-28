import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, dto: CreateBrandDto) {
        return this.prisma.brand.create({
            data: {
                ...dto,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return this.prisma.brand.findMany({
            where: {
                tenantId,
                softDeletedAt: null,
            },
            include: {
                _count: {
                    select: { contacts: true, deals: true },
                },
            },
        });
    }

    async findOne(tenantId: string, id: string) {
        const brand = await this.prisma.brand.findFirst({
            where: { id, tenantId, softDeletedAt: null },
            include: {
                contacts: true,
                deals: true,
            },
        });

        if (!brand) throw new NotFoundException('Brand not found');
        return brand;
    }

    async update(tenantId: string, id: string, dto: UpdateBrandDto) {
        await this.findOne(tenantId, id); // Ensure it belongs to tenant

        return this.prisma.brand.update({
            where: { id },
            data: dto,
        });
    }

    async remove(tenantId: string, id: string) {
        await this.findOne(tenantId, id);

        return this.prisma.brand.update({
            where: { id },
            data: { softDeletedAt: new Date() },
        });
    }

    async getPortalData(id: string, key: string) {
        // Fetch brand details if key matches
        const brand = await this.prisma.brand.findUnique({
            where: {
                id,
                portalAccessKey: key,
                softDeletedAt: null,
            },
            include: {
                deals: {
                    where: { softDeletedAt: null },
                    include: {
                        deliverables: {
                            orderBy: { dueDate: 'asc' },
                        },
                        payments: {
                            orderBy: { dueDate: 'asc' },
                        },
                        contractFiles: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }
            }
        });

        if (!brand) return null;

        // Optionally map/filter out sensitive info like internal notes, but for now we provide the structured data
        return brand;
    }
}
