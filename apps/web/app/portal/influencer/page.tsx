"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    User, 
    Instagram, 
    Youtube, 
    Music2, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    TrendingUp, 
    Eye, 
    MousePointer2,
    DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

export default function InfluencerPortalPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const queryClient = useQueryClient();
    const [performanceInputs, setPerformanceInputs] = useState<Record<string, { reach: number, engagement: number, clicks: number }>>({});

    const { data: influencer, isLoading, isError } = useQuery<any>({
        queryKey: ["portal", "influencer", token],
        queryFn: async () => {
            const { data } = await apiClient.get(`/portal/influencer?token=${token}`);
            return data;
        },
        enabled: !!token,
        retry: false,
    });

    const updateMetricsMutation = useMutation({
        mutationFn: async ({ dealId, metrics }: { dealId: string, metrics: any }) => {
            return apiClient.patch(`/deals/${dealId}/performance`, metrics);
        },
        onSuccess: () => {
            toast.success("Performance metrics updated!");
            queryClient.invalidateQueries({ queryKey: ["portal", "influencer", token] });
        },
        onError: () => {
            toast.error("Failed to update metrics.");
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium font-outfit">Loading your influencer dashboard...</p>
                </div>
            </div>
        );
    }

    if (isError || !influencer) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-100 shadow-2xl rounded-2xl">
                    <CardContent className="pt-8 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-black font-outfit text-slate-900 mb-2">Portal Access Error</h2>
                        <p className="text-slate-500 font-medium mb-6">
                            This invitation link is invalid, expired, or has already been used. Please contact your agency for a new link.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const activeDeals = influencer.deals?.filter((d: any) => d.stage !== 'COMPLETED' && d.stage !== 'CANCELLED') || [];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
                            <User size={20} />
                        </div>
                        <div>
                            <h1 className="font-black text-xl text-slate-900 font-outfit tracking-tight leading-none">{influencer.name}</h1>
                            <p className="text-indigo-600 text-xs font-bold mt-1 uppercase tracking-widest">{influencer.handle}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
                <div className="relative overflow-hidden bg-indigo-600 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl shadow-indigo-200">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black font-outfit mb-2 tracking-tight">Campaign Portal</h2>
                        <p className="text-indigo-100 text-lg font-medium opacity-90">Manage your agency campaigns and log performance metrics.</p>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl opacity-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-3">
                            <Clock className="text-indigo-600" size={24} /> Active Campaigns
                        </h3>

                        {activeDeals.length === 0 ? (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 p-12 text-center rounded-3xl">
                                <p className="text-slate-400 font-medium">No active campaigns at the moment.</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {activeDeals.map((deal: any) => (
                                    <Card key={deal.id} className="border-none shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 rounded-[1.5rem] overflow-hidden bg-white hover:ring-indigo-100 transition-all group">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none font-bold text-[10px] uppercase tracking-wider mb-2">
                                                        {deal.brand?.name}
                                                    </Badge>
                                                    <h4 className="font-black text-xl text-slate-900 font-outfit leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{deal.title}</h4>
                                                </div>
                                                <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[10px]">
                                                    {deal.stage}
                                                </Badge>
                                            </div>

                                            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Post Performance Link</p>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Reach</Label>
                                                        <Input 
                                                            type="number" 
                                                            className="h-10 text-sm font-bold bg-white rounded-xl border-slate-200 focus:ring-indigo-500" 
                                                            placeholder="0"
                                                            onChange={(e) => setPerformanceInputs({
                                                                ...performanceInputs,
                                                                [deal.id]: { ...(performanceInputs[deal.id] || { reach: deal.reach, engagement: deal.engagement, clicks: deal.clicks }), reach: Number(e.target.value) }
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Engagement%</Label>
                                                        <Input 
                                                            type="number" 
                                                            className="h-10 text-sm font-bold bg-white rounded-xl border-slate-200 focus:ring-indigo-500" 
                                                            placeholder="0"
                                                            onChange={(e) => setPerformanceInputs({
                                                                ...performanceInputs,
                                                                [deal.id]: { ...(performanceInputs[deal.id] || { reach: deal.reach, engagement: deal.engagement, clicks: deal.clicks }), engagement: Number(e.target.value) }
                                                            })}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Clicks</Label>
                                                        <Input 
                                                            type="number" 
                                                            className="h-10 text-sm font-bold bg-white rounded-xl border-slate-200 focus:ring-indigo-500" 
                                                            placeholder="0"
                                                            onChange={(e) => setPerformanceInputs({
                                                                ...performanceInputs,
                                                                [deal.id]: { ...(performanceInputs[deal.id] || { reach: deal.reach, engagement: deal.engagement, clicks: deal.clicks }), clicks: Number(e.target.value) }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                <Button 
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10 font-bold rounded-xl shadow-md shadow-indigo-100"
                                                    disabled={updateMetricsMutation.isPending}
                                                    onClick={() => updateMetricsMutation.mutate({ 
                                                        dealId: deal.id, 
                                                        metrics: performanceInputs[deal.id] 
                                                    })}
                                                >
                                                    {updateMetricsMutation.isPending ? "Syncing..." : "Update Performance Data"}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-3">
                            <TrendingUp className="text-indigo-600" size={24} /> Overall Impact
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="border-none shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 rounded-3xl p-6 bg-white overflow-hidden relative group hover:ring-indigo-200 transition-all">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Reach</p>
                                    <p className="text-3xl font-black text-slate-900 font-outfit">{(influencer.deals?.reduce((acc: number, d: any) => acc + (d.reach || 0), 0) || 0).toLocaleString()}</p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                    <Eye size={80} />
                                </div>
                            </Card>
                            <Card className="border-none shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 rounded-3xl p-6 bg-white overflow-hidden relative group hover:ring-indigo-200 transition-all">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Clicks</p>
                                    <p className="text-3xl font-black text-indigo-600 font-outfit">{(influencer.deals?.reduce((acc: number, d: any) => acc + (d.clicks || 0), 0) || 0).toLocaleString()}</p>
                                </div>
                                <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                    <MousePointer2 size={80} />
                                </div>
                            </Card>
                        </div>

                        <h3 className="text-2xl font-black font-outfit text-slate-900 pt-6">Earnings Summary</h3>
                        <Card className="border-none shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 rounded-[2rem] bg-indigo-900 p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Estimated Total Earnings</p>
                                    <p className="text-4xl font-black font-outfit tracking-tight">₺{(influencer.deals?.reduce((acc: number, d: any) => acc + (d.totalAmount || 0), 0) || 0).toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-indigo-800 rounded-2xl flex items-center justify-center text-indigo-300">
                                    <DollarSign size={32} />
                                </div>
                            </div>
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-50" />
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

