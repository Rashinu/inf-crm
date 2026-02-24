"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Brand } from "@/types/brand";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Globe, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
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

import { useRouter } from "next/navigation";

export default function BrandsPage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data: brands, isLoading } = useQuery<Brand[]>({
        queryKey: ["brands"],
        queryFn: async () => {
            const { data } = await apiClient.get("/brands");
            console.log("API Brands Response:", data);
            return data;
        },
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const createMutation = useMutation({
        mutationFn: async (newBrand: any) => {
            return apiClient.post("/brands", newBrand);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Brand created successfully");
            setIsAddOpen(false);
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create brand");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/brands/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
            toast.success("Brand deleted");
        },
    });

    const onSubmit = (data: any) => {
        createMutation.mutate(data);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Brands</h1>
                    <p className="text-gray-500 mt-1">Manage all brands and companies you work with.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 size-4" /> Add Brand
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Brand</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Brand Name</Label>
                                <Input id="name" placeholder="Acme Corp" {...register("name", { required: "Name is required" })} />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input id="website" placeholder="https://acme.com" {...register("website")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Input id="notes" placeholder="Brief info about the brand" {...register("notes")} />
                            </div>
                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Creating..." : "Save Brand"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-900">Brand Name</TableHead>
                            <TableHead className="font-semibold text-gray-900">Website</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-center">Contacts</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-center">Deals</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    Loading brands...
                                </TableCell>
                            </TableRow>
                        ) : !Array.isArray(brands) || brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No brands found. Add your first brand to get started!
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand) => (
                                <TableRow
                                    key={brand.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => router.push(`/dashboard/brands/${brand.id}`)}
                                >
                                    <TableCell className="font-medium text-gray-900">{brand.name}</TableCell>
                                    <TableCell>
                                        {brand.website ? (
                                            <a
                                                href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center text-blue-600 hover:underline gap-1.5 text-sm"
                                            >
                                                <Globe size={14} />
                                                {(() => {
                                                    try {
                                                        return new URL(brand.website.startsWith('http') ? brand.website : `https://${brand.website}`).hostname;
                                                    } catch {
                                                        return brand.website;
                                                    }
                                                })()}
                                                <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center font-medium">{brand._count?.contacts || 0}</TableCell>
                                    <TableCell className="text-center font-medium">{brand._count?.deals || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/dashboard/brands/${brand.id}`)
                                                }}>
                                                    View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer" onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMutation.mutate(brand.id)
                                                }}>
                                                    <Trash2 className="mr-2 size-4" />
                                                    Delete Brand
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
