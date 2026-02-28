"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import { PaymentStatus } from "@inf-crm/types";
import { toast } from "sonner";

export default function PaymentsList({ dealId }: { dealId: string }) {
    const queryClient = useQueryClient();

    const { data: payments, isLoading } = useQuery<any[]>({
        queryKey: ["payments", dealId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/payments?dealId=${dealId}`);
            return data;
        },
    });

    const sendEFaturaMutation = useMutation({
        mutationFn: async (id: string) => {
            return await apiClient.post(`/payments/${id}/send-efatura`);
        },
        onSuccess: () => {
            toast.success("e-Fatura simulated and logged successfully!");
            queryClient.invalidateQueries({ queryKey: ["activities", dealId] });
            queryClient.invalidateQueries({ queryKey: ["payments", dealId] });
        }
    });

    if (isLoading) return <div>Loading...</div>;

    const totalAmount = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const paidAmount = payments?.filter(p => p.status === PaymentStatus.PAID).reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold font-outfit">Payments</h3>
                    <p className="text-sm text-gray-500">Paid: ₺{paidAmount.toLocaleString()} / ₺{totalAmount.toLocaleString()}</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus size={16} className="mr-2" /> Add Payment
                </Button>
            </div>

            <div className="grid gap-3">
                {payments?.map((item) => (
                    <Card key={item.id} className="border-none shadow-sm hover:ring-1 hover:ring-green-100 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-50 rounded-full">
                                    {item.status === PaymentStatus.PAID && <CheckCircle2 className="text-green-500 w-5 h-5" />}
                                    {item.status === PaymentStatus.PENDING && <Clock className="text-orange-500 w-5 h-5" />}
                                    {item.status === PaymentStatus.OVERDUE && <XCircle className="text-red-500 w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        ₺{Number(item.amount).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={
                                    item.status === 'PAID' ? "default" :
                                        item.status === 'PENDING' ? "secondary" : "destructive"
                                } className={
                                    item.status === 'PAID' ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" :
                                        item.status === 'PENDING' ? "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none" : ""
                                }>
                                    {item.status}
                                </Badge>
                                {item.status === 'PENDING' && (
                                    <Button size="sm" variant="outline" className="h-8 gap-1 border-slate-200 hover:bg-slate-50 text-slate-600" onClick={() => sendEFaturaMutation.mutate(item.id)}>
                                        <FileText size={14} /> Send e-Fatura
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {payments?.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400">No payments added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
