import { Controller, Get, Query, UseGuards, Req, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

    @Get('todos')
    getTodos(
        @TenantId() tenantId: string,
        @Req() req: any,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        const fromDate = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 1));
        const toDate = to ? new Date(to) : new Date(new Date().setMonth(new Date().getMonth() + 1));
        return this.calendarService.getTodos(tenantId, req.user.userId, fromDate, toDate);
    }

    @Post('todos')
    createTodo(
        @TenantId() tenantId: string,
        @Req() req: any,
        @Body('date') date: string,
        @Body('text') text: string,
    ) {
        return this.calendarService.createTodo(tenantId, req.user.userId, new Date(date), text);
    }

    @Patch('todos/:id')
    updateTodo(
        @Param('id') id: string,
        @Body('isCompleted') isCompleted?: boolean,
        @Body('text') text?: string,
    ) {
        return this.calendarService.updateTodo(id, isCompleted, text);
    }

    @Delete('todos/:id')
    deleteTodo(@Param('id') id: string) {
        return this.calendarService.deleteTodo(id);
    }
}
