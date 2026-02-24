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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-outfit">Contracts & Files</h3>
                <div>
                    <input
                        type="file"
                        id="contract-upload"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                    />
                    <label htmlFor="contract-upload">
                        <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700 cursor-pointer">
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

            <div className="grid gap-3">
                {contracts?.map((item) => (
                    <Card key={item.id} className="border-none shadow-sm hover:ring-1 hover:ring-purple-100 transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 line-clamp-1 max-w-[200px] md:max-w-md">
                                        {item.fileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Select
                                    value={item.status}
                                    onValueChange={(val: ContractStatus) => updateStatusMutation.mutate({ id: item.id, status: val })}
                                >
                                    <SelectTrigger className="w-[120px] h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ContractStatus.NOT_SENT}>Not Sent</SelectItem>
                                        <SelectItem value={ContractStatus.SENT}>Sent</SelectItem>
                                        <SelectItem value={ContractStatus.SIGNED}>Signed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center gap-1 border-l pl-3 border-gray-100">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" title="Download">
                                        <Download size={14} />
                                    </Button>
                                    {item.externalLink && (
                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-purple-600" title="External Link">
                                            <a href={item.externalLink} target="_blank" rel="noreferrer">
                                                <LinkIcon size={14} />
                                            </a>
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                                        title="Delete"
                                        onClick={() => window.confirm("Are you sure?") && deleteMutation.mutate(item.id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {contracts?.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400">No contracts uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
