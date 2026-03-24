import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OutreachService {
  constructor(
    private aiService: AiService,
    private prisma: PrismaService,
    @InjectQueue('outreach') private outreachQueue: Queue,
  ) {}

  async generateDraft(profile: any, brandInfo: string) {
    return this.aiService.generateOutreachEmail(profile, brandInfo);
  }

  async sendOutreach(tenantId: string, emails: { influencerId?: string; to: string; subject: string; body: string }[]) {
    // 1. Update influencer statuses in bulk if influencerId is provided
    const influencerIds = emails.map(e => e.influencerId).filter(Boolean) as string[];
    
    if (influencerIds.length > 0) {
      await this.prisma.influencer.updateMany({
        where: { tenantId, id: { in: influencerIds } },
        data: {
          outreachStatus: 'CONTACTED',
          lastContactDate: new Date()
        }
      });
    }

    // 2. Queue emails
    const jobs = emails.map(email => ({
      name: 'send-email',
      data: email,
    }));
    return this.outreachQueue.addBulk(jobs);
  }
}
