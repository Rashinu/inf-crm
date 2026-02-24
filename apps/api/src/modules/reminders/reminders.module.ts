import { Module, Global } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersProcessor } from './reminders.processor';
import { BullModule } from '@nestjs/bullmq';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminders',
    }),
  ],
  providers: [RemindersService, RemindersProcessor],
  exports: [RemindersService],
})
export class RemindersModule { }
