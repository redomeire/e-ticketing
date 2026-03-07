"use client";

import React from 'react';
import { cn } from "@/lib/utils/cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChairIcon } from '@hugeicons/core-free-icons';

interface Seat {
    id: number;
    seat_number: string;
    is_available: boolean;
    price: number;
}

interface SeatGridProps {
    seats: Seat[][];
    selected_seats: number[];
    on_seat_click: (seat: Seat) => void;
}

export default function SeatGrid({ seats, selected_seats, on_seat_click }: SeatGridProps) {
    return (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="w-full h-2 bg-gray-200 rounded-full mb-16 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Panggung / Layar</span>
            </div>

            <div className="flex flex-col gap-4 min-w-150">
                {seats.map((row, row_idx) => (
                    <div key={row_idx} className="flex justify-center gap-3">
                        <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-300">
                            {String.fromCharCode(65 + row_idx)}
                        </div>

                        {row.map((seat) => {
                            const is_selected = selected_seats.includes(seat.id);
                            return (
                                <button
                                    key={seat.id}
                                    disabled={!seat.is_available}
                                    onClick={() => on_seat_click(seat)}
                                    className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group",
                                        seat.is_available
                                            ? is_selected
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                    )}
                                >
                                    <HugeiconsIcon icon={ChairIcon} size={20} />
                                    <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                                        {seat.seat_number} - Rp {seat.price.toLocaleString()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-center gap-8 border-t pt-8">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 rounded bg-blue-50 border border-blue-100" /> Tersedia
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 rounded bg-blue-600" /> Dipilih
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 rounded bg-gray-100" /> Terisi
                </div>
            </div>
        </div>
    );
}