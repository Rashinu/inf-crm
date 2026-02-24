"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Users, FileText, ArrowLeft, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BrandProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const { data: brand, isLoading } = useQuery<any>({
        queryKey: ["brand", id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/brands/${id}`);
            return data;
        },
    });

    if (isLoading) return <div className="p-8">Loading brand details...</div>;
    if (!brand) return <div className="p-8">Brand not found.</div>;

    const totalDeals = brand.deals?.length || 0;
    const activeDeals = brand.deals?.filter((d: any) => d.stage !== 'COMPLETED' && d.stage !== 'LOST' && d.stage !== 'CANCELLED').length || 0;
    const totalEarned = brand.deals?.filter((d: any) => d.stage === 'COMPLETED').reduce((acc: number, curr: any) => acc + Number(curr.totalAmount || 0), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">{brand.name}</h1>
                    {brand.website && (
                        <a href={brand.website.startsWith('http') ? brand.website : `https://${brand.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 mt-1 text-sm">
                            <Globe size={14} /> {brand.website}
                        </a>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-gradient-to-br from-white to-blue-50/30">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Earned</p>
                        <p className="text-3xl font-bold text-gray-900">₺{totalEarned.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">From completed deals</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm text-center md:text-left">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Deals</p>
                        <p className="text-3xl font-bold text-blue-600">{activeDeals}</p>
                        <p className="text-xs text-gray-400 mt-1">out of {totalDeals} total</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm text-center md:text-left">
                    <CardContent className="p-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Contacts</p>
                        <p className="text-3xl font-bold text-gray-900">{brand.contacts?.length || 0}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Deals */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText size={18} className="text-gray-400" /> Recent Deals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {brand.deals?.length === 0 ? (
                                <p className="text-sm text-gray-500">No deals associated with this brand yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {brand.deals?.map((deal: any) => (
                                        <div key={deal.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => router.push(`/dashboard/deals/${deal.id}`)}>
                                            <div>
                                                <p className="font-semibold text-gray-900">{deal.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(deal.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="mb-1">{deal.stage}</Badge>
                                                <p className="text-sm font-medium">₺{Number(deal.totalAmount || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Details & Contacts */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Building2 size={18} className="text-gray-400" /> Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {brand.notes ? (
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{brand.notes}</p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No additional notes.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users size={18} className="text-gray-400" /> Contacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {brand.contacts?.length === 0 ? (
                                <p className="text-sm text-gray-500">No contacts found.</p>
                            ) : (
                                <div className="space-y-4">
                                    {brand.contacts?.map((contact: any) => (
                                        <div key={contact.id} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                                            <span className="font-semibold text-sm text-gray-900">{contact.name}</span>
                                            <span className="text-xs text-gray-500">{contact.position || "No position"}</span>
                                            {contact.email && (
                                                <a href={`mailto:${contact.email}`} className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                                    <Mail size={12} /> {contact.email}
                                                </a>
                                            )}
                                            {contact.phone && (
                                                <span className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                                    <Phone size={12} /> {contact.phone}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
