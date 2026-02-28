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

    async approveDeliverable(id: string, key: string, deliverableId: string) {
        const brand = await this.prisma.brand.findUnique({
            where: { id, portalAccessKey: key, softDeletedAt: null },
        });

        if (!brand) throw new NotFoundException('Brand not found or invalid access key');

        // Check if deliverable belongs to a deal of this brand
        const deliverable = await this.prisma.deliverable.findFirst({
            where: {
                id: deliverableId,
                deal: { brandId: id },
            }
        });

        if (!deliverable) throw new NotFoundException('Deliverable not found for this brand');

        return this.prisma.deliverable.update({
            where: { id: deliverableId },
            data: { status: 'DONE' },
        });
    }

    async getMediaKit(tenantId: string) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) throw new NotFoundException('Tenant not found');

        const deals = await this.prisma.deal.findMany({
            where: { tenantId, stage: 'COMPLETED', softDeletedAt: null },
            include: { brand: { select: { name: true } } },
        });

        const brandNames = [...new Set(deals.map(d => d.brand.name))];
        const platforms = [...new Set(deals.map(d => d.platform))].filter(Boolean);

        return {
            tenantName: tenant.name,
            totalCompletedDeals: deals.length,
            brandsWorkedWith: brandNames,
            platforms: platforms,
            // dummy social stats for the media kit
            stats: {
                instagramFollowers: "2.5M",
                tiktokLikes: "15M",
                averageEngagementRate: "5.2%",
            }
        };
    }
}
