"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginValues) {
        setLoading(true);
        try {
            const { data } = await apiClient.post("/auth/login", values);
            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem("refresh_token", data.refreshToken);
            toast.success("Welcome back!");
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50 dark:bg-slate-950 p-4 transition-colors">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const { data } = await apiClient.post("/auth/demo");
                                    localStorage.setItem("access_token", data.accessToken);
                                    localStorage.setItem("refresh_token", data.refreshToken);
                                    toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
                                    router.push("/dashboard");
                                } catch (error) {
                                    toast.error("Demo girişi başarısız oldu.");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? "Giriş yapılıyor..." : "🚀 Ücretsiz İncele (Şifresiz Giriş Yap)"}
                        </Button>
                    </div>

                    <div className="relative mb-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-50/50 dark:bg-slate-950 px-2 text-muted-foreground transition-colors">Veya email ile</span>
                        </div>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" {...form.register("email")} />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password (Şifre)</Label>
                            <Input id="password" type="password" {...form.register("password")} />
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </div>
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-4">
                        Return to Homepage
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
