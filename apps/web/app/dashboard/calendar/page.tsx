"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default function CalendarPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
    });

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

    const getEventColor = (type: string) => {
        switch (type) {
            case 'DELIVERABLE_DUE': return '#f97316'; // orange-500
            case 'PUBLISH_DATE': return '#a855f7'; // purple-500
            case 'PAYMENT_DUE': return '#22c55e'; // green-500
            default: return '#3b82f6'; // blue-500
        }
    };

    const calendarEvents = events?.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: event.date,
        backgroundColor: getEventColor(event.type),
        borderColor: 'transparent',
        extendedProps: event,
    }));

    const handleEventClick = (info: any) => {
        const event = info.event.extendedProps;
        router.push(`/dashboard/deals/${event.dealId}`);
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
                    eventClick={handleEventClick}
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
        </div>
    );
}
