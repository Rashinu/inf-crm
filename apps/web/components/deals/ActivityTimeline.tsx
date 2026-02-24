"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ActivityType } from "@inf-crm/types";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, FileText, CheckSquare, RefreshCw, PenTool, LayoutDashboard } from "lucide-react";

export default function ActivityTimeline({ dealId }: { dealId: string }) {
    const { data: activities, isLoading } = useQuery<any[]>({
        queryKey: ["activities", dealId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/activities/deal/${dealId}`);
            return data;
        },
    });

    if (isLoading) return <div>Loading activities...</div>;

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case ActivityType.PAYMENT_UPDATED: return <CreditCard className="w-4 h-4 text-green-600" />;
            case ActivityType.FILE_UPLOADED: return <FileText className="w-4 h-4 text-purple-600" />;
            case ActivityType.CONTRACT_SIGNED: return <FileText className="w-4 h-4 text-blue-600" />;
            case ActivityType.DELIVERABLE_ADDED: return <CheckSquare className="w-4 h-4 text-orange-600" />;
            case ActivityType.STAGE_CHANGED: return <RefreshCw className="w-4 h-4 text-indigo-600" />;
            case ActivityType.NOTE_ADDED: return <PenTool className="w-4 h-4 text-gray-600" />;
            default: return <LayoutDashboard className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold font-outfit">Activity Timeline</h3>
            <div className="relative border-l border-gray-200 ml-3 space-y-6 pb-4">
                {activities?.map((activity) => (
                    <div key={activity.id} className="relative pl-6">
                        <div className="absolute top-1 -left-[10px] w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 text-sm">
                                {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {activities?.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400">No activity recorded yet.</p>
                </div>
            )}
        </div>
    );
}
