"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Instagram, Youtube, Twitter, Globe, Calendar, Briefcase, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Copy, Save } from "lucide-react";

export default function InfluencerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const queryClient = useQueryClient();
    
    const [isConvertOpen, setIsConvertOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [generatedMessages, setGeneratedMessages] = useState<any>(null);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { register: registerAi, handleSubmit: handleSubmitAi, reset: resetAi } = useForm();

    const { data: influencer, isLoading } = useQuery<any>({
        queryKey: ["influencer", id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/influencers/${id}`);
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

    const createDealMutation = useMutation({
        mutationFn: async (payload: any) => {
            return apiClient.post("/deals", payload);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["influencer", id] });
            toast.success("Deal created successfully!");
            setIsConvertOpen(false);
            reset();
            // Automatically navigate to the new deal
            if (response.data?.id) {
                router.push(`/dashboard/deals/${response.data.id}`);
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create deal");
        },
    });

    const onConvertSubmit = (data: any) => {
        const payload = {
            ...data,
            platform: influencer?.platform || "INSTAGRAM",
            influencerId: influencer?.id,
            stage: "LEAD",
        };
        createDealMutation.mutate(payload);
    };

    const generateAiMutation = useMutation({
        mutationFn: async (payload: any) => {
            return apiClient.post("/ai/outreach-message", payload);
        },
        onSuccess: (response) => {
            setGeneratedMessages(response.data);
            toast.success("Messages generated!");
        },
        onError: () => toast.error("Failed to generate messages"),
    });

    const onGenerateSubmit = (data: any) => {
        generateAiMutation.mutate({
            influencerName: influencer.name,
            niche: influencer.category || data.niche,
            platform: influencer.platform,
            brandName: data.brandName,
            offerType: data.offerType,
        });
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const handleSendIGDM = () => {
        // Find best message
        const message = generatedMessages?.shortDm || `Hi ${influencer.name},\nLove your content! We'd love to collaborate.`;
        navigator.clipboard.writeText(message);
        toast.success("Message copied! Opening Instagram...");
        
        // Open Instagram app or web
        const igUrl = `https://instagram.com/${influencer.handle?.replace('@', '')}`;
        window.open(igUrl, "_blank");

        // Optimistically mark as contacted
        updateStatusMutation.mutate({ 
            outreachStatus: 'CONTACTED',
            lastContactDate: new Date().toISOString()
        });
    };

    const updateStatusMutation = useMutation({
        mutationFn: async (payload: any) => {
            return apiClient.patch(`/influencers/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["influencer", id] });
            toast.success("Status updated!");
        },
        onError: () => toast.error("Failed to update status"),
    });

    const handleStatusUpdate = (status: string) => {
        updateStatusMutation.mutate({ 
            outreachStatus: status,
            lastContactDate: new Date().toISOString()
        });
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!influencer) return <div className="p-8 text-center text-red-500">Influencer not found.</div>;

    const getPlatformIcon = (platform: string) => {
        switch (platform?.toUpperCase()) {
            case "INSTAGRAM": return <Instagram className="size-5 text-pink-500" />;
            case "YOUTUBE": return <Youtube className="size-5 text-red-500" />;
            case "TIKTOK": return <span className="font-bold">TT</span>;
            case "TWITTER": return <Twitter className="size-5 text-blue-400" />;
            default: return <Globe className="size-5 text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="size-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 border-b-0 pb-0">
                        {influencer.name}
                    </h1>
                    <p className="text-gray-500">{influencer.handle}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Badge variant="outline" className={
                        influencer.outreachStatus === 'DEAL_CREATED' ? 'bg-green-100 text-green-800' :
                        influencer.outreachStatus === 'REPLIED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                    }>
                        {influencer.outreachStatus || 'NEW'}
                    </Badge>
                    
                    {influencer.platform?.toUpperCase() === 'INSTAGRAM' && (
                        <Button 
                            variant="outline" 
                            className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 shadow-sm"
                            onClick={handleSendIGDM}
                        >
                            <Instagram className="mr-2 size-4" /> Send IG DM
                        </Button>
                    )}

                    <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                                <Bot className="mr-2 size-4" /> Generate Message
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Generate AI Outreach</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <form onSubmit={handleSubmitAi(onGenerateSubmit)} className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label>Brand Name</Label>
                                            <Input placeholder="E.g. XYZ Beauty" {...registerAi("brandName", { required: true })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Offer Type</Label>
                                            <Textarea placeholder="E.g. We want to send you our new product line for a dedicated reel." {...registerAi("offerType", { required: true })} />
                                        </div>
                                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={generateAiMutation.isPending}>
                                            {generateAiMutation.isPending ? "Generating..." : "Generate Magic"}
                                        </Button>
                                    </form>
                                </div>
                                <div className="border-l pl-6">
                                    {generateAiMutation.isPending ? (
                                        <div className="h-full flex items-center justify-center text-gray-500">AI is writing...</div>
                                    ) : generatedMessages ? (
                                        <Tabs defaultValue="shortDm">
                                            <TabsList className="grid w-full grid-cols-2 mb-2">
                                                <TabsTrigger value="shortDm">Short DM</TabsTrigger>
                                                <TabsTrigger value="emailVersion">Email</TabsTrigger>
                                                <TabsTrigger value="casualTone">Casual</TabsTrigger>
                                                <TabsTrigger value="professionalTone">Pro</TabsTrigger>
                                            </TabsList>
                                            {['shortDm', 'emailVersion', 'casualTone', 'professionalTone'].map(tone => (
                                                <TabsContent key={tone} value={tone} className="space-y-4">
                                                    <div className="bg-gray-50 rounded-md p-4 min-h-[150px] whitespace-pre-wrap text-sm text-gray-700">
                                                        {generatedMessages[tone]}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => handleCopy(generatedMessages[tone])}>
                                                            <Copy className="mr-2 size-4" /> Copy
                                                        </Button>
                                                        <Button variant="outline" size="sm">
                                                            <Save className="mr-2 size-4" /> Save as Template
                                                        </Button>
                                                    </div>
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">
                                            Fill the details and generate to see results here.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isConvertOpen} onOpenChange={setIsConvertOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                                <Briefcase className="mr-2 size-4" /> Convert to Deal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Convert Influencer to Deal</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onConvertSubmit)} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Deal Title</Label>
                                    <Input 
                                        id="title" 
                                        placeholder={`E.g. ${influencer.name} - Autumn Campaign`} 
                                        {...register("title", { required: "Deal title is required" })} 
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brandId">Brand</Label>
                                    <select 
                                        id="brandId" 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register("brandId", { required: "Please select a brand" })}
                                    >
                                        <option value="">Select a brand...</option>
                                        {brands?.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                    {errors.brandId && <p className="text-xs text-red-500">{errors.brandId.message as string}</p>}
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" className="w-full" disabled={createDealMutation.isPending}>
                                        {createDealMutation.isPending ? "Creating..." : "Create Deal"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Overview */}
                <Card className="md:col-span-2 border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {getPlatformIcon(influencer.platform)} Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Followers</p>
                                <p className="text-xl font-bold">{influencer.followers?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Engagement</p>
                                <p className="text-xl font-bold text-green-600">{influencer.engagementRate}%</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Price Per Post</p>
                                <p className="text-xl font-bold">{influencer.pricePerPost} {influencer.currency}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Category</p>
                                <Badge variant="secondary">{influencer.category}</Badge>
                            </div>
                        </div>

                        {influencer.profileUrl && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-500 mb-1">Profile Link</p>
                                <a href={influencer.profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                    {influencer.profileUrl} <Globe className="size-3" />
                                </a>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-8 border-t pt-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                                <p>{influencer.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                                <p>{influencer.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Country</p>
                                <p>{influencer.country || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Added On</p>
                                <p>{format(new Date(influencer.createdAt), "PPP")}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Outreach Tracking */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="size-5 text-indigo-500" /> Outreach Tracking
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Button 
                                variant={influencer.outreachStatus === 'CONTACTED' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleStatusUpdate('CONTACTED')}
                                disabled={updateStatusMutation.isPending}
                            >
                                Mark Contacted
                            </Button>
                            <Button 
                                variant={influencer.outreachStatus === 'REPLIED' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleStatusUpdate('REPLIED')}
                                disabled={updateStatusMutation.isPending}
                            >
                                Mark Replied
                            </Button>
                            <Button 
                                variant={influencer.outreachStatus === 'INTERESTED' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => handleStatusUpdate('INTERESTED')}
                                disabled={updateStatusMutation.isPending}
                            >
                                Interested
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => alert("Follow-up scheduling coming soon")}>
                                Schedule Follow-up
                            </Button>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Last Contact Date</p>
                            <p>{influencer.lastContactDate ? format(new Date(influencer.lastContactDate), "PPP") : "Not contacted yet"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Next Follow Up</p>
                            <p className="text-orange-600 font-medium">{influencer.nextFollowUpDate ? format(new Date(influencer.nextFollowUpDate), "PPP") : "None scheduled"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md min-h-[80px]">
                                {influencer.outreachNotes || "No notes available."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Linked Deals */}
                <Card className="md:col-span-3 border-gray-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="size-5 text-blue-500" /> Linked Deals ({influencer.deals?.length || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {influencer.deals?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {influencer.deals.map((deal: any) => (
                                    <Link key={deal.id} href={`/dashboard/deals/${deal.id}`} className="block">
                                        <div className="border rounded-lg p-4 hover:border-blue-300 transition-colors bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                                                <Badge variant="outline">{deal.stage}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">{deal.brand?.name}</p>
                                            <p className="font-medium text-green-600">{deal.totalAmount} {deal.currency}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 py-4 text-center">No deals created for this influencer yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
