import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DealOverview({ deal }: { deal: any }) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Deal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Value</span>
                        <span className="font-bold">₺{deal.totalAmount?.toLocaleString()} {deal.currency}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Platform</span>
                        <Badge variant="outline">{deal.platform}</Badge>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Created At</span>
                        <span>{new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>
                    {deal.dealScore !== undefined && (
                        <div className="flex justify-between border-b pb-2 items-center bg-gray-50 -mx-6 px-6 py-3 mt-4">
                            <span className="text-gray-700 font-semibold">AI Deal Prediction Score</span>
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
                    <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap">
                        {deal.notes || "No notes added for this deal."}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
