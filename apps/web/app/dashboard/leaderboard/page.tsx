"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Trophy, Star, TrendingUp, Handshake, AlertCircle, CalendarClock, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
    const { data: leaderboard, isLoading } = useQuery<any[]>({
        queryKey: ["leaderboard"],
        queryFn: async () => {
            const { data } = await apiClient.get("/contacts/leaderboard");
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Top 3 gets special styling
    const topThree = leaderboard?.slice(0, 3) || [];
    const rest = leaderboard?.slice(3) || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit tracking-tight flex items-center gap-3">
                    <Trophy className="size-8 text-amber-500" />
                    Influencer Leaderboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl leading-relaxed">
                    Track the performance, reliability, and lifetime value of all your contacts and influencers.
                    The score is determined by on-time delivery rates, total revenue generated, and active collaborations.
                </p>
            </div>

            {/* Top 3 Podium */}
            {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    {topThree.map((contact, idx) => {
                        const rankColors = [
                            "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-amber-200 text-amber-900", // Gold
                            "bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400 border-slate-200 text-slate-800", // Silver
                            "bg-gradient-to-br from-orange-200 via-amber-600 to-amber-800 border-amber-700 text-amber-50" // Bronze
                        ];
                        const iconColors = ["text-amber-100", "text-slate-100", "text-orange-200"];

                        return (
                            <Card
                                key={contact.id}
                                className={cn(
                                    "relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0",
                                    rankColors[idx],
                                    idx === 0 ? "md:-mt-6 md:mb-6 shadow-xl" : "shadow-lg"
                                )}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                                    <Star className={cn("size-24", iconColors[idx])} />
                                </div>
                                <div className="relative p-6 z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-white/30">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl truncate">{contact.name}</h3>
                                            <p className="text-sm font-medium opacity-80">{contact.brandName}</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm font-bold mb-1">
                                                <span>Trust Score</span>
                                                <span>{contact.score} / 100</span>
                                            </div>
                                            <Progress value={contact.score} className="h-2 bg-black/10" indicatorClassName="bg-white" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-black/10 rounded-lg p-2 backdrop-blur-sm">
                                                <p className="opacity-70 text-xs font-semibold mb-0.5">Total Revenue</p>
                                                <p className="font-bold">{formatCurrency(contact.totalLtv)}</p>
                                            </div>
                                            <div className="bg-black/10 rounded-lg p-2 backdrop-blur-sm">
                                                <p className="opacity-70 text-xs font-semibold mb-0.5">On-Time Rate</p>
                                                <p className="font-bold">{contact.onTimeRate.toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Rest of the list */}
            {rest.length > 0 && (
                <Card className="border border-gray-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Influencer</th>
                                    <th className="px-6 py-4">Score</th>
                                    <th className="px-6 py-4 text-right">Lifetime Value (LTV)</th>
                                    <th className="px-6 py-4 text-center">On-Time Delivery</th>
                                    <th className="px-6 py-4 text-center">Active Deals</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                {rest.map((contact, idx) => (
                                    <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-slate-400 dark:text-slate-500">
                                            #{idx + 4}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">{contact.name}</div>
                                            <div className="text-xs text-slate-500">{contact.brandName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                                                    contact.score >= 80 ? "bg-green-100 text-green-700" :
                                                        contact.score >= 50 ? "bg-amber-100 text-amber-700" :
                                                            "bg-red-100 text-red-700"
                                                )}>
                                                    {contact.score}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                                            {formatCurrency(contact.totalLtv)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={cn(
                                                contact.onTimeRate >= 80 ? "bg-green-50 text-green-700 border-green-200" :
                                                    contact.onTimeRate >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                        "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {contact.onTimeRate.toFixed(0)}%
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full w-6 h-6 text-xs font-semibold">
                                                {contact.activeDeals}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {leaderboard?.length === 0 && (
                <Card className="p-12 text-center text-slate-500 flex flex-col items-center justify-center border-dashed">
                    <Target className="size-12 text-slate-300 mb-4" />
                    <h3 className="font-medium text-lg text-slate-900 dark:text-white">No data yet</h3>
                    <p className="text-sm">Start closing deals and adding deliverables to build your leaderboard.</p>
                </Card>
            )}
        </div>
    );
}
