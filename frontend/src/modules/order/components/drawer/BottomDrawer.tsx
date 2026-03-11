"use client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { IEvent } from "@/modules/event/types/event";
import { useRouter } from "next/navigation";

interface Props {
    event: IEvent;
    priceStartFrom: number;
}

export default function BottomDrawer({ event, priceStartFrom }: Props) {
    const router = useRouter();
    const handleBuyTicket = () => {
        router.push(`/event/${event.id}/order`);
    }
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Harga Mulai</p>
                <p className="text-xl font-black text-blue-600">{formatCurrency(priceStartFrom)}</p>
            </div>
            <Button
                disabled={!event.is_active}
                onClick={handleBuyTicket}
                className="bg-blue-600 hover:bg-blue-700 px-8 h-12 font-bold">
                Beli Tiket
            </Button>
        </div>
    )
}