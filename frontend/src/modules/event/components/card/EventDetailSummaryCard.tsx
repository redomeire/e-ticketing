"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Calendar, DashboardBrowsingIcon, WhatsappIcon, Facebook, Twitter, Info, Location } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IEvent, IEventCategory } from "../../types/event";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
    event: IEvent & { categories: IEventCategory[] };
    priceStartFrom: number;
}

export default function EventDetailSummaryCard({ event, priceStartFrom }: Props) {
    const { data } = useSession();
    const router = useRouter();
    const handleBuyTicket = () => {
        if (data?.user.role === "admin" || data?.user.role === "superadmin") {
            router.push(`/admin/events/${event.slug}`);
            return;
        }
        router.push(`/event/${event.slug}/order`);
    }
    return (
        <div className="relative md:block hidden">
            <div className="sticky top-28 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
                <div className="flex flex-col justify-between">
                    <p className="text-sm text-gray-400 font-medium">Harga Mulai dari</p>
                    <p className="text-2xl font-black text-blue-600">{formatCurrency(priceStartFrom)}</p>
                </div>
                <div className="space-y-1">
                    <div className="flex-1 pb-4 order-1">
                        <h1 className="my-5 text-2xl font-bold mb-4 drop-shadow-sm">
                            {event.name}
                        </h1>
                        <div className="flex flex-col justify-center md:justify-start gap-4 md:gap-4">
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={Calendar} size={20} className="" />
                                <span className="text-lg">{formatDate(event.start_time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={Location} size={20} className="" />
                                <span className="text-lg">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={DashboardBrowsingIcon} size={20} className="" />
                                <span className="text-lg line-clamp-1 w-5/6">
                                    {event.categories.map((category) => category.name).join(" • ")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    disabled={!event.is_active}
                    onClick={handleBuyTicket}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold shadow-lg shadow-blue-200"
                >
                    {data?.user.role === "admin" || data?.user.role === "superadmin" ? "Atur Event" : "Beli Tiket Sekarang"}
                </Button>
                <div>
                    <h2 className="mt-5 mb-3 text-xl font-bold drop-shadow-sm">
                        Bagikan Event
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="flex items-center gap-2 w-10 h-10 rounded-full bg-green-600 hover:bg-green-600/80">
                            <HugeiconsIcon className="text-white" icon={WhatsappIcon} size={12} />
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-600/80">
                            <HugeiconsIcon className="text-white" icon={Facebook} size={12} />
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 w-10 h-10 rounded-full bg-black hover:bg-black/80">
                            <HugeiconsIcon className="text-white" icon={Twitter} size={12} />
                        </Button>
                    </div>
                </div>
                <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <HugeiconsIcon icon={Info} size={20} className="text-blue-600" />
                        <p className="text-[11px] text-blue-800 font-medium leading-tight">
                            Tiket yang sudah dibeli tidak dapat dikembalikan/refund.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}