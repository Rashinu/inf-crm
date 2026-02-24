"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { useDebounce } from "use-debounce";
import { Search, Loader2 } from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export default function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) return null;
            const { data } = await apiClient.get(`/search?q=${encodeURIComponent(debouncedQuery)}`);
            return data;
        },
        enabled: debouncedQuery.length >= 2,
    });

    const handleSelect = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg w-64 border border-gray-200"
            >
                <Search size={16} />
                <span className="flex-1 text-left">Search anything...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading && <div className="p-4 text-center text-sm text-gray-500 flex justify-center items-center"><Loader2 size={16} className="animate-spin mr-2" /> Searching...</div>}
                    {!isLoading && searchResults && query.length >= 2 && (
                        <>
                            {(!searchResults.deals?.length && !searchResults.brands?.length && !searchResults.contacts?.length) && (
                                <CommandEmpty>No results found.</CommandEmpty>
                            )}

                            {searchResults.deals?.length > 0 && (
                                <CommandGroup heading="Deals">
                                    {searchResults.deals.map((deal: any) => (
                                        <CommandItem
                                            key={deal.id}
                                            onSelect={() => handleSelect(`/dashboard/deals/${deal.id}`)}
                                        >
                                            {deal.title} <span className="text-gray-400 ml-2">({deal.stage})</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {searchResults.brands?.length > 0 && (
                                <CommandGroup heading="Brands">
                                    {searchResults.brands.map((brand: any) => (
                                        <CommandItem
                                            key={brand.id}
                                            onSelect={() => handleSelect(`/dashboard/brands/${brand.id}`)}
                                        >
                                            {brand.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {searchResults.contacts?.length > 0 && (
                                <CommandGroup heading="Contacts">
                                    {searchResults.contacts.map((contact: any) => (
                                        <CommandItem
                                            key={contact.id}
                                            onSelect={() => handleSelect(`/dashboard/contacts?brand=${contact.brandId}`)}
                                        >
                                            {contact.name} - {contact.email} <span className="text-gray-400 ml-2">({contact.brand?.name})</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
