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
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Finance & Overview</h1>
                <p className="text-gray-500 mt-1">Track your earnings, overdue payments, and top brands.</p>
            </div>

            {loadingSummary ? (
                <div className="h-32 flex items-center justify-center text-gray-500">Loading your summary...</div>
            ) : summary ? (
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-none shadow-sm bg-indigo-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-indigo-100 uppercase flex items-center gap-2">
                                <TrendingUp size={16} /> Total Expected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-outfit">₺{summary.totalExpected.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-emerald-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100 uppercase flex items-center gap-2">
                                <CheckCircle2 size={16} /> Total Collected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-outfit">₺{summary.totalCollected.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-rose-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-rose-100 uppercase flex items-center gap-2">
                                <AlertCircle size={16} /> Overdue / Risk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-outfit">₺{summary.totalOverdue.toLocaleString()}</div>
                            {summary.totalOverdue > 0 && <p className="text-xs text-rose-200 mt-1">Needs attention</p>}
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-amber-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-amber-100 uppercase flex items-center gap-2">
                                <Calendar size={16} /> Monthly Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold font-outfit">₺{summary.monthlyRevenue.toLocaleString()}</div>
                            <p className="text-xs text-amber-200 mt-1">This Month</p>
                        </CardContent>
                    </Card>
                </div>
            ) : null}

            {summary?.topBrands && summary.topBrands.length > 0 && (
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="pb-2 text-gray-800">
                        <CardTitle className="text-lg">🏆 Top Paying Brands</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4 overflow-x-auto pb-4 pt-2">
                        {summary.topBrands.map((brand: any, index: number) => (
                            <div key={index} className="flex-shrink-0 bg-blue-50 border border-blue-100 rounded-lg p-4 min-w-[200px]">
                                <div className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-1">#{index + 1} Brand</div>
                                <div className="font-bold text-gray-900 truncate">{brand.name}</div>
                                <div className="text-lg text-blue-700 font-semibold font-outfit mt-2">₺{brand.value.toLocaleString()}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">All Scheduled Payments</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-900">Project / Deal</TableHead>
                            <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                            <TableHead className="font-semibold text-gray-900">Status</TableHead>
                            <TableHead className="font-semibold text-gray-900">Due Date</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
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
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium text-gray-900">{payment.deal?.title}</TableCell>
                                        <TableCell className="font-bold whitespace-nowrap text-gray-800">
                                            ₺{Number(payment.amount).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {trueStatus === PaymentStatus.PAID ? (
                                                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-none flex items-center w-fit gap-1">
                                                    <CheckCircle2 size={12} /> Paid
                                                </Badge>
                                            ) : trueStatus === PaymentStatus.PENDING ? (
                                                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-none flex items-center w-fit gap-1">
                                                    <Clock size={12} /> Pending
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-none flex items-center w-fit gap-1 shadow-sm border border-rose-100">
                                                    <XCircle size={12} /> Overdue
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-sm">
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
        </div>
    );
}
