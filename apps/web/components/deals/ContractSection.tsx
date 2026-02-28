"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, UploadCloud, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ContractStatus } from "@inf-crm/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export default function ContractSection({ dealId }: { dealId: string }) {
    const queryClient = useQueryClient();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { data: contracts, isLoading } = useQuery<any[]>({
        queryKey: ["contracts", dealId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/contracts/deal/${dealId}`);
            return data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: ContractStatus }) => {
            return apiClient.patch(`/contracts/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts", dealId] });
            queryClient.invalidateQueries({ queryKey: ["activities", dealId] });
            toast.success("Contract status updated");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/contracts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts", dealId] });
            toast.success("Contract deleted");
        },
    });

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            // 1. Get presigned URL
            const { data: { uploadUrl, fileKey } } = await apiClient.post('/files/presign', {
                fileName: file.name,
                contentType: file.type || 'application/octet-stream',
            });

            // 2. Upload to S3/MinIO
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type || 'application/octet-stream' },
                onUploadProgress: (e) => {
                    if (e.total) {
                        setUploadProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            // 3. Save contract record
            await apiClient.post(`/contracts/deal/${dealId}`, {
                fileKey,
                fileName: file.name,
                status: ContractStatus.NOT_SENT,
            });

            // 4. Refresh contracts list
            queryClient.invalidateQueries({ queryKey: ["contracts", dealId] });
            queryClient.invalidateQueries({ queryKey: ["activities", dealId] });

            toast.success('Contract uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (event.target) event.target.value = '';
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold font-outfit text-slate-900 mb-1">Contracts & Briefs</h3>
                    <p className="text-sm text-slate-500">Upload agreement files, strategy briefs, or relevant PDFs.</p>
                </div>
                <div>
                    <input
                        type="file"
                        id="contract-upload"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                    />
                    <label htmlFor="contract-upload">
                        <Button asChild className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20 text-white rounded-xl transition-all font-semibold px-5 cursor-pointer">
                            <span><UploadCloud size={16} className="mr-2" /> Upload File</span>
                        </Button>
                    </label>
                </div>
            </div>

            {uploading && (
                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex justify-between">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            <div className="grid gap-3 pt-2">
                {contracts?.map((item) => (
                    <Card key={item.id} className="border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group overflow-hidden bg-white rounded-xl">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-[300px] text-base font-outfit">
                                            {item.fileName}
                                        </p>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                            Uploaded on {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto gap-4 bg-slate-50/50 md:bg-transparent p-2 md:p-0 rounded-lg">
                                    <Select
                                        value={item.status}
                                        onValueChange={(val: ContractStatus) => updateStatusMutation.mutate({ id: item.id, status: val })}
                                    >
                                        <SelectTrigger className="w-[130px] h-9 text-xs font-bold border-slate-200 bg-white shadow-sm focus:ring-purple-500 rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">
                                            <SelectItem value={ContractStatus.NOT_SENT} className="font-medium">Not Sent</SelectItem>
                                            <SelectItem value={ContractStatus.SENT} className="font-medium text-blue-600">Sent to Brand</SelectItem>
                                            <SelectItem value={ContractStatus.SIGNED} className="font-bold text-emerald-600">Signed & Approved</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="flex items-center gap-1">
                                        {item.fileUrl ? (
                                            <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                                                <a href={item.fileUrl} download={item.fileName} target="_blank" rel="noreferrer">
                                                    <Download size={16} />
                                                </a>
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download (Not Ready)">
                                                <Download size={16} />
                                            </Button>
                                        )}

                                        {item.externalLink && (
                                            <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="External Link">
                                                <a href={item.externalLink} target="_blank" rel="noreferrer">
                                                    <LinkIcon size={16} />
                                                </a>
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 shrink-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete permanently"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to permanently delete this file?")) {
                                                    deleteMutation.mutate(item.id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {contracts?.length === 0 && (
                    <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm mx-auto mb-3">
                            <UploadCloud className="text-slate-400 h-5 w-5" />
                        </div>
                        <p className="text-slate-600 font-medium text-sm">No files uploaded yet.</p>
                        <p className="text-slate-400 text-xs mt-1">Upload brief documents, NDAs, or contracts here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
