import {
  Controller,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InfluencersService } from '../influencers/influencers.service';

@Controller('portal')
export class PortalController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Get('influencer')
  async getInfluencerData(@Query('token') token: string) {
    if (!token) {
      throw new NotFoundException('Invitation token is required');
    }

    const influencer = await this.influencersService.findByToken(token);
    if (!influencer) {
      throw new NotFoundException('Invalid or expired invitation token');
    }

    return influencer;
  }
}
