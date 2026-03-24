"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Sparkles, Plus, Loader2, Instagram, Youtube, Twitter, MapPin, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";
import OutreachModal from "@/components/outreach/OutreachModal";

export default function DiscoveryPage() {
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [niche, setNiche] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isOutreachOpen, setIsOutreachOpen] = useState(false);

    const discoverMutation = useMutation({
        mutationFn: async (searchNiche: string) => {
            const { data } = await apiClient.post("/influencers/discover", { niche: searchNiche });
            return data;
        },
        onSuccess: (data) => {
            setResults(data);
            setSelectedIds([]);
            if (data.length === 0) toast.info("No influencers found for this niche.");
        },
        onError: () => {
            toast.error("AI failed to discover influencers. Please try again.");
        }
    });

    const addMutation = useMutation({
        mutationFn: async (influencers: any[]) => {
            const promises = influencers.map(inf => apiClient.post("/influencers", inf));
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["influencers"] });
            toast.success("Influencers added to CRM!");
            setSelectedIds([]);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add influencers");
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!niche) return;
        discoverMutation.mutate(niche);
    };

    const toggleSelect = (idx: number) => {
        setSelectedIds(prev => 
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === results.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(results.map((_, i) => i));
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform?.toUpperCase()) {
            case "INSTAGRAM": return <Instagram className="size-4 text-pink-500" />;
            case "YOUTUBE": return <Youtube className="size-4 text-red-500" />;
            case "TIKTOK": return <span className="font-bold text-[10px]">TT</span>;
            case "TWITTER": return <Twitter className="size-4 text-blue-400" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-outfit uppercase">
                    AI Influencer Discovery
                </h1>
                <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Search and find the perfect influencers for your niche instantly.
                </p>
                
                <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input 
                            placeholder="Try 'Eco-friendly life' or 'Gaming in UK'..." 
                            className="pl-10 h-14 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 shadow-xl focus-visible:ring-indigo-500 rounded-2xl"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xl rounded-2xl font-bold transition-all"
                        disabled={discoverMutation.isPending}
                    >
                        {discoverMutation.isPending ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <><Sparkles className="mr-2 size-5" /> Search</>
                        )}
                    </Button>
                </form>
            </div>

            {results.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <Checkbox 
                                id="select-all" 
                                checked={selectedIds.length === results.length}
                                onCheckedChange={toggleSelectAll}
                            />
                            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                Select All ({selectedIds.length})
                            </label>
                        </div>
                        <div className="flex gap-2">
                            {selectedIds.length > 0 && (
                                <>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="rounded-xl border-indigo-200 text-indigo-600 dark:border-indigo-900/50"
                                        onClick={() => setIsOutreachOpen(true)}
                                    >
                                        <Mail className="mr-2 size-4" /> Outreach
                                    </Button>
                                    <Button 
                                        size="sm"
                                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                                        onClick={() => addMutation.mutate(results.filter((_, i) => selectedIds.includes(i)))}
                                        disabled={addMutation.isPending}
                                    >
                                        <Plus className="mr-2 size-4" /> Add selected
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {results.map((inf, idx) => {
                            const isSelected = selectedIds.includes(idx);
                            return (
                                <Card 
                                    key={idx} 
                                    className={`relative overflow-hidden border-2 transition-all duration-300 bg-white dark:bg-slate-900 rounded-3xl group cursor-pointer ${
                                        isSelected ? "border-indigo-600 shadow-indigo-500/10 shadow-2xl" : "border-transparent shadow-md hover:shadow-xl hover:translate-y-[-4px]"
                                    }`}
                                    onClick={() => toggleSelect(idx)}
                                >
                                    <div className="absolute top-4 left-4 z-10">
                                        <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(idx)} />
                                    </div>
                                    <CardHeader className="pb-2 pt-12">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-none rounded-lg">
                                                {inf.category}
                                            </Badge>
                                            <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-xl">
                                                {getPlatformIcon(inf.platform)}
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-bold font-outfit truncate">
                                            {inf.name}
                                        </CardTitle>
                                        <p className="text-sm text-indigo-600 font-bold">{inf.handle}</p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                                            {inf.bio || "No bio available."}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-400 gap-1">
                                            <MapPin className="size-3" />
                                            {inf.location || "Unknown"}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 dark:bg-slate-800/50 p-2 rounded-2xl text-center">
                                                <p className="text-[9px] uppercase text-gray-400 font-bold">Followers</p>
                                                <p className="font-bold text-base">{(inf.followers / 1000).toFixed(1)}k</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-slate-800/50 p-2 rounded-2xl text-center">
                                                <p className="text-[9px] uppercase text-gray-400 font-bold">Engagement</p>
                                                <p className="font-bold text-base text-green-600">{inf.engagementRate}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-lg font-black font-outfit">₺{inf.pricePerPost?.toLocaleString()}</span>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className={`rounded-full ${isSelected ? "text-indigo-600" : ""}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addMutation.mutate([inf]);
                                                }}
                                            >
                                                {isSelected ? <CheckCircle2 className="size-5" /> : <Plus className="size-5" />}
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {!discoverMutation.isPending && results.length === 0 && (
                <div className="text-center py-20 bg-white/30 dark:bg-slate-900/30 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-slate-800">
                    <div className="size-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="size-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ready to discover?</h3>
                    <p className="text-gray-400">Enter a niche above to see our AI recommendations.</p>
                </div>
            )}

            <OutreachModal 
                isOpen={isOutreachOpen}
                onClose={() => setIsOutreachOpen(false)}
                selectedInfluencers={results.filter((_, i) => selectedIds.includes(i))}
            />
        </div>
    );
}
