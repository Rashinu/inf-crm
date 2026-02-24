"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    MoreHorizontal,
    Instagram,
    Youtube,
    Twitter,
    Music2,
    Globe,
    Sparkles,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealStage, Platform } from "@inf-crm/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

const STAGES = [
    { id: DealStage.LEAD, title: "Lead" },
    { id: DealStage.NEGOTIATION, title: "Negotiation" },
    { id: DealStage.APPROVED, title: "Approved" },
    { id: DealStage.COMPLETED, title: "Completed" },
];

export default function PipelinePage() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    const { data: deals, isLoading: loadingDeals } = useQuery<any[]>({
        queryKey: ["deals"],
        queryFn: async () => {
            const { data } = await apiClient.get("/deals");
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

    const updateStageMutation = useMutation({
        mutationFn: async ({ id, stage }: { id: string; stage: DealStage }) => {
            return apiClient.patch(`/deals/${id}/stage`, { stage });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
        },
        onError: () => {
            toast.error("Failed to update deal stage");
        },
    });

    const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm();

    const analyzeContractMutation = useMutation({
        mutationFn: async (text: string) => {
            return apiClient.post("/ai/analyze-contract", { text });
        },
        onSuccess: ({ data }) => {
            toast.success("AI Analysis Complete!");
            if (data.title) setValue("title", data.title);
            if (data.grossAmount) setValue("value", data.grossAmount);
            // Provide user manual control over brand selection:
            // (Brand is intentionally left untouched so the user can select it directly, just like Platform default)

            if (data.platforms && data.platforms.length > 0) {
                setValue("platform", data.platforms[0].toUpperCase());
            }
            setAiPrompt("");
        },
        onError: () => {
            toast.error("Failed to analyze contract");
        }
    });

    const handleAiAnalyze = () => {
        if (!aiPrompt) return toast.error("Please paste some text first");
        analyzeContractMutation.mutate(aiPrompt);
    };

    const createDealMutation = useMutation({
        mutationFn: async (newDeal: any) => {
            return apiClient.post("/deals", newDeal);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["deals"] });
            toast.success("Deal created successfully");
            setIsAddOpen(false);
            reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create deal");
        },
    });

    const onSubmit = (data: any) => {
        createDealMutation.mutate({
            ...data,
            value: data.value ? parseFloat(data.value) : 0,
        });
    };

    const onDragEnd = (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStage = destination.droppableId as DealStage;
        updateStageMutation.mutate({ id: draggableId, stage: newStage });
    };

    const getPlatformIcon = (platform: Platform) => {
        switch (platform) {
            case Platform.INSTAGRAM: return <Instagram size={14} className="text-pink-600" />;
            case Platform.YOUTUBE: return <Youtube size={14} className="text-red-600" />;
            case Platform.TIKTOK: return <Music2 size={14} className="text-black" />;
            default: return <Globe size={14} className="text-gray-600" />;
        }
    };

    if (loadingDeals) return <div className="p-8">Loading deals...</div>;

    return (
        <div className="space-y-8 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Deal Pipeline</h1>
                    <p className="text-gray-500 mt-1">Manage your collaborations and track progress.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 size-4" /> New Deal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Deal</DialogTitle>
                        </DialogHeader>

                        {/* AI Assistant Section */}
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3 mt-4">
                            <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                                <Sparkles className="size-4 text-blue-600" />
                                <span>AI Contract Autofill</span>
                            </div>
                            <Textarea
                                placeholder="Paste contract text, brief, or email here..."
                                className="bg-white border-blue-200 resize-none h-20 text-sm"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="w-full bg-white text-blue-700 hover:bg-blue-50 border-blue-200"
                                onClick={handleAiAnalyze}
                                disabled={analyzeContractMutation.isPending}
                            >
                                {analyzeContractMutation.isPending ? (
                                    <><Loader2 className="mr-2 size-3 animate-spin" /> Analyzing...</>
                                ) : "Auto-fill with AI"}
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Deal Title</Label>
                                <Input id="title" placeholder="Summer Campaign 2024" {...register("title", { required: "Title is required" })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Controller
                                        name="brandId"
                                        control={control}
                                        rules={{ required: "Brand is required" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select brand" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {brands?.map((brand) => (
                                                        <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Platform</Label>
                                    <Controller
                                        name="platform"
                                        control={control}
                                        defaultValue={Platform.INSTAGRAM}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value || Platform.INSTAGRAM}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select platform" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={Platform.INSTAGRAM}>Instagram</SelectItem>
                                                    <SelectItem value={Platform.YOUTUBE}>YouTube</SelectItem>
                                                    <SelectItem value={Platform.TIKTOK}>TikTok</SelectItem>
                                                    <SelectItem value={Platform.OTHER}>Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">Deal Value (₺)</Label>
                                <Input id="value" type="number" placeholder="5000" {...register("value")} />
                            </div>

                            <Button type="submit" className="w-full" disabled={createDealMutation.isPending}>
                                {createDealMutation.isPending ? "Creating..." : "Create Deal"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide min-h-[calc(100vh-250px)]">
                    {STAGES.map((stage) => {
                        const stageDeals = deals?.filter(d => d.stage === stage.id) || [];

                        return (
                            <div key={stage.id} className="flex flex-col w-80 shrink-0">
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold text-gray-900">{stage.title}</h2>
                                        <Badge variant="secondary" className="bg-gray-200/50 text-gray-600">
                                            {stageDeals.length}
                                        </Badge>
                                    </div>
                                </div>

                                <Droppable droppableId={stage.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex-1 bg-gray-100/50 border border-dashed border-gray-200 rounded-xl p-3 min-h-[400px]"
                                        >
                                            {stageDeals.map((deal, index) => (
                                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                    {(provided) => (
                                                        <Card
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => router.push(`/dashboard/deals/${deal.id}`)}
                                                            className="mb-3 border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                                                        >
                                                            <CardContent className="p-4 space-y-3">
                                                                <div className="flex justify-between items-start">
                                                                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-semibold text-[10px]">
                                                                        {deal.brand?.name}
                                                                    </Badge>
                                                                    <span className="text-xs text-gray-400 font-medium">₺{deal.totalAmount?.toLocaleString()}</span>
                                                                </div>
                                                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                                                    {deal.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 pt-1 border-t border-gray-50 mt-2">
                                                                    {getPlatformIcon(deal.platform as Platform)}
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                                        {deal.platform}
                                                                    </span>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}
