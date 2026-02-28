"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Bell, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function NotificationBell() {
    const queryClient = useQueryClient();

    const { data: notifications } = useQuery<any[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const { data } = await apiClient.get("/notifications");
            return data;
        },
        refetchInterval: 60000, // Poll every minute
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.patch(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            return apiClient.patch(`/notifications/read-all`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const unreadCount = notifications?.filter(n => !n.readAt).length || 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell className="size-5 text-gray-700 dark:text-gray-300" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-bold text-white leading-none">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[340px] p-0 border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden rounded-xl">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-gray-900 dark:text-white font-outfit">Notifications</h3>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto py-1 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-bold"
                            onClick={async () => {
                                await apiClient.post("/notifications/demo");
                                queryClient.invalidateQueries({ queryKey: ["notifications"] });
                                toast.success("Test notification triggered!");
                            }}
                        >
                            + Demo
                        </Button>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto py-1 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => markAllAsReadMutation.mutate()}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </div>
                <div className="max-h-[350px] overflow-y-auto w-full">
                    {notifications?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                            <p>You have no notifications right now.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications?.map(notif => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "p-4 border-b border-gray-50 dark:border-slate-800/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex gap-3",
                                        !notif.readAt && "bg-blue-50/30 dark:bg-blue-900/20"
                                    )}
                                    onClick={() => {
                                        if (!notif.readAt) markAsReadMutation.mutate(notif.id);
                                    }}
                                >
                                    <div className={cn("mt-1 w-2 h-2 rounded-full shrink-0", !notif.readAt ? "bg-blue-500" : "bg-transparent")} />
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-slate-200 leading-tight mb-1">{notif.title}</p>
                                        <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-2">{notif.body}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
