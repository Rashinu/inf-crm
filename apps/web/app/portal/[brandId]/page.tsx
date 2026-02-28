"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Package, CheckCircle2, AlertCircle, Clock, CalendarDays, Wallet } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ClientPortalPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const brandId = params.brandId as string;
    const accessKey = searchParams.get('key');
    const queryClient = useQueryClient();

    const { data: brand, isLoading, isError } = useQuery<any>({
        queryKey: ["portal", brandId, accessKey],
        queryFn: async () => {
            const { data } = await apiClient.get(`/portal/brands/${brandId}?key=${accessKey}`);
            return data;
        },
        retry: false,
    });

    const approveMutation = useMutation({
        mutationFn: async (deliverableId: string) => {
            const { data } = await apiClient.post(`/portal/brands/${brandId}/deliverables/${deliverableId}/approve?key=${accessKey}`);
            return data;
        },
        onSuccess: () => {
            toast.success("Deliverable approved successfully!");
            queryClient.invalidateQueries({ queryKey: ["portal", brandId, accessKey] });
        },
        onError: () => {
            toast.error("Failed to approve deliverable.");
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium">Loading your secure portal...</p>
                </div>
            </div>
        );
    }

    if (isError || !brand) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-100 dark:border-red-900/50 shadow-xl">
                    <CardContent className="pt-6 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold font-outfit text-slate-900 dark:text-white mb-2">Access Denied</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            The portal link is invalid, expired, or you don't have permission to view this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Stats
    const activeDeals = brand.deals.filter((d: any) => d.stage !== 'COMPLETED' && d.stage !== 'CANCELLED' && d.stage !== 'LOST');
    const completedDeals = brand.deals.filter((d: any) => d.stage === 'COMPLETED');

    let totalPendingPayments = 0;
    brand.deals.forEach((deal: any) => {
        deal.payments.forEach((p: any) => {
            if (p.status !== 'PAID') {
                totalPendingPayments += Number(p.amount);
            }
        });
    });

    const getStageColor = (stage: string) => {
        if (['COMPLETED', 'APPROVED'].includes(stage)) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
        if (['IN_PRODUCTION', 'SCHEDULED', 'POSTED'].includes(stage)) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        if (['LEAD', 'CONTACTED', 'NEGOTIATION'].includes(stage)) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-inter">
            {/* Top Navbar */}
            <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg text-white font-bold">
                            {brand.name.charAt(0)}
                        </div>
                        <h1 className="font-bold text-lg text-slate-800 dark:text-white font-outfit tracking-tight">
                            Client Portal
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                        <Building2 size={14} /> {brand.name}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="space-y-1">
                    <h2 className="text-3xl font-black font-outfit text-slate-900 dark:text-white tracking-tight">
                        Welcome, {brand.name} Team 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Here you can track your ongoing campaigns, deliverables, and outstanding payments in real-time.
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-800/50 ring-1 ring-slate-100 dark:ring-slate-700/50 rounded-2xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Campaigns</p>
                                    <p className="text-4xl font-black text-slate-900 dark:text-white mt-1 font-outfit">{activeDeals.length}</p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Package size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-800/50 ring-1 ring-slate-100 dark:ring-slate-700/50 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed Campaigns</p>
                                    <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-outfit">{completedDeals.length}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-800/50 ring-1 ring-slate-100 dark:ring-slate-700/50 rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Balance</p>
                                    <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 font-outfit truncate" title={`₺${totalPendingPayments.toLocaleString()}`}>
                                        ₺{totalPendingPayments.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                                    <Wallet size={24} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Deals Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={20} className="text-blue-500" /> Ongoing & Recent Campaigns
                        </h3>

                        {brand.deals.length === 0 ? (
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center border-none shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                                <p className="text-slate-500">No campaigns found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {brand.deals.map((deal: any) => (
                                    <Card key={deal.id} className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{deal.title}</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                        Created on {format(new Date(deal.createdAt), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                                <Badge className={`border-none ${getStageColor(deal.stage)}`}>
                                                    {deal.stage.replace('_', ' ')}
                                                </Badge>
                                            </div>

                                            {/* Deliverables Sublist */}
                                            {deal.deliverables && deal.deliverables.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Deliverables</h5>
                                                    <div className="space-y-2">
                                                        {deal.deliverables.map((deliv: any) => (
                                                            <div key={deliv.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-2 h-2 rounded-full ${deliv.status === 'DONE' ? 'bg-emerald-500' : deliv.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-700 dark:text-white">
                                                                            {deliv.quantity}x {deliv.type.replace('_', ' ')}
                                                                        </p>
                                                                        {deliv.description && <p className="text-xs text-slate-500">{deliv.description}</p>}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right flex items-center gap-3">
                                                                    {deliv.status === 'DONE' ? (
                                                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-bold scale-90">APPROVED</Badge>
                                                                    ) : (
                                                                        <Button
                                                                            size="sm"
                                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-xs h-8 px-3 rounded-lg"
                                                                            onClick={() => approveMutation.mutate(deliv.id)}
                                                                            disabled={approveMutation.isPending}
                                                                        >
                                                                            Approve
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center gap-2">
                            <Wallet size={20} className="text-emerald-500" /> Payment Schedule
                        </h3>

                        <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardContent className="p-0">
                                {brand.deals.flatMap((d: any) => d.payments).length === 0 ? (
                                    <div className="p-6 text-center text-slate-500 text-sm">No payment records found.</div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {brand.deals.flatMap((d: any) =>
                                            d.payments.map((p: any) => ({ ...p, dealTitle: d.title }))
                                        ).sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                            .map((payment: any) => (
                                                <div key={payment.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">₺{Number(payment.amount).toLocaleString()}</p>
                                                            <p className="text-xs font-medium text-slate-500 truncate max-w-[150px]">{payment.dealTitle}</p>
                                                        </div>
                                                        <Badge className={`border-none ${payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                            payment.status === 'OVERDUE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                                                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                            }`}>
                                                            {payment.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                                        <span>Due: {format(new Date(payment.dueDate), 'MMM d, yyyy')}</span>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
