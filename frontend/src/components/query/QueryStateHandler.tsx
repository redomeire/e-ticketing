"use client"

import React, { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    PackageSearchIcon as EmptyIcon,
    AlertCircleIcon as ErrorIcon,
    LoadingIcon
} from "@hugeicons/core-free-icons";

interface QueryStateHandlerProps<T> {
    isPending: boolean;
    isError?: boolean;
    error?: Error;
    data: T | undefined | null;
    children: React.ReactNode;
    loadingComponent?: React.ReactNode;
    emptyComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
    emptyMessage?: string;
}

export function QueryStateHandler<T>({
    isPending,
    isError,
    error,
    data,
    children,
    loadingComponent,
    emptyComponent,
    errorComponent,
    emptyMessage = "Tidak ada data yang tersedia."
}: QueryStateHandlerProps<T>) {
    const isEmpty = useMemo(() => {
        if (!data) return true;
        if (Array.isArray(data)) return data.length === 0;
        if (typeof data === "object") return Object.keys(data).length === 0;
        return false;
    }, [data]);

    if (isPending) {
        return loadingComponent || (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-500">
                <HugeiconsIcon icon={LoadingIcon} className="animate-spin text-blue-600" size={32} />
                <p className="text-base font-bold text-slate-500 tracking-tight">Memproses data...</p>
            </div>
        );
    }
    if (isError) {
        return errorComponent || (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-rose-600">
                <HugeiconsIcon icon={ErrorIcon} size={40} />
                <div className="text-center">
                    <p className="text-lg font-black uppercase tracking-tighter">Terjadi Kesalahan</p>
                    <p className="text-sm font-medium text-slate-400">{error?.message || "Gagal mengambil data dari server."}</p>
                </div>
            </div>
        );
    }
    if (isEmpty) {
        return emptyComponent || (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <HugeiconsIcon icon={EmptyIcon} size={40} />
                </div>
                <p className="text-lg font-bold text-slate-500 tracking-tight">{emptyMessage}</p>
            </div>
        );
    }

    return <>{children}</>;
}