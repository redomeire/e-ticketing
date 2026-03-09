"use client";

import { cn } from "@/lib/utils/cn";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChairIcon } from '@hugeicons/core-free-icons';
import { IGetEventSeatsResponse } from '../../repositories/event.repository';
import { useMemo } from "react";

interface SeatGridProps {
    seats: IGetEventSeatsResponse[];
    selectedSeats: number[];
    onSeatClick: (seat: IGetEventSeatsResponse) => void;
}

export default function SeatGrid({ seats, selectedSeats, onSeatClick }: SeatGridProps) {
    const generateColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360;
        return {
            bg: `hsl(${h}, 70%, 95%)`,
            text: `hsl(${h}, 70%, 30%)`,
            border: `hsl(${h}, 70%, 85%)`,
            selected: `hsl(${h}, 70%, 45%)`
        };
    };

    const categoryThemes = useMemo(() => {
        const themes: Record<string, ReturnType<typeof generateColor>> = {};
        seats.forEach(seat => {
            const name = seat.ticket_category.name;
            if (!themes[name]) {
                themes[name] = generateColor(name);
            }
        });
        return themes;
    }, [seats]);

    const groupedSeats = useMemo(() => {
        const groups: Record<string, IGetEventSeatsResponse[]> = {};
        seats.forEach(seat => {
            const row = seat.seat_number.match(/[A-Z]+/)?.[0] || "Unknown";
            if (!groups[row]) groups[row] = [];
            groups[row].push(seat);
        });
        return Object.values(groups);
    }, [seats]);

    return (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="w-full h-2 bg-gray-200 rounded-full mb-16 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Panggung / Layar</span>
            </div>

            <div className="flex flex-col gap-4 min-w-150">
                {groupedSeats.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex justify-center gap-3">
                        <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-300">
                            {String.fromCharCode(65 + rowIdx)}
                        </div>

                        {row.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.id);
                            const theme = categoryThemes[seat.ticket_category.name];

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
                                        {seat.seat_number} - {seat.ticket_category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 border-t pt-8">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className="w-4 h-4 rounded bg-gray-100" /> Terisi
                </div>
                {Object.entries(categoryThemes).map(([name, theme]) => (
                    <div key={name} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                        />
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
}