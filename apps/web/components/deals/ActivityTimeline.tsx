"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ActivityType } from "@inf-crm/types";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, FileText, CheckSquare, RefreshCw, PenTool, LayoutDashboard, Send, Activity as ActivityIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ActivityTimeline({ dealId }: { dealId: string }) {
    const queryClient = useQueryClient();
    const [note, setNote] = useState("");

    const { data: activities, isLoading } = useQuery<any[]>({
        queryKey: ["activities", dealId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/activities/deal/${dealId}`);
            return data;
        },
    });

    const addNoteMutation = useMutation({
        mutationFn: async (message: string) => {
            return apiClient.post(`/activities/deal/${dealId}/note`, { message });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activities", dealId] });
            setNote("");
            toast.success("Note added to timeline");
        },
        onError: () => {
            toast.error("Failed to add note");
        }
    });

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim()) return;
        addNoteMutation.mutate(note);
    };

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
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 mb-1">Activity Log</h3>
                <p className="text-sm text-slate-500">Track all events, changes, and notes related to this deal.</p>
            </div>

            <form onSubmit={handleAddNote} className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                    <PenTool size={16} />
                </div>
                <Input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a note about this deal..."
                    className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 w-full placeholder:text-slate-400 font-medium"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={addNoteMutation.isPending || !note.trim()}
                    className="shrink-0 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-50"
                >
                    <Send size={16} />
                </Button>
            </form>

            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4 mt-8 pt-4">
                {activities?.map((activity) => {
                    const isNote = activity.type === ActivityType.NOTE_ADDED;
                    return (
                        <div key={activity.id} className="relative pl-8 group">
                            <div className={`absolute top-0 -left-[17px] w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${isNote ? 'bg-amber-100 text-amber-600' : 'bg-slate-100/80 text-slate-500'}`}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className={`${isNote ? 'bg-amber-50/50 border border-amber-100 p-4 rounded-xl -mt-2 shadow-sm' : ''}`}>
                                <p className={`font-medium text-sm leading-snug ${isNote ? 'text-amber-900' : 'text-slate-800'}`}>
                                    {activity.message}
                                </p>
                                <p className={`text-xs mt-1.5 font-medium ${isNote ? 'text-amber-500/80' : 'text-slate-400'}`}>
                                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {activities?.length === 0 && (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mx-auto mb-3">
                        <ActivityIcon className="text-slate-400 h-5 w-5" />
                    </div>
                    <p className="text-slate-600 font-medium text-sm">No activity recorded yet.</p>
                    <p className="text-slate-400 text-xs mt-1">Activities and notes will appear here.</p>
                </div>
            )}
        </div>
    );
}
