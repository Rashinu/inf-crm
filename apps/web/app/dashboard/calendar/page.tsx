"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import CalendarTodoPanel from "@/components/calendar/CalendarTodoPanel";

export default function CalendarPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const { data: events } = useQuery({
        queryKey: ["calendar-events", dateRange],
        queryFn: async () => {
            const { data } = await apiClient.get('/calendar/events', {
                params: {
                    from: format(dateRange.start, 'yyyy-MM-dd'),
                    to: format(dateRange.end, 'yyyy-MM-dd'),
                }
            });
            return data;
        }
    });

    const { data: todos } = useQuery({
        queryKey: ["calendar-todos-global", dateRange],
        queryFn: async () => {
            const { data } = await apiClient.get('/calendar/todos', {
                params: {
                    from: format(dateRange.start, 'yyyy-MM-dd'),
                    to: format(dateRange.end, 'yyyy-MM-dd'),
                }
            });
            return data;
        }
    });

    const getEventColor = (type: string) => {
        switch (type) {
            case 'DELIVERABLE_DUE': return '#f97316'; // orange-500
            case 'PUBLISH_DATE': return '#a855f7'; // purple-500
            case 'PAYMENT_DUE': return '#22c55e'; // green-500
            case 'TODO': return '#64748b'; // slate-500
            default: return '#3b82f6'; // blue-500
        }
    };

    const calendarEvents = [
        ...(events || []).map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.date,
            allDay: true,
            backgroundColor: getEventColor(event.type),
            borderColor: 'transparent',
            extendedProps: { ...event, isEvent: true },
        })),
        ...(todos || []).map((todo: any) => ({
            id: `todo-${todo.id}`,
            title: (todo.isCompleted ? '✓ ' : '') + todo.text,
            start: todo.date,
            allDay: true,
            backgroundColor: todo.isCompleted ? '#cbd5e1' : getEventColor('TODO'), // Gray out if completed
            borderColor: 'transparent',
            extendedProps: { ...todo, isTodo: true },
        }))
    ];

    const handleEventClick = (info: any) => {
        const event = info.event.extendedProps;
        if (event.isTodo) {
            // Clicked a To-Do item, open the sheet for that day
            setSelectedDate(new Date(event.date));
            setSheetOpen(true);
        } else if (event.dealId) {
            router.push(`/dashboard/deals/${event.dealId}`);
        }
    };

    const handleDateClick = (info: any) => {
        setSelectedDate(info.date);
        setSheetOpen(true);
    };

    const renderEventContent = (eventInfo: any) => {
        const isTodo = eventInfo.event.extendedProps.isTodo;
        const isCompleted = eventInfo.event.extendedProps.isCompleted;
        const bgColor = eventInfo.backgroundColor;

        if (isTodo) {
            return (
                <div className={`flex w-full items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all shadow-sm border ${isCompleted
                        ? 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isCompleted ? 'bg-slate-300' : 'bg-[#64748b]'}`} />
                    <span className="truncate">{eventInfo.event.title.replace('✓ ', '')}</span>
                </div>
            );
        }

        // Standard Event (Deliverable/Payment)
        return (
            <div
                className="w-full px-2 py-1.5 rounded-md text-xs font-semibold text-white cursor-pointer shadow-sm truncate transition-opacity hover:opacity-90"
                style={{ backgroundColor: bgColor }}
            >
                <span className="truncate">{eventInfo.event.title}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Calendar</h1>
                    <p className="text-gray-500 mt-1">Track upcoming deliverables and payments.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    datesSet={(dateInfo) => {
                        setDateRange({
                            start: dateInfo.start,
                            end: dateInfo.end,
                        });
                    }}
                    height="auto"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek'
                    }}
                />
            </div>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>
                            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Tasks"}
                        </SheetTitle>
                        <SheetDescription>
                            Manage your personal to-do list for this day.
                        </SheetDescription>
                    </SheetHeader>
                    <CalendarTodoPanel date={selectedDate} />
                </SheetContent>
            </Sheet>
        </div>
    );
}
