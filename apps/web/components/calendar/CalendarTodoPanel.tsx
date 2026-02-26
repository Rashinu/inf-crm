"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import apiClient from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CalendarTodoPanel({ date }: { date: Date | null }) {
    const queryClient = useQueryClient();
    const [newTodo, setNewTodo] = useState("");

    const dateStr = date ? format(date, "yyyy-MM-dd") : "";

    const { data: todos, isLoading } = useQuery({
        queryKey: ["calendar-todos", dateStr],
        queryFn: async () => {
            if (!dateStr) return [];
            const { data } = await apiClient.get('/calendar/todos', {
                params: { from: dateStr, to: dateStr }
            });
            return data;
        },
        enabled: !!dateStr,
    });

    const addMutation = useMutation({
        mutationFn: async (text: string) => {
            return apiClient.post('/calendar/todos', { date: dateStr, text });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar-todos", dateStr] });
            setNewTodo("");
            toast.success("Todo added");
        }
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, isCompleted }: { id: string, isCompleted: boolean }) => {
            return apiClient.patch(`/calendar/todos/${id}`, { isCompleted });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar-todos", dateStr] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiClient.delete(`/calendar/todos/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendar-todos", dateStr] });
            toast.success("Todo removed");
        }
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim()) {
            addMutation.mutate(newTodo.trim());
        }
    };

    if (!date) return null;

    return (
        <div className="space-y-6 mt-6">
            <form onSubmit={handleAdd} className="flex gap-2">
                <Input
                    placeholder="Add a new task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    disabled={addMutation.isPending}
                />
                <Button type="submit" size="icon" disabled={!newTodo.trim() || addMutation.isPending}>
                    <Plus className="h-4 w-4" />
                </Button>
            </form>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="text-sm text-gray-500 text-center py-4">Loading tasks...</div>
                ) : todos?.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">No tasks for this day.</div>
                ) : (
                    todos?.map((todo: any) => (
                        <div
                            key={todo.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${todo.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <button
                                    onClick={() => toggleMutation.mutate({ id: todo.id, isCompleted: !todo.isCompleted })}
                                    className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${todo.isCompleted
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 text-transparent hover:border-blue-600'
                                        }`}
                                >
                                    <Check className="h-3.5 w-3.5" />
                                </button>
                                <span className={`text-sm truncate ${todo.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {todo.text}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => deleteMutation.mutate(todo.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
