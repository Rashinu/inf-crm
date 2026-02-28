"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageCircle, Send, CheckCheck } from "lucide-react";
import { format } from "date-fns";

export default function CommSyncTab({ dealId }: { dealId: string }) {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [type, setType] = useState<'EMAIL' | 'WHATSAPP'>('WHATSAPP');
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: communications, isLoading } = useQuery<any[]>({
        queryKey: ["communications", dealId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/communications?dealId=$${dealId}`);
            return data;
        },
        refetchInterval: 5000,
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [communications]);

    const sendCommMutation = useMutation({
        mutationFn: async (payload: { type: string, message: string }) => {
            const { data } = await apiClient.post(`/deals/$${dealId}/communications`, payload);
            return data;
        },
        onSuccess: () => {
            setMessage("");
            queryClient.invalidateQueries({ queryKey: ["communications", dealId] });
            queryClient.invalidateQueries({ queryKey: ["activities", dealId] });
        },
        onError: () => toast.error("Failed to send message."),
    });

    const handleSend = () => {
        if (!message.trim()) return;
        sendCommMutation.mutate({ type, message });
    };

    return (
        <div className="flex flex-col h-[600px] bg-slate-50 dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10 shadow-sm relative">
                <div>
                    <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageCircle size={18} className="text-blue-500" /> Comm-Sync Flow
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Synced with CRM Contacts</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setType('WHATSAPP')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 $${type === 'WHATSAPP' ? 'bg-white dark:bg-slate-700 text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <MessageCircle size={14} /> WhatsApp
                    </button>
                    <button
                        onClick={() => setType('EMAIL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 $${type === 'EMAIL' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Mail size={14} /> Mail
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full text-sm text-slate-400">Loading messages...</div>
                ) : communications?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                        <MessageCircle size={32} className="text-slate-400" />
                        <p className="text-sm font-medium text-slate-500">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    communications?.map((comm) => {
                        const isOutbound = comm.direction === 'OUTBOUND';
                        return (
                            <div key={comm.id} className={`flex flex-col $${isOutbound ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm relative group $${isOutbound
                                        ? (comm.type === 'WHATSAPP' ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 rounded-tr-sm' : 'bg-blue-600 text-white rounded-tr-sm')
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                                    }`}>

                                    {/* Icon & Type Indicator */}
                                    <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70 $${isOutbound ? 'justify-end' : 'justify-start'}`}>
                                        {comm.type === 'WHATSAPP' ? <MessageCircle size={10} /> : <Mail size={10} />}
                                        <span>{comm.type}</span>
                                    </div>

                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comm.message}</p>

                                    <div className={`flex items-center gap-1.5 mt-2 text-[10px] opacity-60 $${isOutbound ? 'justify-end' : 'justify-start'}`}>
                                        <span>{format(new Date(comm.createdAt), 'HH:mm')}</span>
                                        {isOutbound && <CheckCheck size={12} className={comm.type === 'WHATSAPP' ? 'text-green-600 dark:text-green-400' : 'text-blue-200'} />}
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">{isOutbound ? 'You' : comm.sender || 'Client'}</span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="relative">
                    <Textarea
                        placeholder={`Message via $${type === 'EMAIL' ? 'Email' : 'WhatsApp'}...`}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        className={`min-h-[80px] resize-none pr-14 pl-4 py-3 rounded-2xl shadow-sm border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500 $${type === 'WHATSAPP' ? 'focus-visible:ring-green-500' : ''
                            }`}
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={sendCommMutation.isPending || !message.trim()}
                        className={`absolute bottom-3 right-3 rounded-xl shadow-md h-10 w-10 transition-transform active:scale-95 $${type === 'WHATSAPP' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {sendCommMutation.isPending ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={16} className="-ml-0.5" />
                        )}
                    </Button>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <p className="text-[10px] text-slate-400 font-medium">Press <span className="p-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Enter</span> to send, <span className="p-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Shift + Enter</span> for new line</p>
                </div>
            </div>
        </div>
    );
}
