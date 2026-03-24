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
import { Plus, Users, Search, Filter, MoreVertical, Trash2, Instagram, Youtube, Twitter, Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Link from "next/link";

export default function InfluencersPage() {
    const queryClient = useQueryClient();
    const { t } = useLanguage();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: influencers, isLoading } = useQuery<any[]>({
        queryKey: ["influencers"],
        queryFn: async () => {
            const { data } = await apiClient.get("/influencers");
            return data;
        },
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const createMutation = useMutation({
        mutationFn: async (newInfluencer: any) => {
            return apiClient.post("/influencers", newInfluencer);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["influencers"] });
            toast.success("Influencer added successfully");
            setIsAddOpen(false);
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add influencer");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/influencers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["influencers"] });
            toast.success("Influencer removed");
        },
    });

    const onSubmit = (data: any) => {
        // Convert numbers
        const payload = {
            ...data,
            followers: data.followers ? parseInt(data.followers) : 0,
            engagementRate: data.engagementRate ? parseFloat(data.engagementRate) : 0,
            pricePerPost: data.pricePerPost ? parseFloat(data.pricePerPost) : 0,
        };
        createMutation.mutate(payload);
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform?.toUpperCase()) {
            case "INSTAGRAM": return <Instagram className="size-4 text-pink-500" />;
            case "YOUTUBE": return <Youtube className="size-4 text-red-500" />;
            case "TIKTOK": return <span className="font-bold text-xs">TT</span>;
            case "TWITTER": return <Twitter className="size-4 text-blue-400" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-outfit">
                        {t("influencers.title")}
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        {t("influencers.subtitle")}
                    </p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                            <Plus className="mr-2 size-4" /> {t("influencers.new_influencer")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{t("influencers.new_influencer")}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 pt-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name">{t("contacts.label_name")}</Label>
                                <Input id="name" placeholder="Jane Doe" {...register("name", { required: "Name is required" })} />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platform">{t("influencers.label_platform")}</Label>
                                <select 
                                    id="platform" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("platform")}
                                >
                                    <option value="INSTAGRAM">Instagram</option>
                                    <option value="TIKTOK">TikTok</option>
                                    <option value="YOUTUBE">YouTube</option>
                                    <option value="TWITTER">Twitter</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="handle">Handle (@username)</Label>
                                <Input id="handle" placeholder="@janedoe" {...register("handle")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profileUrl">Profile URL</Label>
                                <Input id="profileUrl" placeholder="https://instagram.com/..." {...register("profileUrl")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="followers">{t("influencers.label_followers")}</Label>
                                <Input id="followers" type="number" placeholder="50000" {...register("followers")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="engagementRate">{t("influencers.label_engagement")} (%)</Label>
                                <Input id="engagementRate" type="number" step="0.01" placeholder="3.5" {...register("engagementRate")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">{t("influencers.label_category")}</Label>
                                <Input id="category" placeholder="Beauty, Fashion" {...register("category")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pricePerPost">{t("influencers.label_price")} (TRY)</Label>
                                <Input id="pricePerPost" type="number" placeholder="1500" {...register("pricePerPost")} />
                            </div>
                            <div className="col-span-2 pt-2">
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? t("common.loading") : t("common.save")}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Influencers</p>
                            <h3 className="text-2xl font-bold dark:text-white">{influencers?.length || 0}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                            <Instagram size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Top Platform</p>
                            <h3 className="text-2xl font-bold dark:text-white">Instagram</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Avg. Engagement</p>
                            <h3 className="text-2xl font-bold dark:text-white">4.2%</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input 
                            placeholder={t("common.search")} 
                            className="pl-10 bg-gray-50 dark:bg-slate-800/50 border-none focus-visible:ring-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="dark:border-slate-800 dark:hover:bg-slate-800">
                            <Filter className="mr-2 size-4" /> Filters
                        </Button>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-slate-800/50 hover:bg-transparent border-gray-100 dark:border-slate-800">
                            <TableHead className="font-semibold">{t("contacts.label_name")}</TableHead>
                            <TableHead className="font-semibold">{t("influencers.label_platform")}</TableHead>
                            <TableHead className="font-semibold">{t("influencers.label_followers")}</TableHead>
                            <TableHead className="font-semibold">{t("influencers.label_engagement")}</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold text-right">{t("common.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                                    {t("common.loading")}
                                </TableCell>
                            </TableRow>
                        ) : influencers?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                                    {t("influencers.no_influencers")}
                                </TableCell>
                            </TableRow>
                        ) : (
                            influencers?.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((influencer) => (
                                <TableRow key={influencer.id} className="border-gray-50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{influencer.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-500">{influencer.handle}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getPlatformIcon(influencer.platform)}
                                            <span className="text-xs font-medium uppercase">{influencer.platform}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{influencer.followers?.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-none font-bold">
                                            {influencer.engagementRate}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            influencer.outreachStatus === 'DEAL_CREATED' ? 'bg-green-100 text-green-800' :
                                            influencer.outreachStatus === 'REPLIED' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }>
                                            {influencer.outreachStatus || 'NEW'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/influencers/${influencer.id}`}>
                                                        <Eye className="mr-2 size-4" /> View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    apiClient.post(`/influencers/${influencer.id}/invite`)
                                                        .then(({ data }) => {
                                                            const link = `${window.location.origin}/portal/influencer?token=${data.invitationToken}`;
                                                            navigator.clipboard.writeText(link);
                                                            toast.success("Invitation link copied to clipboard!");
                                                        })
                                                        .catch(() => toast.error("Failed to generate invite link"));
                                                }}>
                                                    <Plus className="mr-2 size-4" /> Generate & Copy Link
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteMutation.mutate(influencer.id)}>
                                                    <Trash2 className="mr-2 size-4" /> Remove
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
