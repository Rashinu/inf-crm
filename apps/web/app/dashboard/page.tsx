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
    Package
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

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
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Overview</h1>
                <p className="text-gray-500 mt-1">Here is the summary of your pipeline and tasks.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none shadow-sm shadow-blue-900/5 bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            Today's Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{summary?.todayTasks.deliverablesDue}</h3>
                                <p className="text-xs text-gray-500">Deliverables Due</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{summary?.todayTasks.paymentsDue}</h3>
                                <p className="text-xs text-gray-500">Payments Due</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm shadow-red-900/5 bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            Overdue Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{summary?.overduePayments.count}</h3>
                                <p className="text-xs text-gray-500">Overdue Invoices</p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-red-600">
                                    ₺{summary?.overduePayments.totalAmount.toLocaleString()}
                                </h3>
                                <p className="text-xs text-gray-500">Total Amount</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm shadow-green-900/5 bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Package className="w-4 h-4 text-green-500" />
                            Active Pipeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {Object.values(pipelineStats || {}).reduce((a: any, b: any) => a + b, 0) as number}
                                </h3>
                                <p className="text-xs text-gray-500">Total Deals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="md:col-span-4 border-none shadow-sm shadow-blue-900/5">
                    <CardHeader>
                        <CardTitle>Pipeline Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="stage" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                No pipeline data available.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-3 border-none shadow-sm shadow-blue-900/5">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {summary?.recentActivity.length === 0 ? (
                                <p className="text-gray-500 text-sm italic text-center py-4">No recent activity.</p>
                            ) : summary?.recentActivity.map((activity: any) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2 transition-colors"
                                    onClick={() => router.push(`/dashboard/deals/${activity.dealId}`)}
                                >
                                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <ActivityIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 leading-tight">
                                            {activity.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs font-medium text-blue-600">
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
