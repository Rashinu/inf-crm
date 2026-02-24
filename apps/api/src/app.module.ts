import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BrandsModule } from './modules/brands/brands.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DealsModule } from './modules/deals/deals.module';
import { DeliverablesModule } from './modules/deliverables/deliverables.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FilesModule } from './modules/files/files.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { EmailModule } from './modules/email/email.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { BullModule } from '@nestjs/bullmq';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MobileService } from './modules/mobile/mobile.service';
import { MobileController } from './modules/mobile/mobile.controller';
import { MobileModule } from './modules/mobile/mobile.module';
import { AiModule } from './modules/ai/ai.module';
import { SearchModule } from './modules/search/search.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6380', 10),
      },
    }),
    PrismaModule,
    EmailModule,
    ActivitiesModule,
    ContractsModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    BrandsModule,
    ContactsModule,
    DealsModule,
    DeliverablesModule,
    PaymentsModule,
    FilesModule,
    CalendarModule,
    NotificationsModule,
    RemindersModule,
    DashboardModule,
    MobileModule,
    AiModule,
    SearchModule,
    FinanceModule,
  ],
  controllers: [AppController, MobileController],
  providers: [AppService, MobileService],
})
export class AppModule { }
