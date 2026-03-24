"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles, User, Mail, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface OutreachModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedInfluencers: any[];
}

export default function OutreachModal({ isOpen, onClose, selectedInfluencers }: OutreachModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [drafts, setDrafts] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const influencer = selectedInfluencers[currentIndex];

    const generateDraftMutation = useMutation({
        mutationFn: async (inf: any) => {
            const { data } = await apiClient.post("/outreach/draft", {
                profile: inf,
                brandInfo: "INF CRM Demo Brand" // This could be dynamic from user context
            });
            return { index: selectedInfluencers.indexOf(inf), ...data };
        },
        onSuccess: (data) => {
            setDrafts(prev => {
                const newDrafts = [...prev];
                newDrafts[data.index] = data;
                return newDrafts;
            });
        }
    });

    const sendOutreachMutation = useMutation({
        mutationFn: async () => {
            const payload = drafts
                .filter(d => d && d.subject && d.body)
                .map((d, i) => ({
                    to: selectedInfluencers[i].email || "test@example.com",
                    subject: d.subject,
                    body: d.body
                }));
            return apiClient.post("/outreach/send", { emails: payload });
        },
        onSuccess: () => {
            toast.success("Outreach emails queued successfully!");
            onClose();
        },
        onError: () => {
            toast.error("Failed to queue outreach emails.");
        }
    });

    const handleGenerateAll = async () => {
        setIsGenerating(true);
        setDrafts(new Array(selectedInfluencers.length).fill(null));
        
        try {
            for (const inf of selectedInfluencers) {
                await generateDraftMutation.mutateAsync(inf);
            }
            toast.success("All drafts generated!");
        } catch (error) {
            toast.error("Some drafts failed to generate.");
        } finally {
            setIsGenerating(false);
        }
    };

    const currentDraft = drafts[currentIndex] || { subject: "", body: "" };

    const updateDraft = (field: string, value: string) => {
        setDrafts(prev => {
            const newDrafts = [...prev];
            if (!newDrafts[currentIndex]) newDrafts[currentIndex] = { subject: "", body: "" };
            newDrafts[currentIndex][field] = value;
            return newDrafts;
        });
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            setDrafts(new Array(selectedInfluencers.length).fill(null));
        }
    }, [isOpen, selectedInfluencers.length]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-950 rounded-[32px] border-none shadow-2xl">
                <DialogHeader className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-black font-outfit bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
                                AI Outreach Campaign
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedInfluencers.length} Influencers selected for outreach
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            className="rounded-2xl border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold"
                            onClick={handleGenerateAll}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                            Generate All Drafts
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex min-h-0">
                    {/* Sidebar: Selected Influencers */}
                    <div className="w-64 border-r border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                        <ScrollArea className="h-full">
                            <div className="p-3 space-y-2">
                                {selectedInfluencers.map((inf, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-full flex flex-col p-3 rounded-2xl text-left transition-all ${
                                            currentIndex === i 
                                            ? "bg-white dark:bg-slate-800 shadow-md border border-indigo-100 dark:border-indigo-900/50 scale-[1.02]" 
                                            : "hover:bg-gray-100 dark:hover:bg-slate-800/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="size-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                                <User className="size-3 text-indigo-600" />
                                            </div>
                                            <span className="text-xs font-bold truncate">{inf.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 font-medium">{inf.handle}</span>
                                            {drafts[i] && <Badge className="h-4 p-0 px-1 bg-green-500 text-[8px]">Ready</Badge>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Main Content: Email Editor */}
                    <div className="flex-1 flex flex-col p-8 bg-white dark:bg-slate-950">
                        {influencer ? (
                            <div className="space-y-6 flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-[2px]">
                                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-indigo-600">
                                                {influencer.name?.[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black font-outfit text-lg">{influencer.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{influencer.handle} • {influencer.platform}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
                                            <ChevronLeft className="size-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentIndex(Math.min(selectedInfluencers.length - 1, currentIndex + 1))} disabled={currentIndex === selectedInfluencers.length - 1}>
                                            <ChevronRight className="size-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1 flex flex-col">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-tighter flex items-center gap-2">
                                            <Mail className="size-3" /> Subject Line
                                        </label>
                                        <Input 
                                            value={currentDraft.subject}
                                            onChange={(e) => updateDraft("subject", e.target.value)}
                                            placeholder="Wait for AI to generate subject..."
                                            className="h-12 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50/30 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2 flex-1 flex flex-col">
                                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Email Body</label>
                                        <Textarea 
                                            value={currentDraft.body}
                                            onChange={(e) => updateDraft("body", e.target.value)}
                                            placeholder="Click 'Generate All Drafts' or start typing..."
                                            className="flex-1 resize-none rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50/30 p-6 leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-center flex-col items-center justify-center text-center opacity-50">
                                <Loader2 className="size-10 animate-spin text-indigo-600 mb-4" />
                                <p>Loading influencer profile...</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                    <div className="w-full flex items-center justify-between">
                        <div className="text-sm text-gray-400 font-medium italic">
                            {drafts.filter(d => d).length} of {selectedInfluencers.length} drafts ready
                        </div>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="rounded-2xl font-bold" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button 
                                className="rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-8 font-black uppercase tracking-tighter"
                                onClick={() => sendOutreachMutation.mutate()}
                                disabled={drafts.filter(d => d).length === 0 || sendOutreachMutation.isPending}
                            >
                                {sendOutreachMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
                                Launch Campaign
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
