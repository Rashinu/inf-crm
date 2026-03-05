"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api-client";

const BASE_PRICE_MONTHLY = 29;
const EXTRA_USER_PRICE_MONTHLY = 5;

export default function BillingPage() {
    const [userCount, setUserCount] = useState<number>(1);
    const [isYearly, setIsYearly] = useState<boolean>(false);
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    const { data: statusData, isLoading: statusLoading } = useQuery({
        queryKey: ['billing-status'],
        queryFn: async () => {
            const res = await api.get('/billing/status');
            return res.data;
        }
    });

    const calculateMonthlyCost = () => {
        const extraUsers = Math.max(0, userCount - 1);
        const total = BASE_PRICE_MONTHLY + (extraUsers * EXTRA_USER_PRICE_MONTHLY);
        return total;
    };

    const handleSubscribe = async () => {
        try {
            setLoadingCheckout(true);
            const { data } = await api.post('/billing/checkout', {
                expectedUserCount: userCount,
                billingCycle: isYearly ? 'yearly' : 'monthly'
            });
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error("Ödeme sayfasına yönlendirilirken bir hata oluştu.");
            setLoadingCheckout(false);
        }
    };

    const monthlyCost = calculateMonthlyCost();
    const finalMonthlyCost = isYearly ? monthlyCost * 0.8 : monthlyCost; // 20% discount
    const finalTotal = isYearly ? finalMonthlyCost * 12 : finalMonthlyCost;

    return (
        <div className="container max-w-5xl py-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Kusursuz Deneyim, <span className="text-primary">Dinamik Fiyatlandırma</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Kullanmadığınız özellikler veya ekstra kullanıcılar için ödeme yapmayın. İhtiyacınıza uygun paketi oluşturun ve sadece kullandığınız kadar ödeyin.
                </p>
                <div className="mt-6 max-w-3xl mx-auto bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300 text-left">
                    <p className="font-semibold mb-1">💡 14 Günlük Deneme Süreciniz Nasıl Çalışır?</p>
                    <p>Sisteme kayıt olduğunuz an itibariyle arka planda otomatik olarak 14 günlük tam erişimli deneme süreniz başlar. Bu sürenin sayacı anlık olarak takip edilir ve ana ekranınızda kalan gününüz bildirilir. Deneme süreniz dolduğunda sistem sizi otomatik olarak bu sayfaya yönlendirir. Hiçbir veri kaybı yaşamazsınız, dilediğiniz zaman aşağıdaki hesaplayıcıdan kendi paketinizi oluşturarak kesintisiz kullanıma devam edebilirsiniz.</p>
                </div>
                {statusData?.trialActive && (
                    <div className="mt-6 inline-flex border border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
                        Deneme sürümünüzün bitmesine {statusData.daysLeft} gün kaldı.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Configuration Section */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Maliyetinizi Hesaplayın</CardTitle>
                            <CardDescription>Ekibinizin büyüklüğüne göre anlık fiyatı görün.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-medium">Kullanıcı Sayısı</label>
                                    <span className="font-bold">{userCount} Kullanıcı</span>
                                </div>
                                <Slider
                                    defaultValue={[1]}
                                    max={50}
                                    min={1}
                                    step={1}
                                    onValueChange={(vals) => setUserCount(vals[0])}
                                    className="pt-2"
                                />
                                <p className="text-xs text-muted-foreground mt-2">İlk kullanıcı (sahip) temel pakete dahildir. Sonraki her kullanıcı aylık $5.</p>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div>
                                    <p className="font-semibold">Yıllık Faturalandırma</p>
                                    <p className="text-sm text-muted-foreground">%20 tasarruf edin</p>
                                </div>
                                <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Neler Dahil?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {["Sınırsız Anlaşma & Kampanya Yönetimi", "Dosya & Sözleşme Takibi", "Gelişmiş Takvim ve Görevler", "Mobil Uygulama Erişimi (iOS & Android)", "Canlı Destek Hizmeti"].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-primary/10 text-primary">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary & Checkout Section */}
                <div>
                    <Card className="border-primary shadow-lg sticky top-8">
                        <CardHeader>
                            <CardTitle>Paket Özeti</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Temel Paket (1 Kullanıcı)</span>
                                <span>${BASE_PRICE_MONTHLY.toFixed(2)}</span>
                            </div>
                            {userCount > 1 && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Ekstra {userCount - 1} Kullanıcı</span>
                                    <span>${((userCount - 1) * EXTRA_USER_PRICE_MONTHLY).toFixed(2)}</span>
                                </div>
                            )}

                            {isYearly && (
                                <div className="flex justify-between items-center text-sm text-green-600">
                                    <span>Yıllık İndirim (%20)</span>
                                    <span>-${(monthlyCost * 0.2).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t pt-4 flex items-end justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Ödenecek Tutar</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">${finalTotal.toFixed(2)}</span>
                                        <span className="text-sm text-muted-foreground">/ {isYearly ? 'yıl' : 'ay'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handleSubscribe} disabled={loadingCheckout}>
                                {loadingCheckout ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                {statusData?.trialActive ? "Aboneliği Başlat" : "Hemen Yükselt"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    );
}
