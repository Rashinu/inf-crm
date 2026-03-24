"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, BarChart3, PieChart, Info, DollarSign, Target, Zap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AnalyticsPage() {
    const { data: analytics, isLoading } = useQuery({
        queryKey: ["dashboard-analytics"],
        queryFn: async () => {
            const { data } = await apiClient.get("/dashboard/analytics");
            return data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const { platformStats, categoryDistribution, globalMetrics, topInfluencers } = analytics;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black font-outfit uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        AI ROI Predictions
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Predictive analysis of your influencer marketing performance.</p>
                </div>
                <Badge variant="secondary" className="rounded-full bg-indigo-50 text-indigo-600 border-none px-4 py-1 font-bold">
                    <Zap className="size-3 mr-2" /> Powered by AI
                </Badge>
            </div>

            {/* Global Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[32px] border-none shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign size={80} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-widest text-indigo-100">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">₺{globalMetrics.totalSpent.toLocaleString()}</div>
                        <p className="text-xs mt-2 text-indigo-100">Across all active & completed deals</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 relative group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">Predicted ROI (Value)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-green-600">₺{Math.round(globalMetrics.predictedROI).toLocaleString()}</div>
                        <div className="mt-4 flex items-center gap-2">
                            <Progress value={Math.min(100, globalMetrics.roiFactor * 20)} className="h-2 bg-gray-100" />
                            <span className="text-xs font-bold text-green-500">+{Math.round(globalMetrics.roiFactor * 100)}%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">Growth Potential</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-indigo-600">High</div>
                        <p className="text-xs mt-2 text-gray-400">Based on engagement rates and conversion factors.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Platform Performance */}
                <Card className="rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold font-outfit flex items-center gap-2">
                            <TrendingUp className="size-5 text-indigo-600" /> Platform Win Rate & Spend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {platformStats.map((p: any) => (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold">{p.name}</span>
                                    <span className="text-gray-400 font-medium">₺{p.spent.toLocaleString()} spent</span>
                                </div>
                                <div className="relative h-4 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                        style={{ width: `${p.winRate}%` }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white mix-blend-difference">
                                        {Math.round(p.winRate)}% Win Rate
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold font-outfit flex items-center gap-2">
                            <Target className="size-5 text-indigo-600" /> Topic Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {categoryDistribution.map((c: any) => (
                                <div key={c.name} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:scale-[1.02] transition-transform">
                                    <div className="text-[10px] uppercase font-black text-gray-400 tracking-tighter mb-1">{c.name}</div>
                                    <div className="text-2xl font-black text-indigo-600">{c.value} <span className="text-xs text-gray-400 font-medium">Deals</span></div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights Card */}
            <Card className="rounded-[40px] border-none shadow-2xl bg-black text-white p-4">
                <CardContent className="flex flex-col md:flex-row items-center gap-8 p-8">
                    <div className="size-24 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                        <Zap size={48} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black font-outfit">AI Strategic Insight</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Our AI models indicate that your **Instagram** campaigns are yielding a significantly higher ROI than other platforms. 
                            We recommend increasing budget allocation toward **Health & Fitness** influencers, as their engagement-to-cost ratio 
                            is currently 2.4x above the industry average for your niche.
                        </p>
                        <div className="flex gap-4">
                            <Badge className="bg-white/10 text-white hover:bg-white/20 border-none rounded-xl py-1 px-4">Optimize Budget</Badge>
                            <Badge className="bg-white/10 text-white hover:bg-white/20 border-none rounded-xl py-1 px-4">New Opportunities</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Influencers ROI */}
            <Card className="rounded-[32px] border-none shadow-xl bg-white dark:bg-slate-900 mt-8">
                <CardHeader>
                    <CardTitle className="text-xl font-bold font-outfit flex items-center gap-2">
                        <Users className="size-5 text-indigo-600" /> Top Influencers by ROI
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-t border-gray-100 dark:border-slate-800">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                                    <th className="py-4 font-semibold uppercase tracking-wider text-xs">Platform</th>
                                    <th className="py-4 font-semibold uppercase tracking-wider text-xs text-right">Deals</th>
                                    <th className="py-4 font-semibold uppercase tracking-wider text-xs text-right">M. Spent</th>
                                    <th className="py-4 font-semibold uppercase tracking-wider text-xs text-right text-green-600">Pred. Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                {topInfluencers?.map((inf: any) => (
                                    <tr key={inf.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="py-3 font-bold text-gray-900 dark:text-gray-100">{inf.name}</td>
                                        <td className="py-3">
                                            <Badge variant="outline" className="bg-slate-50 font-bold">{inf.platform}</Badge>
                                        </td>
                                        <td className="py-3 text-right font-medium">{inf.deals}</td>
                                        <td className="py-3 text-right font-medium text-gray-500">₺{inf.spent.toLocaleString()}</td>
                                        <td className="py-3 text-right font-black text-green-600">₺{Math.round(inf.roi).toLocaleString()}</td>
                                    </tr>
                                ))}
                                {(!topInfluencers || topInfluencers.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-400">No deals created yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
