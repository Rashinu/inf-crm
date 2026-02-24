"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Mail, MessageSquare } from "lucide-react";
import { DealStage } from "@inf-crm/types";

export default function AiAssistantTab({ deal }: { deal: any }) {
    const [hooks, setHooks] = useState<string[]>([]);
    const [draftEmail, setDraftEmail] = useState<string>("");
    const [context, setContext] = useState("");

    const generateHooksMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                topic: `${deal.title} for ${deal.brand?.name}`,
                platform: deal.platform,
            };
            const { data } = await apiClient.post("/ai/generate-hooks", payload);
            return data;
        },
        onSuccess: (data) => {
            setHooks(data);
            toast.success("Hooks generated successfully!");
        },
        onError: () => toast.error("Failed to generate hooks."),
    });

    const draftEmailMutation = useMutation({
        mutationFn: async () => {
            const baseContext = context || `Write a follow up email regarding the deal titled '${deal.title}' with status ${deal.stage}.`;
            const { data } = await apiClient.post("/ai/draft-email", { context: baseContext });
            return data.emailDraft;
        },
        onSuccess: (data) => {
            setDraftEmail(data);
            toast.success("Draft created successfully!");
        },
        onError: () => toast.error("Failed to draft email."),
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Hooks Generator */}
            <Card className="border-none shadow-sm flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg font-outfit flex items-center gap-2 text-violet-700">
                        <MessageSquare size={18} /> Content Idea Hooks
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                    <p className="text-sm text-gray-500 mb-4">
                        Generate 3 viral hook ideas for this deal on <strong>{deal.platform}</strong>.
                    </p>
                    <Button
                        onClick={() => generateHooksMutation.mutate()}
                        disabled={generateHooksMutation.isPending}
                        variant="secondary"
                        className="w-full bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold"
                    >
                        {generateHooksMutation.isPending ? (
                            <><Loader2 className="mr-2 size-4 animate-spin" /> Generating...</>
                        ) : (
                            <><Sparkles className="mr-2 size-4" /> Generate Hooks</>
                        )}
                    </Button>

                    {hooks.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {hooks.map((hook, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800">
                                    <strong className="text-violet-600 mr-2">#{idx + 1}</strong>
                                    {hook}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Email Drafting */}
            <Card className="border-none shadow-sm flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg font-outfit flex items-center gap-2 text-blue-700">
                        <Mail size={18} /> Smart Email Drafts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                    <Textarea
                        placeholder="E.g., Remind them nicely that the payment is late, or request missing assets..."
                        value={context}
                        onChange={e => setContext(e.target.value)}
                        className="h-20 resize-none text-sm"
                    />
                    <Button
                        onClick={() => draftEmailMutation.mutate()}
                        disabled={draftEmailMutation.isPending}
                        variant="secondary"
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold mt-2"
                    >
                        {draftEmailMutation.isPending ? (
                            <><Loader2 className="mr-2 size-4 animate-spin" /> Drafting...</>
                        ) : (
                            <><Sparkles className="mr-2 size-4" /> Draft Email</>
                        )}
                    </Button>

                    {draftEmail && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm whitespace-pre-wrap text-gray-700 flex-1">
                            {draftEmail}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
