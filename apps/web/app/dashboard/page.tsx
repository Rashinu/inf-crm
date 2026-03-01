"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity as ActivityIcon,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    Package,
    TrendingUp,
    Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../components/providers/LanguageProvider";

export default function DashboardPage() {
    const router = useRouter();
    const { t } = useLanguage();

    const { data: summary, isLoading: isLoadingSummary } = useQuery<any>({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const { data } = await apiClient.get("/dashboard/summary");
            return data;
        },
    });

    const { data: pipelineStats, isLoading: isLoadingPipeline } = useQuery<any>({
        queryKey: ["pipeline-stats"],
        queryFn: async () => {
            const { data } = await apiClient.get("/dashboard/pipeline");
            return data;
        },
    });

    if (isLoadingSummary || isLoadingPipeline) return <div>Loading dashboard...</div>;

    const chartData = pipelineStats ? Object.entries(pipelineStats).map(([stage, count]) => ({
        stage: stage.charAt(0) + stage.slice(1).toLowerCase().replace('_', ' '),
        count,
    })) : [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-outfit">{t("dashboard.executive_review")}</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">High-level financial and pipeline metrics for executive review.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-gradient-to-br from-blue-600 to-blue-800 ring-1 ring-slate-100 dark:ring-slate-800 text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {t("dashboard.monthly_revenue")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h3 className="text-3xl font-bold">₺{summary?.advanced?.monthlyRevenue?.toLocaleString() || '0'}</h3>
                            <p className="text-xs text-blue-200 mt-1">Total revenue collected this month</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-500" />
                            {t("dashboard.active_pipeline")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₺{summary?.advanced?.activePipelineValue?.toLocaleString() || '0'}</h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Across {summary?.advanced?.activeDealsCount || 0} active deals</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            {t("dashboard.win_rate")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">% {summary?.advanced?.winRate || '0'}</h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Percentage of won deals</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            Overdue Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                                ₺{summary?.overduePayments?.totalAmount?.toLocaleString() || '0'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Across {summary?.overduePayments?.count || 0} invoices</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            Today's Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.todayTasks.deliverablesDue}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Deliverables Due</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.todayTasks.paymentsDue}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Payments Due</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            Weekly Deliverables Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.todayTasks.deliverablesDue}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Deliverables Due Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 dark:text-slate-400 flex items-center gap-2">
                            <Package className="w-4 h-4 text-green-500 dark:text-green-400" />
                            Active Pipeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {Object.values(pipelineStats || {}).reduce((a: any, b: any) => a + b, 0) as number}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Total Deals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="md:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">Pipeline Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="stage" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => `${value}`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500">
                                No pipeline data available.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {summary?.recentActivity.length === 0 ? (
                                <p className="text-gray-500 dark:text-slate-400 text-sm italic text-center py-4">No recent activity.</p>
                            ) : summary?.recentActivity.map((activity: any) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 p-2 rounded-lg -mx-2 transition-colors"
                                    onClick={() => router.push(`/dashboard/deals/${activity.dealId}`)}
                                >
                                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <ActivityIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-slate-200 leading-tight">
                                            {activity.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 dark:text-slate-400">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </span>
                                            <span className="text-gray-300 dark:text-slate-600">•</span>
                                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                                {activity.deal?.title}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
