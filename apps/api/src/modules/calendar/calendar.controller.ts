import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('calendar')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) { }

    @Get('events')
    getCalendarEvents(
        @TenantId() tenantId: string,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        const fromDate = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const toDate = to ? new Date(to) : new Date(new Date().setMonth(new Date().getMonth() + 1));

        return this.calendarService.getCalendarEvents(tenantId, fromDate, toDate);
    }
}
