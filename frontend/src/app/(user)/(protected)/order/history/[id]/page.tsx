"use client";

import { cn } from "@/lib/utils/cn";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Tick02Icon,
    Clock01Icon,
    ArrowLeft01Icon,
    Calendar03Icon,
    Location01Icon,
    UserIcon,
    Ticket01Icon,
    Download01Icon,
    PrinterIcon
} from "@hugeicons/core-free-icons";
import Link from "next/link";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { useGetOrderHistoryDetail } from "@/modules/order/repositories/useOrderRepository";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
    const params = useParams();
    const { data: orderHistory } = useGetOrderHistoryDetail({
        payload: { orderId: parseInt(params.id as string) },
    }, {
        staleTime: Infinity,
        refetchOnWindowFocus: false
    })

    const statusConfig = {
        paid: { label: "Lunas", color: "text-emerald-600", bg: "bg-emerald-50", icon: Tick02Icon },
        pending: { label: "Menunggu", color: "text-amber-600", bg: "bg-amber-50", icon: Clock01Icon },
    };

    const config = statusConfig[orderHistory?.data.status as keyof typeof statusConfig] || statusConfig.pending;

    return (
        <div className="min-h-screen bg-[#fcfcfc] pb-20 font-sans">
            <nav className="bg-[#002558] py-4 shadow-lg z-50">
                <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
                    <Link href="/order/history" className="flex items-center gap-2 text-blue-100 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em]">
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} /> Kembali
                    </Link>
                </div>
            </nav>
            <div className="container mx-auto px-4 max-w-7xl mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-10">
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
                            <div className="space-y-1">
                                <p className="text-sm font-black text-blue-600 uppercase mb-2">Detail Transaksi</p>
                                <h1 className="md:text-4xl text-2xl font-black text-[#002558] md:leading-12 uppercase">
                                    {orderHistory?.data.event_name}
                                </h1>
                            </div>
                            <div className={cn("px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 border", config.bg, config.color, "border-current/10")}>
                                <HugeiconsIcon icon={config.icon} size={17} />
                                {config.label}
                            </div>
                        </header>
                        <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-gray-50">
                                {/* <Image
                                    src={data.cover_url}
                                    alt={orderHistory?.data.event_name || "Event Cover"}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                /> */}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Waktu</p>
                                    <p className="text-md font-black text-[#002558] flex items-center gap-2">
                                        <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-blue-500" />
                                        {formatDate(orderHistory?.data.start_time ?? "")}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lokasi</p>
                                    <p className="text-md font-black text-[#002558] flex items-center gap-2">
                                        <HugeiconsIcon
                                            icon={Location01Icon}
                                            size={16} className="text-blue-500"
                                        />
                                        {orderHistory?.data.location}
                                    </p>
                                </div>
                            </div>
                        </section>
                        <section className="space-y-6">
                            <h3 className="text-sm font-black text-[#002558] uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <HugeiconsIcon icon={Ticket01Icon} size={18} /> Daftar Peserta
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {orderHistory?.data.attendees.map((att) => (
                                    <div key={att.id} className="bg-white rounded-2xl border p-6 flex justify-between items-center group border-blue-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 transition-colors">
                                                <HugeiconsIcon icon={UserIcon} size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-[#002558]">{att.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kursi {att.seat_number} • {att.category}</p>
                                            </div>
                                        </div>
                                        <Button
                                            className="text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                                            variant="default"
                                        >
                                            <HugeiconsIcon icon={PrinterIcon} size={20} />
                                            Cetak
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex flex-col items-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95 group">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <HugeiconsIcon icon={Download01Icon} size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Dokumen</p>
                                    <p className="text-lg font-black uppercase italic tracking-tighter">Download Resi & Tiket</p>
                                </div>
                            </button>
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
                                <div className="flex justify-between items-center text-sm font-black text-gray-300 uppercase">
                                    <span>Invoice</span>
                                    <span className="text-[#002558] tracking-widest">{orderHistory?.data.invoice_id}</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-tighter">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(orderHistory?.data.base_amount ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-tighter">
                                        <span>Biaya Layanan</span>
                                        <span>{formatCurrency((orderHistory?.data.total_amount ?? 0) - (orderHistory?.data.base_amount ?? 0))}</span>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                                        <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Total</span>
                                        <span className="text-3xl font-black text-[#002558] italic leading-none">{formatCurrency(orderHistory?.data.total_amount ?? 0)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 text-center">
                                <p className="text-sm font-bold text-gray-400 leading-relaxed">
                                    Pesanan dibuat pada {formatDate(orderHistory?.data.created_at ?? "")}.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}