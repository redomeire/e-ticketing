"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import {
    CheckCircle,
    Ticket,
    Home,
    Download
} from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";

function SuccessContent() {
    const searchParams = useSearchParams();
    const order_id = searchParams.get('external_id') || searchParams.get('order_id') || "TRX-UNKNOWN";

    return (
        <div className="max-w-125 w-full bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <HugeiconsIcon icon={CheckCircle} size={48} className="text-green-500" />
            </div>
            <div className="space-y-4 mb-10">
                <h1 className="text-3xl font-black text-[#002558] tracking-tight">Pembayaran Berhasil!</h1>
                <p className="text-gray-500 font-medium leading-relaxed">
                    Terima kasih atas pesanan Anda. Tiket elektronik telah kami kirimkan ke email Anda.
                </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 mb-10 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">ID Transaksi</span>
                    <span className="text-[#002558] font-black">{order_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Status</span>
                    <span className="text-green-600 font-black">PAID / SUCCESS</span>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-lg shadow-lg active:scale-95 transition-all gap-2">
                    <HugeiconsIcon icon={Ticket} size={20} />
                    Lihat Tiket Saya
                </Button>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" asChild className="h-12 border-gray-200 font-bold rounded-xl gap-2">
                        <Link href="/">
                            <HugeiconsIcon icon={Home} size={18} /> Beranda
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-12 border-gray-200 font-bold rounded-xl gap-2">
                        <HugeiconsIcon icon={Download} size={18} /> Resi
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
            <Suspense fallback={<div className="font-bold text-blue-900 animate-pulse">Memuat Konfirmasi...</div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}