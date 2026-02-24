"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { DeliverableStatus } from "@inf-crm/types";

export default function DeliverablesList({ dealId }: { dealId: string }) {
    const queryClient = useQueryClient();

    const { data: deliverables, isLoading } = useQuery<any[]>({
        queryKey: ["deliverables", dealId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/deliverables?dealId=${dealId}`);
            return data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: DeliverableStatus }) => {
            return apiClient.patch(`/deliverables/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deliverables", dealId] });
        },
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-outfit">Deliverables</h3>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus size={16} className="mr-2" /> Add Deliverable
                </Button>
            </div>

            <div className="grid gap-3">
                {deliverables?.map((item) => (
                    <Card key={item.id} className="border-none shadow-sm hover:ring-1 hover:ring-blue-100 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateStatusMutation.mutate({
                                        id: item.id,
                                        status: item.status === DeliverableStatus.DONE ? DeliverableStatus.TODO : DeliverableStatus.DONE
                                    })}
                                >
                                    {item.status === DeliverableStatus.DONE ? (
                                        <CheckCircle2 className="text-green-500" />
                                    ) : (
                                        <Circle className="text-gray-300" />
                                    )}
                                </Button>
                                <div>
                                    <p className={`font-medium ${item.status === DeliverableStatus.DONE ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                        {item.quantity}x {item.type}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase">
                                {item.status}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
                {deliverables?.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400">No deliverables added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
