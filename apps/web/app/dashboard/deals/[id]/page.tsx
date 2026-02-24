"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Package, FileText, Activity as ActivityIcon } from "lucide-react";
import DeliverablesList from "@/components/deals/DeliverablesList";
import PaymentsList from "@/components/deals/PaymentsList";
import ContractSection from "@/components/deals/ContractSection";
import ActivityTimeline from "@/components/deals/ActivityTimeline";
import DealOverview from "@/components/deals/DealOverview";
import AiAssistantTab from "@/components/deals/AiAssistantTab";
import { Sparkles } from "lucide-react";

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
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">{deal.title}</h1>
                    <p className="text-gray-500 mt-1">{deal.brand?.name} • {deal.platform}</p>
                </div>
                <Badge className="text-sm px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                    {deal.stage}
                </Badge>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-gray-100/50 p-1">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <Package size={16} /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="deliverables" className="flex items-center gap-2">
                        <Calendar size={16} /> Deliverables
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <DollarSign size={16} /> Payments
                    </TabsTrigger>
                    <TabsTrigger value="contracts" className="flex items-center gap-2">
                        <FileText size={16} /> Contracts
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <ActivityIcon size={16} /> Activity
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="flex items-center gap-2 text-violet-600 data-[state=active]:text-violet-700">
                        <Sparkles size={16} /> AI Assistant
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
                    <TabsContent value="ai">
                        <AiAssistantTab deal={deal} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
