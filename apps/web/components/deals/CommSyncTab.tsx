import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageCircle, Send } from "lucide-react";

export default function CommSyncTab({ dealId }: { dealId: string }) {
    const queryClient = useQueryClient();
    const [message, setMessage] = useState("");
    const [type, setType] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL');

    const sendCommMutation = useMutation({
        mutationFn: async (payload: { type: string, message: string }) => {
            const { data } = await apiClient.post(`/deals/${dealId}/communications`, payload);
            return data;
        },
        onSuccess: () => {
            toast.success("Message sent and synced!");
            setMessage("");
            queryClient.invalidateQueries({ queryKey: ["deal", dealId] });
            queryClient.invalidateQueries({ queryKey: ["activities", dealId] });
        },
        onError: () => toast.error("Failed to send communication."),
    });

    return (
        <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-800 shadow-sm border-none">
            <div>
                <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                    <Mail size={20} className="text-blue-500" /> Comm-Sync Hub
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Send emails or WhatsApp messages directly from the CRM. All communications are tracked in the Activity Log.
                </p>
            </div>

            <div className="flex gap-4">
                <Button
                    type="button"
                    variant={type === 'EMAIL' ? 'default' : 'outline'}
                    onClick={() => setType('EMAIL')}
                    className={type === 'EMAIL' ? 'bg-blue-600' : ''}
                >
                    <Mail size={16} className="mr-2" /> Email
                </Button>
                <Button
                    type="button"
                    variant={type === 'WHATSAPP' ? 'default' : 'outline'}
                    onClick={() => setType('WHATSAPP')}
                    className={type === 'WHATSAPP' ? 'bg-green-600 hover:bg-green-700 text-white' : 'dark:text-green-500'}
                >
                    <MessageCircle size={16} className="mr-2" /> WhatsApp
                </Button>
            </div>

            <div className="space-y-4">
                <Textarea
                    placeholder={`Type your ${type === 'EMAIL' ? 'email' : 'WhatsApp message'} here...`}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="min-h-[150px] dark:bg-slate-800 dark:border-slate-700"
                />
                <Button
                    onClick={() => sendCommMutation.mutate({ type, message })}
                    disabled={sendCommMutation.isPending || !message.trim()}
                    className="w-full sm:w-auto gap-2"
                >
                    {sendCommMutation.isPending ? "Sending..." : "Send Message"} <Send size={16} />
                </Button>
            </div>
        </div>
    );
}
