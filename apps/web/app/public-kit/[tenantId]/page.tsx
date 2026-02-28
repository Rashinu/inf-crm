"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Heart, Share2, Instagram, Video } from "lucide-react";

export default function PublicKitPage() {
    const params = useParams();
    const tenantId = params.tenantId as string;

    const { data: mediaKit, isLoading, isError } = useQuery<any>({
        queryKey: ["media-kit", tenantId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/portal/media-kit/${tenantId}`);
            return data;
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (isError || !mediaKit) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Media Kit not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-inter">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <Badge className="bg-white/10 text-white border-white/20 mb-6 hover:bg-white/20 px-4 py-1.5 backdrop-blur-md">
                        <Sparkles size={14} className="mr-2 text-yellow-300" /> Official Media Kit
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black text-white font-outfit tracking-tight mb-6 drop-shadow-sm">
                        {mediaKit.tenantName}
                    </h1>
                    <p className="text-xl text-indigo-100 font-medium max-w-2xl mx-auto opacity-90 leading-relaxed">
                        A premium influencer agency shaping modern storytelling. We connect the world's most dynamic brands with highly engaged audiences.
                    </p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-20 space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-slate-900/5 hover:-translate-y-1 transition-transform duration-300">
                        <CardContent className="p-8 text-center bg-gradient-to-b from-white to-transparent">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Users size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">Total Reach</p>
                            <p className="text-5xl font-black text-slate-900 font-outfit">{mediaKit.stats.instagramFollowers}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-slate-900/5 hover:-translate-y-1 transition-transform duration-300 delay-100">
                        <CardContent className="p-8 text-center bg-gradient-to-b from-white to-transparent">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Heart size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">Avg Engagement</p>
                            <p className="text-5xl font-black text-slate-900 font-outfit">{mediaKit.stats.averageEngagementRate}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-slate-900/5 hover:-translate-y-1 transition-transform duration-300 delay-200">
                        <CardContent className="p-8 text-center bg-gradient-to-b from-white to-transparent">
                            <div className="w-14 h-14 bg-fuchsia-50 text-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Share2 size={28} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">Total Views</p>
                            <p className="text-5xl font-black text-slate-900 font-outfit">{mediaKit.stats.tiktokLikes}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brands */}
                    <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden ring-1 ring-slate-100">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-black text-slate-900 font-outfit mb-6 flex items-center gap-2">
                                Trusted By ({mediaKit.totalCompletedDeals} Deals)
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {mediaKit.brandsWorkedWith.map((b: string) => (
                                    <Badge key={b} variant="secondary" className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border-none font-semibold">
                                        {b}
                                    </Badge>
                                ))}
                                {mediaKit.brandsWorkedWith.length === 0 && <p className="text-slate-400 italic">No brands yet</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Platforms */}
                    <Card className="border-none shadow-md bg-slate-900 text-white rounded-3xl overflow-hidden">
                        <CardContent className="p-8 h-full flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full filter blur-[64px] opacity-30"></div>
                            <h3 className="text-2xl font-black font-outfit mb-6 flex items-center gap-2 relative z-10">
                                Primary Platforms
                            </h3>
                            <div className="flex flex-wrap gap-4 relative z-10">
                                {mediaKit.platforms.includes('INSTAGRAM') && (
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                                        <Instagram className="text-pink-400" /> <span className="font-bold tracking-wide">Instagram</span>
                                    </div>
                                )}
                                {mediaKit.platforms.includes('TIKTOK') && (
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                                        <Video className="text-cyan-400" /> <span className="font-bold tracking-wide">TikTok</span>
                                    </div>
                                )}
                                {mediaKit.platforms.includes('YOUTUBE') && (
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-sm">
                                        <Video className="text-red-500" /> <span className="font-bold tracking-wide">YouTube</span>
                                    </div>
                                )}
                                {mediaKit.platforms.length === 0 && <p className="text-white/50 italic">No platforms specified</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center pt-8 border-t border-slate-100">
                    <p className="text-slate-400 font-medium">Want to start a campaign?</p>
                    <a href="mailto:hello@influencer.agency" className="inline-block mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                        Contact Us Today
                    </a>
                </div>
            </main>
        </div>
    );
}
