import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InfluencersService } from './influencers.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { UpdateInfluencerDto } from './dto/update-influencer.dto';
import { DiscoverDto } from './dto/discover.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BillingGuard } from '../auth/guards/billing.guard';
import { QuotaGuard } from '../auth/guards/quota.guard';
import { Quota } from '../auth/decorators/quota.decorator';

@Controller('influencers')
@UseGuards(JwtAuthGuard, BillingGuard, QuotaGuard)
export class InfluencersController {
  constructor(private readonly influencersService: InfluencersService) {}

  @Post()
  @Quota('influencer')
  create(@Req() req, @Body() createInfluencerDto: CreateInfluencerDto) {
    const tenantId = req.user.tenantId;
    return this.influencersService.create(tenantId, createInfluencerDto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('platform') platform?: string,
    @Query('category') category?: string,
    @Query('country') country?: string,
    @Query('minFollowers') minFollowers?: string,
  ) {
    const tenantId = req.user.tenantId;
    return this.influencersService.findAll(tenantId, {
      platform,
      category,
      country,
      minFollowers,
    });
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.influencersService.findOne(tenantId, id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateInfluencerDto: UpdateInfluencerDto,
  ) {
    const tenantId = req.user.tenantId;
    return this.influencersService.update(tenantId, id, updateInfluencerDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.influencersService.remove(tenantId, id);
  }

  @Post(':id/invite')
  invite(@Req() req, @Param('id') id: string) {
    const tenantId = req.user.tenantId;
    return this.influencersService.generateInviteToken(tenantId, id);
  }

  @Post('discover')
  @Quota('influencer')
  discover(@Body() dto: DiscoverDto) {
    return this.influencersService.discover(dto);
  }
}
