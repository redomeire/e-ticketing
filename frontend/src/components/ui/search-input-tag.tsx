"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Cancel01Icon as CloseIcon,
    LoadingIcon as SpinnerIcon,
    PlusSignIcon
} from "@hugeicons/core-free-icons";
import { useDebounceValue } from "usehooks-ts";
import { Label } from "./label";
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import { UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

interface SearchInputTagsProps<T, K> {
    name: string;
    label?: string;
    placeholder?: string;
    useQueryHook: (
        req: IHttpRequest<{}>,
        options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<T>>>, 'queryKey'>
    ) => UseQueryResult<IHttpResponse<IPaginatedData<T>>, unknown>;
    useMutationHook: (
        options?: Omit<UseMutationOptions<IHttpResponse<T>, unknown, K>, 'mutationKey'>
    ) => UseMutationResult<IHttpResponse<T>, unknown, K>;
    getDisplayValue: (item: T) => string;
    getValue: (item: T) => string | number;
}

const SearchInputTags = <T extends { id: string | number }, K>({
    name,
    label,
    placeholder = "Cari dan tambahkan...",
    useQueryHook,
    useMutationHook,
    getDisplayValue,
    getValue,
}: SearchInputTagsProps<T, K>) => {
    const { setValue, watch } = useFormContext();
    const [searchText, setSearchText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debouncedSearch] = useDebounceValue(searchText, 500);
    const containerRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const selectedItems: T[] = watch(name) || [];

    const { data: response, isFetching } = useQueryHook({
        options: {
            params: { search: debouncedSearch, limit: 10 }
        }
    }, {
        refetchOnWindowFocus: false,
        enabled: debouncedSearch.length > 0
    });

    const { mutateAsync: createItem, isPending: isCreating } = useMutationHook();

    const items = useMemo((): T[] => {
        if (!response?.data) return [];
        const rawData = 'data' in response.data ? response.data.data : response.data;
        return (Array.isArray(rawData) ? rawData : []).filter(
            (item) => !selectedItems.some((selected) => getValue(selected) === getValue(item))
        );
    }, [response, selectedItems, getValue]);

    const isExactMatchFound = useMemo(() => {
        return items.some(item => getDisplayValue(item).toLowerCase() === searchText.toLowerCase()) ||
            selectedItems.some(item => getDisplayValue(item).toLowerCase() === searchText.toLowerCase());
    }, [items, selectedItems, searchText, getDisplayValue]);

    const handleSelectItem = (item: T) => {
        setValue(name, [...selectedItems, item], { shouldValidate: true });
        setSearchText("");
        setShowSuggestions(false);
    };

    const handleCreateNew = async () => {
        if (!searchText || isCreating) return;

        try {
            const res = await createItem({ name: searchText } as K);
            if (res.data) {
                handleSelectItem(res.data as unknown as T);
            }
        } catch (error) {
            console.error("Gagal membuat kategori baru", error);
        }
    };

    const handleRemoveItem = (itemToRemove: T) => {
        setValue(name, selectedItems.filter(i => getValue(i) !== getValue(itemToRemove)), { shouldValidate: true });
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full space-y-3" ref={containerRef}>
            {label && <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">{label}</Label>}

            <div className="group transition-all focus-within:ring-2 focus-within:ring-blue-600 rounded-2xl border border-slate-200 bg-white p-2 min-h-16 flex flex-wrap gap-2 items-center">
                {selectedItems.map((item, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-[#002558] border-none py-1.5 px-3 rounded-xl flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-tight">{getDisplayValue(item)}</span>
                        <button type="button" onClick={() => handleRemoveItem(item)} className="hover:text-rose-600 transition-colors">
                            <HugeiconsIcon icon={CloseIcon} size={14} />
                        </button>
                    </Badge>
                ))}

                <input
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={selectedItems.length === 0 ? placeholder : "Tambah lagi..."}
                    className="flex-1 min-w-32 bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 px-2"
                    autoComplete="off"
                />

                {(isFetching || isCreating) && <HugeiconsIcon icon={SpinnerIcon} className="animate-spin text-blue-600 mr-2" size={18} />}
            </div>

            {showSuggestions && searchText.length > 0 && (
                <div className="absolute z-100 w-full mt-1 mb-1 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
                    <ul className="py-2 max-h-60 overflow-y-auto">
                        {!isExactMatchFound && !isFetching && (
                            <li
                                onClick={handleCreateNew}
                                className="px-6 my-4 bg-blue-50/50 hover:bg-blue-50 cursor-pointer flex items-center justify-between border-b border-blue-100 transition-colors"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em]">Buat Kategori Baru</span>
                                    <span className="font-bold text-sm text-slate-900">{searchText}</span>
                                </div>
                                <HugeiconsIcon icon={PlusSignIcon} size={18} className="text-blue-600" />
                            </li>
                        )}

                        {items.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectItem(item)}
                                className="px-6 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none"
                            >
                                <span className="font-bold text-sm text-slate-900 tracking-tight">{getDisplayValue(item)}</span>
                                <span className="text-[10px] font-black text-slate-300">Saran</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchInputTags;