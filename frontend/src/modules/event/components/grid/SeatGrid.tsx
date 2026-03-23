"use client";

import { IGetEventSeatsResponse } from '../../repositories/event.repository';
import { useMemo } from "react";
import { IEventSeat } from "../../types/event";
import EventSeatCard from "../card/EventSeatCard";
import { generateColor } from '../../utils/generateColor';

interface SeatGridProps {
    seats: IGetEventSeatsResponse["seats"];
    maxRowIndex: number;
    maxColumnIndex: number;
    selectedSeats: number[];
    onSeatClick: (seat: IEventSeat & {
        base_price: string; category_name: string
    }) => void;
}

export default function SeatGrid({
    seats,
    selectedSeats,
    onSeatClick,
    maxColumnIndex,
    maxRowIndex
}: SeatGridProps) {
    const categoryThemes = useMemo(() => {
        if (!seats) return {};
        const themes: Record<string, ReturnType<typeof generateColor>> = {};
        seats.forEach(seat => {
            const name = seat.category_name;
            if (!themes[name]) {
                themes[name] = generateColor(name);
            }
        });
        return themes;
    }, [seats]);

    const group = useMemo(() => {
        const grid: (IGetEventSeatsResponse["seats"][number] | null)[][]
            = Array.from({ length: maxRowIndex }, () =>
                Array.from({ length: maxColumnIndex }, () => null)
            );
        seats.forEach(seat => {
            const row = seat.row_index;
            const col = seat.column_index;
            if (grid[row] && grid[row][col] === null) {
                grid[row][col] = seat;
            }
        });
        return grid;
    }, [maxColumnIndex, maxRowIndex, seats]);

    return (
        <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
            <div className="w-full h-2 bg-gray-200 rounded-full mb-16 relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Panggung / Layar</span>
            </div>
            <div className="flex flex-col gap-4 min-w-150">
                {group.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-3">
                        <div className="w-8 flex items-center justify-center text-xs font-bold text-gray-300">
                            {String.fromCharCode(65 + rowIndex)}
                        </div>

                        {row.map((seat, colIndex) => {
                            if (!seat) {
                                return <div key={colIndex} className="w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group border
                                bg-gray-200 text-gray-300 border-transparent cursor-not-allowed" />;
                            }
                            const isSelected = selectedSeats.includes(seat?.id);
                            const theme = categoryThemes[seat?.category_name];

                            return <EventSeatCard
                                key={seat.id}
                                seat={seat}
                                isSelected={isSelected}
                                onSeatClick={onSeatClick}
                                theme={theme}
                            />
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