import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';

import { DiscoverDto } from './dto/discover.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class InfluencersService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) { }

  async discover(dto: DiscoverDto) {
    return this.aiService.searchInfluencers(dto.niche, dto.platform, dto.count);
  }

  async create(tenantId: string, dto: CreateInfluencerDto) {
    return (this.prisma.influencer as any).create({
      data: {
        ...dto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string, filters: any = {}) {
    const where: any = { tenantId };

    if (filters.platform) where.platform = filters.platform;
    if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };
    if (filters.country) where.country = { contains: filters.country, mode: 'insensitive' };
    if (filters.minFollowers) where.followers = { gte: Number(filters.minFollowers) };

    return (this.prisma.influencer as any).findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const influencer = await (this.prisma.influencer as any).findUnique({
      where: { id, tenantId },
      include: {
        deals: {
          include: { brand: true }
        }
      }
    });

    if (!influencer) {
      throw new NotFoundException(`Influencer with ID ${id} not found`);
    }

    return influencer;
  }

  async update(tenantId: string, id: string, dto: UpdateInfluencerDto) {
    // Ensure it exists for this tenant
    await this.findOne(tenantId, id);

    return (this.prisma.influencer as any).update({
      where: { id },
      data: dto,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return (this.prisma.influencer as any).delete({
      where: { id },
    });
  }

  async generateInviteToken(tenantId: string, id: string) {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days expiry

    return (this.prisma.influencer as any).update({
      where: { id, tenantId },
      data: {
        invitationToken: token,
        invitationExpires: expires,
      },
    });
  }

  async findByToken(token: string) {
    return (this.prisma.influencer as any).findFirst({
      where: {
        invitationToken: token,
        invitationExpires: {
          gt: new Date(),
        },
      },
      include: {
        deals: {
          include: {
            deliverables: true,
            payments: true,
            brand: true,
          },
        },
      },
    });
  }
}
