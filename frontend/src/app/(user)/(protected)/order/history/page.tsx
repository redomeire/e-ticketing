"use client";

import { cn } from "@/lib/utils/cn";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Clock01Icon,
    Tick02Icon,
    Cancel01Icon,
    Calendar03Icon,
    Ticket01Icon,
    ArrowRight01Icon,
    InvoiceIcon,
    Wallet01Icon
} from "@hugeicons/core-free-icons";
import { useGetOrderHistory } from "@/modules/order/repositories/useOrderRepository";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Button } from "@/components/ui/button";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";

const statusConfig = {
    pending: { label: "Menunggu", color: "text-amber-600", bg: "bg-amber-50", icon: Clock01Icon },
    paid: { label: "Lunas", color: "text-emerald-600", bg: "bg-emerald-50", icon: Tick02Icon },
    failed: { label: "Gagal", color: "text-rose-600", bg: "bg-rose-50", icon: Cancel01Icon },
    expired: { label: "Batal", color: "text-gray-500", bg: "bg-gray-50", icon: Cancel01Icon },
};

function PageContent() {
    const searchParams = useSearchParams();
    const pageQuery = searchParams.get("page") || "1";
    const { data: orders, isPending, isError, error } = useGetOrderHistory({
        options: {
            params: {
                page: pageQuery
            }
        }
    }, {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    const stats = useMemo(() => {
        if (!orders?.data.data) return { total: 0, pending: 0 };
        return {
            total: orders.data.data.length,
            pending: orders.data.data.filter(o => o.status === 'pending').length
        };
    }, [orders]);

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20">
            <div className="pt-16 pb-28">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
                            Riwayat Pesanan
                        </h1>
                        <p className="text-blue-800 font-bold text-sm tracking-[0.2em] uppercase opacity-80">
                            Kelola tiket dan pantau status transaksi Anda
                        </p>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 max-w-7xl -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-4 space-y-6 hidden lg:block">
                        <div className="bg-white rounded-[2rem] border border-blue-300 p-8 shadow-sm space-y-6">
                            <h3 className="text-sm font-black text-[#002558] uppercase tracking-widest border-b pb-4">Ikhtisar</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100/50">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <HugeiconsIcon icon={InvoiceIcon} size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Pesanan</p>
                                        <p className="text-lg font-black text-[#002558]">{stats.total} Transaksi</p>
                                    </div>
                                </div>
                                <div className="bg-amber-50/50 p-4 rounded-2xl flex items-center gap-4 border border-amber-100/50">
                                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                                        <HugeiconsIcon icon={Wallet01Icon} size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Menunggu Bayar</p>
                                        <p className="text-lg font-black text-[#002558]">{stats.pending} Pesanan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#002558] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Butuh Bantuan?</p>
                            <p className="text-sm font-medium leading-relaxed mb-6">Jika terjadi kendala pada pembayaran, hubungi tim support kami.</p>
                            <button className="w-full bg-white text-[#002558] py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
                                Hubungi Support
                            </button>
                        </div>
                    </aside>
                    <div className="lg:col-span-8 space-y-4">
                        <QueryStateHandler
                            data={orders?.data.data}
                            isPending={isPending}
                            isError={isError}
                            error={error as unknown as Error}
                        >
                            <>
                                {orders?.data.data.map((order) => {
                                    const config = statusConfig[order.status as keyof typeof statusConfig];
                                    return (
                                        <div key={order.id} className="bg-white rounded-[2rem] border shadow-sm p-6 md:p-8 border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase tracking-widest border", config.bg, config.color, "border-current/10")}>
                                                            <HugeiconsIcon icon={config.icon} size={14} />
                                                            {config.label}
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{order.invoice_id}</span>
                                                    </div>

                                                    <h2 className="text-2xl font-black text-[#002558] group-hover:text-blue-600 transition-colors leading-none uppercase">
                                                        {order.event_name}
                                                    </h2>

                                                    <div className="flex flex-wrap gap-y-2 gap-x-8">
                                                        <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                            <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-blue-500" />
                                                            {formatDate(order.start_time, { hour: undefined, minute: undefined })}
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                                                            <HugeiconsIcon icon={Ticket01Icon} size={16} className="text-blue-500" />
                                                            {order.total_tickets} Tiket Terdaftar
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-gray-50 pt-4 md:pt-0 md:pl-10">
                                                    <div className="text-right mb-4 md:mb-0">
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-1">Total Transaksi</p>
                                                        <p className="text-3xl font-black text-[#002558] tracking-tighter">{formatCurrency(order.total_amount)}</p>
                                                    </div>

                                                    {order.status === 'pending' ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                window.location.assign(order.payment_url);
                                                            }}
                                                            className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 text-[10px] font-black"
                                                        >
                                                            Selesaikan Pembayaran
                                                        </Button>
                                                    ) : order.status === 'paid' && (
                                                        <Link
                                                            href={`/order/history/${order.id}`}
                                                            key={order.id}
                                                            className="group"
                                                        >
                                                            <Button
                                                                className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 text-[10px] font-black"
                                                            >
                                                                Detail Pesanan <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="pt-8">
                                    {
                                        orders?.data.total !== 1 &&
                                        <Pagination>
                                            <PaginationContent>
                                                {orders?.data.links && orders.data.links.length > 0 && orders.data.links.map((link, index) => {
                                                    if (link.label.includes("Previous")) {
                                                        return (
                                                            <PaginationPrevious key={index} href="#" className="cursor-not-allowed opacity-50 bg-white border-gray-100 rounded-xl" />
                                                        )
                                                    }
                                                    else if (link.label.includes("Next")) {
                                                        return (
                                                            <PaginationNext key={index} href="#" className="cursor-not-allowed opacity-50 bg-white border-gray-100 rounded-xl" />
                                                        )
                                                    }
                                                    return (
                                                        <PaginationItem key={index}>
                                                            <PaginationLink
                                                                href={`?${new URLSearchParams({
                                                                    ...Object.fromEntries(searchParams.entries()),
                                                                    page: link.page ? link.page.toString() : pageQuery
                                                                }).toString()}`}
                                                                isActive={link.active}
                                                                className={cn(
                                                                    "rounded-xl font-bold transition-all",
                                                                    link.active ? "bg-blue-600 text-white hover:text-white hover:bg-blue-700 shadow-lg shadow-blue-100" : "bg-white border-gray-100"
                                                                )}
                                                            >
                                                                {link.label}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    )
                                                })}
                                            </PaginationContent>
                                        </Pagination>
                                    }
                                </div>
                            </>
                        </QueryStateHandler>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-[#002558] uppercase tracking-[0.3em] animate-pulse">Menyiapkan Dashboard...</p>
                </div>
            </div>
        }>
            <PageContent />
        </Suspense>
    );
}