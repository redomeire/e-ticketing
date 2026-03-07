"use client";

import { useMemo } from 'react';
import SeatGrid from "./SeatGrid";
import type { Seat } from "@/modules/event/types/order";

interface SeatSelectorProps {
    selected_seat_ids: number[];
    on_seat_click: (seat: Seat) => void;
}

export default function SeatSelector({ selected_seat_ids, on_seat_click }: SeatSelectorProps) {
    const seats_data = useMemo(() => {
        return Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 10 }, (_, c) => ({
                id: r * 10 + c,
                seat_number: `${String.fromCharCode(65 + r)}${c + 1}`,
                is_available: Math.random() > 0.2,
                price: 150000
            }))
        );
    }, []);

    return (
        <SeatGrid
            seats={seats_data}
            selected_seats={selected_seat_ids}
            on_seat_click={on_seat_click}
        />
    );
}