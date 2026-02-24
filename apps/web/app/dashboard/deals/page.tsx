"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { Plus, MoreVertical, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function DealsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: deals, isLoading } = useQuery<any[]>({
        queryKey: ["deals"],
        queryFn: async () => {
            const { data } = await apiClient.get("/deals");
            return data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/deals/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            toast.success("Deal deleted");
        },
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Deals</h1>
                    <p className="text-gray-500 mt-1">Full list of all active and past collaborations.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-900">Title</TableHead>
                            <TableHead className="font-semibold text-gray-900">Brand</TableHead>
                            <TableHead className="font-semibold text-gray-900">Stage</TableHead>
                            <TableHead className="font-semibold text-gray-900">Value</TableHead>
                            <TableHead className="font-semibold text-gray-900">Platform</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    Loading deals...
                                </TableCell>
                            </TableRow>
                        ) : deals?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    No deals found. Create one from the Pipeline page!
                                </TableCell>
                            </TableRow>
                        ) : (
                            deals?.map((deal) => (
                                <TableRow key={deal.id}>
                                    <TableCell className="font-medium text-gray-900">{deal.title}</TableCell>
                                    <TableCell className="text-gray-600">{deal.brand?.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {deal.stage.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">₺{deal.totalAmount?.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-none">
                                            {deal.platform}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/deals/${deal.id}`)}>
                                                    <Eye className="mr-2 size-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer" onClick={() => deleteMutation.mutate(deal.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Delete Deal
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
