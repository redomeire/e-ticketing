"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import {
    CircleX,
    CustomerSupportIcon
} from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";

function ErrorContent() {
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get('message') || "Transaksi dibatalkan atau pembayaran gagal diproses.";

    return (
        <div className="max-w-125 w-full bg-white rounded-3xl shadow-2xl shadow-red-900/5 border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <HugeiconsIcon icon={CircleX} size={48} className="text-red-500" />
            </div>

            <div className="space-y-4 mb-10">
                <h1 className="text-3xl font-black text-[#002558] tracking-tight">Pembayaran Gagal</h1>
                <p className="text-gray-500 font-medium leading-relaxed">
                    {errorMessage}
                </p>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 mb-10">
                <p className="text-xs text-red-800 font-bold leading-relaxed">
                    Jangan khawatir, saldo Anda tidak akan terpotong. Jika terjadi masalah, silakan hubungi tim bantuan kami.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <Button className="w-full h-14 bg-[#002558] hover:bg-black text-white font-black rounded-xl text-lg shadow-lg active:scale-95 transition-all gap-2" asChild>
                    <Link href="/booking">
                        Coba Lagi
                    </Link>
                </Button>
                <Button variant="ghost" className="text-gray-500 font-bold gap-2">
                    <HugeiconsIcon icon={CustomerSupportIcon} size={20} />
                    Hubungi Bantuan
                </Button>
            </div>
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
            <Suspense fallback={<div className="font-bold text-red-900 animate-pulse">Menyiapkan Info Eror...</div>}>
                <ErrorContent />
            </Suspense>
        </main>
    );
}