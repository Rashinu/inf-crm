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
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{t("common.platform")}</span>
                        <Badge variant="outline">{deal.platform}</Badge>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">{t("deals.created_at")}</span>
                        <span>{new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>
                    {deal.contact && (
                        <div className="flex justify-between border-b pb-2 items-center">
                            <span className="text-gray-500">{t("deals.contact_person")}</span>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-sm text-slate-800">{deal.contact.name}</span>
                                {deal.contact.email && <span className="text-xs text-slate-500">{deal.contact.email}</span>}
                            </div>
                        </div>
                    )}
                    {deal.dealScore !== undefined && (
                        <div className="flex justify-between border-b pb-2 items-center bg-gray-50 -mx-6 px-6 py-3 mt-4">
                            <span className="text-gray-700 font-semibold">{t("deals.ai_score")}</span>
                            <div className="flex flex-col items-end">
                                <span className="font-bold text-xl text-blue-600">{deal.dealScore}/100</span>
                                <span className="text-xs text-blue-500 font-medium">{deal.predictionMessage}</span>
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
