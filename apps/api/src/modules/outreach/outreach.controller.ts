import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OutreachService } from './outreach.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('outreach')
@UseGuards(JwtAuthGuard)
export class OutreachController {
  constructor(private outreachService: OutreachService) {}

  @Post('draft')
  async generateDraft(@Req() req, @Body() body: { profile: any; brandInfo: string }) {
    // Basic verification: user making the request belongs to a tenant
    const tenantId = req.user.tenantId;
    return this.outreachService.generateDraft(body.profile, body.brandInfo);
  }

  @Post('send')
  async sendOutreach(@Req() req, @Body() body: { emails: { influencerId?: string; to: string; subject: string; body: string }[] }) {
    const tenantId = req.user.tenantId;
    return this.outreachService.sendOutreach(tenantId, body.emails);
  }
}
