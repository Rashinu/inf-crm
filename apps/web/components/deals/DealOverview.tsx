import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DealOverview({ deal }: { deal: any }) {
    const { t } = useLanguage();
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">{t("deals.details_title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{t("common.value")}</span>
                        <span className="font-bold">₺{deal.totalAmount?.toLocaleString()} {deal.currency}</span>
                    </div>
                    {deal.influencer && (
                        <div className="flex justify-between border-b pb-2 items-center">
                            <span className="text-gray-500">Influencer</span>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-sm text-slate-800">{deal.influencer.name}</span>
                                <span className="text-xs text-indigo-600 font-medium">{deal.influencer.handle}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{t("deals.created_at")}</span>
                        <span>{new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Campaign Performance Section */}
                    <div className="pt-4 space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Campaign Performance</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Reach</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{(deal.reach || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Engagement</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{deal.engagement || 0}%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Clicks</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{(deal.clicks || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">ROI</p>
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{deal.roi || 0}x</p>
                            </div>
                        </div>
                    </div>

                    {deal.dealScore !== undefined && (
                        <div className="flex justify-between border-b pb-2 items-center bg-gray-50 dark:bg-slate-800/30 -mx-6 px-6 py-3 mt-4">
                            <span className="text-gray-700 dark:text-slate-300 font-semibold">{t("deals.ai_score")}</span>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-xl text-blue-600 dark:text-blue-400">{deal.dealScore}/100</span>
                                <span className="text-xs text-blue-500 dark:text-blue-300 font-medium">{deal.predictionMessage}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">{t("deals.notes")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap">
                        {deal.notes || t("deals.no_notes")}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
