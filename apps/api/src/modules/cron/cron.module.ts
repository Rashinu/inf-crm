import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, NotificationsModule, EmailModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
