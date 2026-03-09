import Image from 'next/image';
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Calendar,
    Location,
    Ticket
} from '@hugeicons/core-free-icons';
import { IEvent, IEventTicketCategory } from '../../types/event';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface EventCardProps {
    event: Omit<IEvent, 'max_row_index' | 'max_column_index'>
    ticketCategories: IEventTicketCategory[];
}

export default function EventCard({ event, ticketCategories }: EventCardProps) {
    const lowestPrice = ticketCategories.reduce((min, category) => {
        const price = category.base_price;
        return price < min ? price : min;
    }, Infinity);
    return (
        <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="relative aspect-4/5 overflow-hidden">
                <Image
                    src={event.cover_image_url || "/placeholder-image.png"}
                    alt={event.name}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                    <p className="text-[10px] font-bold text-[#002558] uppercase tracking-wider">{event.is_active ? "Active" : "Inactive"}</p>
                </div>
            </div>
            <div className="p-5 flex flex-col grow gap-3">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-14 leading-tight group-hover:text-blue-600 transition-colors">
                    {event.name}
                </h3>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <HugeiconsIcon icon={Calendar} size={16} className="text-blue-500" />
                        <span>{event.start_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <HugeiconsIcon icon={Location} size={16} className="text-blue-500" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Mulai dari</span>
                        <span className="text-lg font-black text-blue-600">{formatCurrency(lowestPrice)}</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-600 transition-colors">
                        <HugeiconsIcon icon={Ticket} size={20} className="text-blue-600 group-hover:text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}