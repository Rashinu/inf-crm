"use client";

import { Sidebar } from "./sidebar";
import { User, Bell, Search } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import GlobalSearch from "./global-search";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { useRouter } from "next/navigation";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const { data } = await apiClient.get("/auth/me");
                setUser(data);
            } catch (error) {
                router.push("/login");
            }
        }
        fetchUser();
    }, [router]);

    return (
        <div className="flex h-screen bg-gray-50/50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900 leading-none">{user?.fullName || "Loading..."}</span>
                                <span className="text-xs text-gray-500">{user?.tenantName || "..."}</span>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                                {user?.fullName?.charAt(0) || "U"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
