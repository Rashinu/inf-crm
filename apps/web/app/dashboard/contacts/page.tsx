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
import { Plus, Mail, Phone, Users, Trash2, Building2, UserPlus, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactsPage() {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data: contacts, isLoading: loadingContacts } = useQuery<any[]>({
        queryKey: ["contacts"],
        queryFn: async () => {
            const { data } = await apiClient.get("/contacts");
            return data;
        },
    });

    const { data: brands } = useQuery<any[]>({
        queryKey: ["brands"],
        queryFn: async () => {
            const { data } = await apiClient.get("/brands");
            return data;
        },
    });

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

    const createMutation = useMutation({
        mutationFn: async (newContact: any) => {
            return apiClient.post("/contacts", newContact);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success("Contact added successfully");
            setIsAddOpen(false);
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add contact");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/contacts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            toast.success("Contact deleted");
        },
    });

    const onSubmit = (data: any) => {
        createMutation.mutate(data);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Contacts Network</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage and connect with your brand representatives directly.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] rounded-xl font-bold px-5">
                            <UserPlus className="mr-2 size-4" /> Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Contact</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Controller
                                    name="brandId"
                                    control={control}
                                    rules={{ required: "Brand is required" }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a brand" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(brands) && brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.brandId && <p className="text-xs text-red-500">{errors.brandId.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" {...register("name", { required: "Name is required" })} />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@brand.com" {...register("email")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" placeholder="+90..." {...register("phone")} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input id="position" placeholder="Marketing Manager" {...register("position")} />
                            </div>

                            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Adding..." : "Add Contact"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={120} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-indigo-100 uppercase tracking-wider flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Users size={16} />
                            </div>
                            Total Contacts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black font-outfit tracking-tight text-white mt-1">
                            {contacts?.length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Building2 size={120} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Building2 size={16} />
                            </div>
                            Active Brands
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black font-outfit tracking-tight text-slate-900 mt-1">
                            {brands?.length || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <Fingerprint size={120} />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Fingerprint size={16} />
                            </div>
                            Network Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black font-outfit tracking-tight text-emerald-600 mt-1">
                            100%
                        </div>
                        <p className="text-xs font-medium text-emerald-500 mt-2 flex items-center gap-1">
                            Fully Connected
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 className="font-bold text-xl text-slate-900 font-outfit">Contact Directory</h2>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-100">
                        <TableRow className="hover:bg-slate-50 border-none">
                            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs py-4">Name</TableHead>
                            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs py-4">Brand</TableHead>
                            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs py-4">Contact Info</TableHead>
                            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs py-4">Position</TableHead>
                            <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs py-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingContacts ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    Loading contacts...
                                </TableCell>
                            </TableRow>
                        ) : !Array.isArray(contacts) || contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No contacts found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            contacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium text-slate-900 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${contact.brand?.name ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold font-outfit text-base">{contact.name}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {contact.brand?.name ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                {contact.brand.name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic text-sm">No Brand</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="space-y-1.5 cursor-default">
                                            {contact.email ? (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                                                    <div className="p-1 bg-slate-50 rounded-md text-slate-400"><Mail size={12} /></div>
                                                    {contact.email}
                                                </div>
                                            ) : null}
                                            {contact.phone ? (
                                                <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                                                    <div className="p-1 bg-slate-50 rounded-md text-slate-400"><Phone size={12} /></div>
                                                    {contact.phone}
                                                </div>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-slate-500 py-4">
                                        {contact.position || <span className="opacity-50">-</span>}
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to remove this contact?")) {
                                                    deleteMutation.mutate(contact.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
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
