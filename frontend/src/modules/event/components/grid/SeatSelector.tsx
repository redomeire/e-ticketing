"use client";
import SeatGrid from "./SeatGrid";
import { IGetEventSeatsResponse } from '../../repositories/event.repository';
import { useGetEventSeats } from "../../hooks/useEventRepository";

interface SeatSelectorProps {
    selectedSeatIds: number[];
    onSeatClick: (seat: IGetEventSeatsResponse) => void;
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
            seats={seats?.data}
            selectedSeats={selectedSeatIds}
            onSeatClick={onSeatClick}
        />
    );
}