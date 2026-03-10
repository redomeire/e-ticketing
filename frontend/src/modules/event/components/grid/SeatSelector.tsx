"use client";
import SeatGrid from "./SeatGrid";
import { useGetEventSeats } from "../../hooks/useEventRepository";
import { IEventSeat } from "../../types/event";

interface SeatSelectorProps {
    selectedSeatIds: number[];
    onSeatClick: (seat: IEventSeat
        & { base_price: string, category_name: string }
    ) => void;
    slug: string;
}

export default function SeatSelector({ selectedSeatIds, onSeatClick, slug }: SeatSelectorProps) {
    const { data: seats, isPending, isError } = useGetEventSeats({
        payload: {
            slug
        }
    }, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })
    if (isPending || !seats) return <div>Loading...</div>;
    if (isError) return <div>Error loading seats</div>;
    return (
        <SeatGrid
            seats={seats?.data.seats}
            selectedSeats={selectedSeatIds}
            onSeatClick={onSeatClick}
            maxRowIndex={seats.data.max_row_index}
            maxColumnIndex={seats.data.max_column_index}
        />
    );
}