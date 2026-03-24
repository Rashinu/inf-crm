import { Module } from '@nestjs/common';
import { PortalController } from './portal.controller';
import { InfluencersModule } from '../influencers/influencers.module';

@Module({
  imports: [InfluencersModule],
  controllers: [PortalController],
})
export class PortalModule {}
