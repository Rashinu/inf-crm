import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
    constructor(private prisma: PrismaService) { }

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
}
