"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Package, FileText, Activity as ActivityIcon, Link as LinkIcon, Sparkles } from "lucide-react";
import DeliverablesList from "@/components/deals/DeliverablesList";
import PaymentsList from "@/components/deals/PaymentsList";
import ContractSection from "@/components/deals/ContractSection";
import ActivityTimeline from "@/components/deals/ActivityTimeline";
import DealOverview from "@/components/deals/DealOverview";
import AiAssistantTab from "@/components/deals/AiAssistantTab";
import CommSyncTab from "@/components/deals/CommSyncTab";
import { MessageCircle } from "lucide-react";

export default function DealDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: deal, isLoading } = useQuery<any>({
        queryKey: ["deal", id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/deals/${id}`);
            return data;
        },
    });

    if (isLoading) return <div>Loading...</div>;
    if (!deal) return <div>Deal not found</div>;

    return (
        <div className="space-y-6">
            {/* Premium Header Container */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-bold text-xs uppercase tracking-wider px-2 py-1">
                                    {deal.platform}
                                </Badge>
                                <Badge className={`bg-slate-100 text-slate-700 border-none font-bold text-xs uppercase tracking-wider px-2 py-1 ${deal.stage === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : ''}`}>
                                    {deal.stage}
                                </Badge>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 font-outfit mb-1">{deal.title}</h1>
                            <div className="flex items-center gap-4 text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5"><Package size={14} className="text-slate-400" /> {deal.brand?.name}</span>
                                {deal.contact?.name && (
                                    <>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-600">With: {deal.contact.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-left md:text-right bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[200px]">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Value</div>
                            <div className="text-3xl font-black text-slate-900 font-outfit">₺{deal.totalAmount?.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-white p-1.5 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 mb-6 h-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all font-semibold">
                        <Package size={16} /> <span className="hidden md:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all font-semibold">
                        <Calendar size={16} /> <span className="hidden md:inline">Tasks</span>
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all font-semibold">
                        <DollarSign size={16} /> <span className="hidden md:inline">Money</span>
                    </TabsTrigger>
                    <TabsTrigger value="contracts" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all font-semibold">
                        <FileText size={16} /> <span className="hidden md:inline">Files</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all font-semibold">
                        <ActivityIcon size={16} /> <span className="hidden md:inline">Log</span>
                    </TabsTrigger>
                    <TabsTrigger value="comms" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all font-semibold">
                        <MessageCircle size={16} /> <span className="hidden md:inline">Sync</span>
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all font-semibold text-slate-500">
                        <Sparkles size={16} /> <span className="hidden md:inline">Magic</span>
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview">
                        <DealOverview deal={deal} />
                    </TabsContent>
                    <TabsContent value="deliverables">
                        <DeliverablesList dealId={id} />
                    </TabsContent>
                    <TabsContent value="payments">
                        <PaymentsList dealId={id} />
                    </TabsContent>
                    <TabsContent value="contracts">
                        <ContractSection dealId={id} />
                    </TabsContent>
                    <TabsContent value="activity">
                        <ActivityTimeline dealId={id} />
                    </TabsContent>
                    <TabsContent value="comms">
                        <CommSyncTab dealId={id} />
                    </TabsContent>
                    <TabsContent value="ai">
                        <AiAssistantTab deal={deal} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
