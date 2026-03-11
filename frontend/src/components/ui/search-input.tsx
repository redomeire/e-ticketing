"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Cancel01Icon as CloseIcon,
    LoadingIcon as SpinnerIcon
} from "@hugeicons/core-free-icons";
import { useDebounceValue } from "usehooks-ts";
import { Label } from "./label";
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

interface SearchInputTagsProps<T> {
    name: string;
    label?: string;
    placeholder?: string;
    useQueryHook: (
        req: IHttpRequest<{}>,
        options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<T>>>, 'queryKey'>
    ) => UseQueryResult<IHttpResponse<IPaginatedData<T>>, unknown>;
    getDisplayValue: (item: T) => string;
    getValue: (item: T) => string | number;
}

const SearchInputTags = <T extends { id: string | number }>({
    name,
    label,
    placeholder = "Cari dan tambahkan...",
    useQueryHook,
    getDisplayValue,
    getValue,
}: SearchInputTagsProps<T>) => {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const [searchText, setSearchText] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [debouncedSearch] = useDebounceValue(searchText, 500);
    const containerRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const selectedItems: T[] = watch(name) || [];

    const { data: response, isFetching } = useQueryHook({
        options: {
            params: {
                search: debouncedSearch,
                limit: 10,
            }
        }
    }, {
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const suggestions = useMemo((): T[] => {
        if (!response?.data) return [];
        const rawData = 'data' in response.data ? response.data.data : response.data;

        return (Array.isArray(rawData) ? rawData : []).filter(
            (item) => !selectedItems.some((selected) => getValue(selected) === getValue(item))
        );
    }, [response, selectedItems, getValue]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddItem = (item: T) => {
        const newItems = [...selectedItems, item];
        setValue(name, newItems, { shouldValidate: true });
        setSearchText("");
        setShowSuggestions(false);
    };

    const handleRemoveItem = (itemToRemove: T) => {
        const newItems = selectedItems.filter(
            (item) => getValue(item) !== getValue(itemToRemove)
        );
        setValue(name, newItems, { shouldValidate: true });
    };

    return (
        <div className="relative w-full space-y-3" ref={containerRef}>
            {label && (
                <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">
                    {label}
                </Label>
            )}

            <div className="group transition-all focus-within:ring-2 focus-within:ring-blue-600 rounded-2xl border border-slate-200 bg-white p-2 min-h-16 flex flex-wrap gap-2 items-center">

                {selectedItems.map((item, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-[#002558] border-none py-1.5 px-3 rounded-xl flex items-center gap-2 animate-in zoom-in-95 duration-200"
                    >
                        <span className="text-xs font-black uppercase tracking-tight">
                            {getDisplayValue(item)}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(item)}
                            className="hover:text-rose-600 transition-colors"
                        >
                            <HugeiconsIcon icon={CloseIcon} size={14} />
                        </button>
                    </Badge>
                ))}

                {/* Input Pencarian Otomatis */}
                <input
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={selectedItems.length === 0 ? placeholder : "Tambah lagi..."}
                    className="flex-1 min-w-30 bg-transparent border-none outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 px-2"
                    autoComplete="off"
                />

                {/* Loading Indicator */}
                {isFetching && (
                    <div className="pr-3">
                        <HugeiconsIcon icon={SpinnerIcon} className="animate-spin text-blue-600" size={18} />
                    </div>
                )}
            </div>

            {/* Dropdown Suggestions */}
            {showSuggestions && (searchText.length > 1 || isFetching) && (
                <div className="absolute z-100 w-full mt-1 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {suggestions.length > 0 ? (
                        <ul className="py-2 max-h-60 overflow-y-auto">
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleAddItem(item)}
                                    className="px-6 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none transition-colors"
                                >
                                    <span className="font-bold text-sm text-slate-900 tracking-tight">
                                        {getDisplayValue(item)}
                                    </span>
                                    <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <span className="text-[10px] font-black">+</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : !isFetching && searchText.length > 1 ? (
                        <div className="p-10 text-center">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Tidak ada hasil untuk {searchText}
                            </p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Error handling */}
            {errors[name] && (
                <p className="text-[11px] text-rose-600 font-black uppercase tracking-wider pl-2">
                    {String(errors[name]?.message || "")}
                </p>
            )}
        </div>
    );
};

export default SearchInputTags;