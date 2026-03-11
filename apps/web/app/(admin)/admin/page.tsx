"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, Server, DollarSign, Activity, ChevronRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

// Mock Data for Traffic since the backend doesn't serve historical traffic yet
const trafficData = [
    { time: '00:00', users: 12 },
    { time: '04:00', users: 8 },
    { time: '08:00', users: 45 },
    { time: '12:00', users: 89 },
    { time: '16:00', users: 76 },
    { time: '20:00', users: 34 },
    { time: '24:00', users: 15 },
];

export default function SuperAdminDashboard() {
    const { data: stats, isLoading: isStatsLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const { data } = await apiClient.get("/admin/stats");
            return data;
        }
    });

    const { data: logins, isLoading: isLoginsLoading } = useQuery({
        queryKey: ["admin-logins"],
        queryFn: async () => {
            const { data } = await apiClient.get("/admin/logins");
            return data;
        }
    });
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Genel Bakış</h1>
                <p className="text-slate-400">Tüm sistemin canlı durumu, kayıtlı ajanslar ve anlık trafik akışı.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Toplam Kiracı (Ajans)", value: isStatsLoading ? "..." : stats?.totalTenants, sub: "Sistemdeki aktif ajanslar", icon: Server, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { title: "Toplam Kullanıcı", value: isStatsLoading ? "..." : stats?.totalUsers, sub: "Tüm platformdaki hesaplar", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { title: "Aylık Ciro (MRR)", value: isStatsLoading ? "..." : `₺${stats?.mrr?.toLocaleString()}`, sub: "Öngörülen aylık gelir", icon: DollarSign, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                    { title: "Aktif İşlemler (Deals)", value: isStatsLoading ? "..." : stats?.activeDeals, sub: "Açık sözleşmeler", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
                ].map((stat, i) => (
                    <Card key={i} className={`bg-[#111827] border-slate-800 ${stat.border} hover:bg-slate-800/80 transition-all`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <p className="text-xs text-slate-500">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <Card className="col-span-2 bg-[#111827] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                            <Activity className="text-indigo-400" size={18} />
                            24 Saatlik Platform Trafiği
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#818cf8' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Agencies List */}
                <Card className="bg-[#111827] border-slate-800 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-white flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Server className="text-emerald-400" size={18} />
                                Aktif Ajanslar
                            </span>
                            <span className="text-xs text-indigo-400 font-normal cursor-pointer hover:text-indigo-300">Tümü</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pr-2">
                        <div className="space-y-4">
                            {!isLoginsLoading && logins?.slice(0, 5).map((log: any) => (
                                <div key={log.id} className="flex flex-col gap-2 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">{log.tenant}</div>
                                        <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                                            Aktif
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                        <span className="flex items-center gap-1"><Users size={12} /> {log.user}</span>
                                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">{formatDistanceToNow(new Date(log.time), { addSuffix: true, locale: tr })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Login Sessions Table */}
            <Card className="bg-[#111827] border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                        <ShieldAlert className="text-rose-400" size={18} />
                        Gerçek Zamanlı Giriş Kayıtları (Audit Log)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 rounded-lg">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Kullanıcı</th>
                                    <th className="px-4 py-3">Ajans (Tenant)</th>
                                    <th className="px-4 py-3">IP Adresi</th>
                                    <th className="px-4 py-3">Cihaz / Sistem</th>
                                    <th className="px-4 py-3">Zaman</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoginsLoading && logins?.map((log: any) => (
                                    <tr key={log.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-200">{log.user}</td>
                                        <td className="px-4 py-3 text-slate-400">{log.tenant}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.ip}</td>
                                        <td className="px-4 py-3 text-slate-400">{log.os}</td>
                                        <td className="px-4 py-3 text-slate-500">{formatDistanceToNow(new Date(log.time), { addSuffix: true, locale: tr })}</td>
                                        <td className="px-4 py-3">
                                            {log.status === 'success' ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none hover:bg-emerald-500/20"><CheckCircle2 size={12} className="mr-1" /> Başarılı</Badge>
                                            ) : (
                                                <Badge className="bg-rose-500/10 text-rose-400 border-none hover:bg-rose-500/20"><ShieldAlert size={12} className="mr-1" /> Başarısız</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
