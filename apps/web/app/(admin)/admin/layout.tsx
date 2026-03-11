"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Server, Activity, Users, LogOut, ChevronLeft, Loader2, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["auth-me-admin"],
        queryFn: async () => {
            const { data } = await apiClient.get("/auth/me");
            return data;
        },
        retry: false,
    });

    useEffect(() => {
        if (!isLoading) {
            if (isError || !user) {
                router.push("/login");
            } else if (user.role !== "SUPER_ADMIN") {
                router.push("/dashboard");
            }
        }
    }, [user, isLoading, isError, router]);

    if (isLoading || !user || user.role !== "SUPER_ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0B0F19] text-white">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#0B0F19] text-slate-300 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Dark Sidebar specifically for Super Admin */}
            <div className={cn(
                "fixed inset-y-0 left-0 md:relative w-64 bg-[#111827] border-r border-slate-800/60 flex flex-col items-stretch shrink-0 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60 bg-gradient-to-r from-indigo-900/20 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <ShieldAlert size={18} />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">INF ADMIN</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 py-6 flex-1 space-y-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Platform Yönetimi</div>

                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-inner">
                        <Activity size={18} />
                        Genel Bakış
                    </Link>

                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
                        <Users size={18} />
                        Kiracılar (Tenants)
                    </Link>

                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors">
                        <Server size={18} />
                        Sistem Logları
                    </Link>
                </div>

                <div className="p-4 border-t border-slate-800/60">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft size={18} />
                        CRM'e Dön
                    </button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            router.push("/login");
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0F19] to-[#0B0F19]">
                <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-4 md:px-8 bg-[#111827]/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-slate-800 text-slate-300 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="text-sm font-medium text-slate-400 hidden sm:inline-block">Platform İşletimi</span>
                        <span className="text-slate-600 hidden sm:inline-block">/</span>
                        <span className="text-sm font-bold text-slate-200">Canlı Metrikler</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-400">Sistem Sağlıklı</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
