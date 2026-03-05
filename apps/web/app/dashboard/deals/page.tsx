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
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DealsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { t } = useLanguage();

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
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-outfit">{t("deals.title")}</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">{t("deals.subtitle")}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                            <TableHead className="font-semibold text-gray-900 dark:text-slate-200">{t("common.title")}</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-slate-200">{t("common.brand")}</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-slate-200">{t("common.stage")}</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-slate-200">{t("common.value")}</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-slate-200">{t("common.platform")}</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-slate-200 text-right">{t("common.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    {t("common.loading")}
                                </TableCell>
                            </TableRow>
                        ) : deals?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    {t("deals.no_deals")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            deals?.map((deal) => (
                                <TableRow key={deal.id} className="border-gray-100 dark:border-slate-800 dark:hover:bg-slate-800/30">
                                    <TableCell className="font-medium text-gray-900 dark:text-white">{deal.title}</TableCell>
                                    <TableCell className="text-gray-600 dark:text-slate-400">{deal.brand?.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize dark:border-slate-700 dark:text-slate-300">
                                            {t(`stage.${deal.stage}`)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium dark:text-white">₺{deal.totalAmount?.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border-none">
                                            {deal.platform}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-slate-400">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/deals/${deal.id}`)}>
                                                    <Eye className="mr-2 size-4" /> {t("deals.view_details")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer" onClick={() => deleteMutation.mutate(deal.id)}>
                                                    <Trash2 className="mr-2 size-4" /> {t("deals.delete_deal")}
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
