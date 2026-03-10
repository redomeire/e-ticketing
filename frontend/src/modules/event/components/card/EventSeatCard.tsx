import { cn } from "@/lib/utils/cn";
import { ChairIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IEventSeat } from "../../types/event";

interface Props {
    seat: IEventSeat & { base_price: string; category_name: string };
    isSelected: boolean;
    onSeatClick: (seat: Props["seat"]) => void;
    theme: {
        bg: string;
        text: string;
        border: string;
        selected: string;
    }
}

export default function EventSeatCard({ seat, isSelected, onSeatClick, theme }: Props) {
    return (
        <button
            key={seat.id}
            disabled={!seat.is_available}
            onClick={() => onSeatClick(seat)}
            style={{
                backgroundColor: isSelected ? theme.selected : (seat.is_available ? theme.bg : undefined),
                color: isSelected ? 'white' : (seat.is_available ? theme.text : undefined),
                borderColor: isSelected ? theme.selected : theme.border
            }}
            className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group border",
                !seat.is_available && "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed",
                isSelected && "shadow-lg scale-105"
            )}
        >
            <HugeiconsIcon icon={ChairIcon} size={20} />
            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20 shadow-xl pointer-events-none">
                {seat.seat_number} - {seat.category_name}
            </span>
        </button>
    )
}