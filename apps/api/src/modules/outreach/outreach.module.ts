import { Module } from '@nestjs/common';
import { OutreachController } from './outreach.controller';
import { OutreachService } from './outreach.service';
import { OutreachProcessor } from './outreach.processor';
import { AiModule } from '../ai/ai.module';
import { EmailModule } from '../email/email.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    AiModule,
    EmailModule,
    BullModule.registerQueue({
      name: 'outreach',
    }),
  ],
  controllers: [OutreachController],
  providers: [OutreachService, OutreachProcessor],
  exports: [OutreachService],
})
export class OutreachModule {}
