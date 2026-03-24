"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, CheckSquare, Square, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function OutreachCampaignPage() {
    const [selectedInfluencers, setSelectedInfluencers] = useState<Set<string>>(new Set());
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const { data: influencers, isLoading } = useQuery<any[]>({
        queryKey: ["influencers"],
        queryFn: async () => {
            const { data } = await apiClient.get("/influencers");
            // Filter only those who have an email
            return data.filter((inf: any) => inf.email);
        },
    });

    const sendCampaignMutation = useMutation({
        mutationFn: async (payload: any) => {
            return apiClient.post("/outreach/send", payload);
        },
        onSuccess: () => {
            toast.success("Campaign emails queued successfully!");
            setSelectedInfluencers(new Set());
            setSubject("");
            setBody("");
        },
        onError: () => {
            toast.error("Failed to queue campaign emails.");
        }
    });

    const handleSelectAll = () => {
        if (!influencers) return;
        if (selectedInfluencers.size === influencers.length) {
            setSelectedInfluencers(new Set());
        } else {
            setSelectedInfluencers(new Set(influencers.map(inf => inf.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedInfluencers);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedInfluencers(newSet);
    };

    const handleSend = () => {
        if (selectedInfluencers.size === 0) return toast.error("Select at least one influencer.");
        if (!subject.trim()) return toast.error("Subject is required.");
        if (!body.trim()) return toast.error("Email body is required.");

        const emails = Array.from(selectedInfluencers).map(id => {
            const inf = influencers?.find(i => i.id === id);
            return {
                influencerId: inf.id,
                to: inf.email,
                subject: subject,
                // Simple placeholder replacement
                body: body.replace(/{{name}}/g, inf.name).replace(/{{platform}}/g, inf.platform)
            };
        });

        sendCampaignMutation.mutate({ emails });
    };

    if (isLoading) return <div className="p-8 text-center">Loading influencers...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Bulk Email Campaigns</h1>
                <p className="text-gray-500 mt-1">Select influencers and dispatch bulk personalized emails via queue.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users size={18} className="text-blue-500" /> Waitlist ({influencers?.length || 0} with emails)
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                            {selectedInfluencers.size === influencers?.length ? "Deselect All" : "Select All"}
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[500px] overflow-y-auto">
                            {influencers?.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No influencers found with email addresses.</div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 w-10"></th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {influencers?.map(inf => (
                                            <tr key={inf.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => toggleSelect(inf.id)}>
                                                <td className="px-4 py-3">
                                                    {selectedInfluencers.has(inf.id) ? (
                                                        <CheckSquare className="text-blue-600 size-5" />
                                                    ) : (
                                                        <Square className="text-gray-300 size-5" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-900">{inf.name}</td>
                                                <td className="px-4 py-3 text-gray-500">{inf.email}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className={inf.outreachStatus === 'CONTACTED' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50'}>
                                                        {inf.outreachStatus || 'NEW'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Mail size={18} className="text-purple-500" /> Campaign Message
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-md mb-4 border border-blue-100">
                            <strong>Tip:</strong> You can use `{"{{name}}"}` and `{"{{platform}}"}` as dynamic variables in your email body.
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700">Subject Line</label>
                            <Input 
                                placeholder="E.g. Collaboration Opportunity with {{brand}}" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-1.5 flex-1">
                            <label className="text-sm font-medium text-gray-700">Email Body</label>
                            <Textarea 
                                placeholder="Hi {{name}},\n\nWe love your content on {{platform}}!..." 
                                className="min-h-[250px] resize-y"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </div>

                        <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-4"
                            disabled={selectedInfluencers.size === 0 || sendCampaignMutation.isPending}
                            onClick={handleSend}
                        >
                            {sendCampaignMutation.isPending ? "Queuing..." : (
                                <><Send className="mr-2 size-4" /> Send Campaign ({selectedInfluencers.size})</>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
