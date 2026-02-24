"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Trello,
    Briefcase,
    Building2,
    Contact,
    Calendar,
    Wallet,
    Settings,
    Bell,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Trello, label: "Pipeline", href: "/dashboard/pipeline" },
    { icon: Briefcase, label: "Deals", href: "/dashboard/deals" },
    { icon: Building2, label: "Brands", href: "/dashboard/brands" },
    { icon: Contact, label: "Contacts", href: "/dashboard/contacts" },
    { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
    { icon: Wallet, label: "Finance", href: "/dashboard/finance" },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        I
                    </div>
                    {!collapsed && <span className="font-bold text-xl tracking-tight">INF CRM</span>}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon className={cn("size-5", pathname === item.href ? "text-blue-600" : "text-gray-400")} />
                        {!collapsed && <span>{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-gray-100 space-y-1">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50",
                        pathname === "/settings" && "bg-blue-50 text-blue-700"
                    )}
                >
                    <Settings className="size-5 text-gray-400" />
                    {!collapsed && <span>Settings</span>}
                </Link>
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="size-5" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </div>
    );
}
