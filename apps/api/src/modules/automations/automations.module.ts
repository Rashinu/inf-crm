import { Module } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { AutomationsController } from './automations.controller';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [AutomationsController],
    providers: [AutomationsService],
    exports: [AutomationsService],
})
export class AutomationsModule { }
