"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Settings, Trash2, Mail, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AutomationsPage() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        triggerType: "DEAL_STAGE_CHANGED",
        actionType: "SEND_EMAIL",
    });

    const { data: automations = [], isLoading } = useQuery({
        queryKey: ["automations"],
        queryFn: async () => {
            const { data } = await apiClient.get("/automations");
            return data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newAuto: any) => {
            await apiClient.post("/automations", newAuto);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
            toast.success("Automation created successfully!");
            setIsCreateOpen(false);
            setFormData({ name: "", description: "", triggerType: "DEAL_STAGE_CHANGED", actionType: "SEND_EMAIL" });
        },
        onError: () => toast.error("Failed to create automation."),
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            await apiClient.patch(`/automations/${id}`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
            toast.success("Automation status updated.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/automations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
            toast.success("Automation deleted.");
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    if (isLoading) return <div className="p-8">Loading automations engine...</div>;

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                        <Zap className="text-amber-500" /> Agency Automations
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Set up rules to automate repetitive tasks like emails and Slack notifications.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                            <Plus size={16} /> New Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Automation Rule</DialogTitle>
                            <DialogDescription>Define what triggers the automation and what action happens.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Rule Name</Label>
                                <Input required placeholder="e.g. Notify Client on Completion" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Description (Optional)</Label>
                                <Input placeholder="What does this rule do?" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>When this happens (Trigger)</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={formData.triggerType} onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}>
                                    <option value="DEAL_STAGE_CHANGED">Deal Stage Changed</option>
                                    <option value="DELIVERABLE_STATUS_CHANGED" disabled>Deliverable Status Changed (Coming Soon)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Do this (Action)</Label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={formData.actionType} onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}>
                                    <option value="SEND_EMAIL">Send Automated Email</option>
                                    <option value="SEND_SLACK_MESSAGE">Send Slack Message</option>
                                </select>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Saving..." : "Create Rule"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {automations.map((auto: any) => (
                    <Card key={auto.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 rounded-2xl overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800 flex flex-col group">
                        <CardHeader className="pb-4 flex flex-row items-start justify-between bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <CardTitle className="text-lg dark:text-slate-100">{auto.name}</CardTitle>
                                {auto.description && <CardDescription className="dark:text-slate-400 mt-1">{auto.description}</CardDescription>}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => deleteMutation.mutate(auto.id)}>
                                <Trash2 size={16} />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-5 flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                                    <Zap size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trigger</p>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-white">{auto.triggerType.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                    {auto.actionType === 'SEND_EMAIL' ? <Mail size={16} /> : <ExternalLink size={16} />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action</p>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-white">{auto.actionType.replace(/_/g, ' ')}</p>
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <Badge variant={auto.isActive ? "default" : "secondary"} className={auto.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                {auto.isActive ? "Active" : "Paused"}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => toggleMutation.mutate({ id: auto.id, isActive: !auto.isActive })} className="text-xs font-medium">
                                {auto.isActive ? "Pause Rule" : "Activate Rule"}
                            </Button>
                        </div>
                    </Card>
                ))}

                {automations.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
                        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <Settings size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No automations yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">Create rules to automate repetitive tasks and let the CRM do the heavy lifting for your agency.</p>
                        <Button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                            Create your first rule
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
