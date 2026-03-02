import { Controller, Post, UseGuards } from '@nestjs/common';
import { CronService } from './cron.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cron')
@UseGuards(JwtAuthGuard)
export class CronController {
    constructor(private readonly cronService: CronService) { }

    @Post('trigger-daily')
    async triggerDailySummary() {
        await this.cronService.generateDailySummaries();
        return { success: true, message: 'Daily summaries triggered and processed.' };
    }
}
