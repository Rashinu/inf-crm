"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Lock, Monitor, Image as ImageIcon, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Normally this would fetch from /auth/me or a settings config endpoint
    const { data: user } = useQuery<any>({
        queryKey: ["user-me"],
        queryFn: async () => {
            const { data } = await apiClient.get("/auth/me");
            return data;
        },
    });

    const [formData, setFormData] = useState({
        agencyName: user?.tenantName || "INF CRM Agency",
        email: user?.email || "admin@inf-crm.com",
        currentPassword: "",
        newPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await apiClient.patch("/auth/me", { email: formData.email, agencyName: formData.agencyName });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSavePassword = async () => {
        if (!formData.currentPassword || !formData.newPassword) return;
        setIsSaving(true);
        try {
            await apiClient.patch("/auth/me", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            toast.success("Password changed successfully!");
            setFormData({ ...formData, currentPassword: "", newPassword: "" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleThemeToggle = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            toast.success("Dark Mode activated (Preview)");
        } else {
            document.documentElement.classList.remove('dark');
            toast.success("Light Mode activated");
        }
    };

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-outfit">Settings</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage your agency profile, preferences, and account security.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <div className="col-span-2 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="text-blue-600" size={20} /> Personal Profile
                            </CardTitle>
                            <CardDescription>Update your photo and personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col sm:flex-row gap-8 mb-8 items-start">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {user?.fullName?.charAt(0) || "U"}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-blue-600 transition-colors">
                                        <ImageIcon size={14} />
                                    </button>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 font-medium">Your Name</Label>
                                        <Input disabled value={user?.fullName || "Loading..."} className="bg-slate-50 border-slate-200 shadow-none font-medium text-slate-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-slate-600 font-medium">Email Address</Label>
                                        <Input name="email" value={formData.email} onChange={handleChange} className="border-slate-200 shadow-sm focus-visible:ring-blue-500 font-medium" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 mb-8" />

                            <div className="space-y-4 mb-8">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Building size={18} className="text-indigo-500" /> Agency / Workspace
                                </h4>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-600 font-medium">Agency Name</Label>
                                    <Input name="agencyName" value={formData.agencyName} onChange={handleChange} className="border-slate-200 shadow-sm focus-visible:ring-indigo-500 font-medium" />
                                </div>
                            </div>

                            <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] rounded-xl font-bold px-8">
                                {isSaving ? "Saving..." : "Save Profile Changes"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lock className="text-rose-500" size={20} /> Security & Passwords
                            </CardTitle>
                            <CardDescription>Ensure your account remains safe.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6">
                            <div className="space-y-1.5">
                                <Label className="text-slate-600 font-medium">Current Password</Label>
                                <Input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter your current password" className="border-slate-200 shadow-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-slate-600 font-medium">New Password</Label>
                                <Input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter your new password" className="border-slate-200 shadow-sm" />
                            </div>
                            <Button onClick={handleSavePassword} disabled={!formData.currentPassword || !formData.newPassword || isSaving} className="bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all rounded-xl font-bold px-8">
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg text-white">
                                <Monitor size={20} className="text-blue-400" /> Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Dark Mode</h4>
                                    <p className="text-slate-400 text-sm mt-0.5">Toggle site theme.</p>
                                </div>
                                <Switch checked={darkMode} onCheckedChange={handleThemeToggle} className="data-[state=checked]:bg-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
