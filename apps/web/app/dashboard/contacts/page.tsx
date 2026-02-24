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
import { Plus, Mail, Phone, User, Trash2 } from "lucide-react";
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Contacts</h1>
                    <p className="text-gray-500 mt-1">Direct access to brand representatives.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 size-4" /> Add Contact
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-semibold text-gray-900">Name</TableHead>
                            <TableHead className="font-semibold text-gray-900">Brand</TableHead>
                            <TableHead className="font-semibold text-gray-900">Contact Info</TableHead>
                            <TableHead className="font-semibold text-gray-900">Position</TableHead>
                            <TableHead className="font-semibold text-gray-900 text-right">Actions</TableHead>
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
                                    <TableCell className="font-medium text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold font-outfit">
                                                {contact.name.charAt(0)}
                                            </div>
                                            {contact.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 font-medium">{contact.brand?.name}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {contact.email && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Mail size={12} /> {contact.email}
                                                </div>
                                            )}
                                            {contact.phone && (
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Phone size={12} /> {contact.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">{contact.position || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => deleteMutation.mutate(contact.id)}
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
