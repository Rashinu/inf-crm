"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, XCircle, MoreVertical, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { PaymentStatus } from "@inf-crm/types";

export default function FinancePage() {
    const queryClient = useQueryClient();

    const { data: summary, isLoading: loadingSummary } = useQuery<any>({
        queryKey: ["finance", "summary"],
        queryFn: async () => {
            const { data } = await apiClient.get("/finance/summary");
            return data;
        },
    });

    const { data: payments, isLoading: loadingPayments } = useQuery<any[]>({
        queryKey: ["payments"],
        queryFn: async () => {
            const { data } = await apiClient.get("/payments");
            return data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
            return apiClient.patch(`/payments/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["finance", "summary"] });
            toast.success("Payment status updated");
        },
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-outfit">Finance & Overview</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Track your earnings, overdue payments, and top brands.</p>
            </div>

            {loadingSummary ? (
                <div className="h-32 flex items-center justify-center text-gray-500">Loading your summary...</div>
            ) : summary ? (
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100 dark:ring-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <TrendingUp size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                    <TrendingUp size={16} />
                                </div>
                                Total Expected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white mt-2">
                                ₺{summary.totalExpected.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100 dark:ring-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <CheckCircle2 size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                    <CheckCircle2 size={16} />
                                </div>
                                Total Collected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black font-outfit tracking-tight text-slate-900 dark:text-white mt-2">
                                ₺{summary.totalCollected.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-slate-900 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100 dark:ring-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <AlertCircle size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
                                <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                                    <AlertCircle size={16} />
                                </div>
                                Overdue / Risk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black font-outfit tracking-tight text-rose-600 dark:text-rose-400 mt-2">
                                ₺{summary.totalOverdue.toLocaleString()}
                            </div>
                            {summary.totalOverdue > 0 && (
                                <p className="text-xs font-medium text-rose-500 dark:text-rose-400 mt-2 flex items-center gap-1">
                                    <AlertCircle size={12} /> Needs immediate attention
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ring-1 ring-slate-100/10 dark:ring-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Calendar size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                <div className="p-2 bg-white/10 text-white rounded-lg backdrop-blur-sm">
                                    <Calendar size={16} />
                                </div>
                                Monthly Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black font-outfit tracking-tight text-white mt-2">
                                ₺{summary.monthlyRevenue.toLocaleString()}
                            </div>
                            <p className="text-xs font-medium text-slate-400 mt-2">
                                Earned this month
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ) : null
            }

            {
                summary?.topBrands && summary.topBrands.length > 0 && (
                    <div className="mt-8 mb-4">
                        <h2 className="text-xl font-bold font-outfit text-slate-900 mb-4 flex items-center gap-2">
                            <span>🏆</span> Top Paying Brands
                        </h2>
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar">
                            {summary.topBrands.map((brand: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex-shrink-0 bg-white dark:bg-slate-900 border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 dark:ring-slate-800 transition-all rounded-2xl p-5 min-w-[240px] group cursor-default"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                                            Row #{index + 1}
                                        </div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500' :
                                            index === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
                                                index === 2 ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400' :
                                                    'bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400'
                                            }`}>
                                            {brand.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-700 dark:text-slate-200 truncate text-lg group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {brand.name}
                                    </div>
                                    <div className="text-2xl text-slate-900 dark:text-white font-transparent font-outfit mt-1">
                                        ₺{brand.value.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            <div className="bg-white dark:bg-slate-900 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 dark:text-white font-outfit">All Scheduled Payments</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage all your incoming transactions.</p>
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:border-slate-800">
                            <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs py-4">Project / Deal</TableHead>
                            <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs py-4">Amount</TableHead>
                            <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs py-4">Status</TableHead>
                            <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs py-4">Due Date</TableHead>
                            <TableHead className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingPayments ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    Loading payments...
                                </TableCell>
                            </TableRow>
                        ) : payments?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No payments recorded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments?.map((payment) => {
                                const isOverdue = payment.status !== PaymentStatus.PAID && payment.dueDate && new Date(payment.dueDate) < new Date();
                                const trueStatus = isOverdue ? 'OVERDUE' : payment.status;

                                return (
                                    <TableRow key={payment.id} className="dark:border-slate-800 dark:hover:bg-slate-800/30">
                                        <TableCell className="font-medium text-gray-900 dark:text-slate-200">{payment.deal?.title}</TableCell>
                                        <TableCell className="font-bold whitespace-nowrap text-gray-800 dark:text-white">
                                            ₺{Number(payment.amount).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {trueStatus === PaymentStatus.PAID ? (
                                                <Badge className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-50 border-none flex items-center w-fit gap-1">
                                                    <CheckCircle2 size={12} /> Paid
                                                </Badge>
                                            ) : trueStatus === PaymentStatus.PENDING ? (
                                                <Badge className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-50 border-none flex items-center w-fit gap-1">
                                                    <Clock size={12} /> Pending
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-50 border-none flex items-center w-fit gap-1 shadow-sm border border-rose-100 dark:border-rose-800">
                                                    <XCircle size={12} /> Overdue
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-500 dark:text-slate-400 text-sm">
                                            {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {payment.status !== PaymentStatus.PAID && (
                                                        <DropdownMenuItem
                                                            className="cursor-pointer font-medium text-green-600 focus:bg-green-50 focus:text-green-700"
                                                            onClick={() => updateStatusMutation.mutate({ id: payment.id, status: PaymentStatus.PAID })}
                                                        >
                                                            <CheckCircle2 className="mr-2 size-4" /> Mark as Paid
                                                        </DropdownMenuItem>
                                                    )}
                                                    {payment.status === PaymentStatus.PAID && (
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => updateStatusMutation.mutate({ id: payment.id, status: PaymentStatus.PENDING })}
                                                        >
                                                            Mark as Pending
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div >
    );
}
