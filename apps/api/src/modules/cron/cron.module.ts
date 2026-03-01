import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [PrismaModule, NotificationsModule, EmailModule],
    providers: [CronService],
})
export class CronModule { }
