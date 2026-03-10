"use client";

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Ticket
} from '@hugeicons/core-free-icons';
import { useParams } from 'next/navigation';
import { IGetEventSeatsResponse } from '@/modules/event/repositories/event.repository';
import { BookingFormData, bookingSchema } from '@/modules/event/schema/createAttendee.schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckout } from '@/modules/order/repositories/useOrderRepository';
import { IEventSeat } from '@/modules/event/types/event';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import SelectSeatForm from '@/modules/order/components/form/SelectSeatForm';

// prevent hydration mismatch
const SeatSelector = dynamic(
    () => import("@/modules/event/components/grid/SeatSelector"),
    {
        ssr: false,
        loading: () => <div className="h-100 flex items-center justify-center animate-pulse text-blue-900 font-bold">Menyiapkan Denah Kursi...</div>
    }
);

export default function BookingPage() {
    const [selectedSeats, setSelectedSeats] = useState<IGetEventSeatsResponse["seats"]>([]);
    const [applicationFee, setApplicationFee] = useState(0);
    const params = useParams();

    const { mutateAsync, isPending } = useCheckout();

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { attendees: [] },
        mode: "onBlur"
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "attendees"
    });

    const toggleSeat = (seat: IEventSeat & { base_price: string; category_name: string }) => {
        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
            setApplicationFee((prev) => prev - 0.1 * parseFloat(seat.base_price));
            const index = fields.findIndex(f => f.seatId === seat.id);
            if (index !== -1) {
                remove(index);
            }
        } else {
            setSelectedSeats((prev) => [...prev, seat]);
            setApplicationFee((prev) => prev + 0.1 * parseFloat(seat.base_price));
            append({
                name: "",
                email: "",
                isMale: "laki-laki",
                phone: "",
                seatId: seat.id
            })
        }
    };

    const total_price = useMemo(() => {
        console.log(selectedSeats)
        return selectedSeats.reduce(
            (acc, curr) => acc + parseFloat(curr.base_price), 0
        );
    }, [selectedSeats]);

    const onSubmit = async (data: BookingFormData) => {
        const convertedData = {
            attendees: data.attendees.map((attendee) => ({
                ...attendee,
                is_male: attendee.isMale === "laki-laki",
                seat_id: attendee.seatId
            }))
        }
        const res = await mutateAsync(convertedData);
        if (res.success) {
            window.location.assign(res.data.invoice_url);
        }
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <section>
                            <h2 className="text-2xl font-black text-[#002558] mb-6 tracking-tight">Pilih kursi</h2>
                            <SeatSelector
                                selectedSeatIds={selectedSeats.map(s => s.id)}
                                onSeatClick={toggleSeat}
                                slug={params.slug as string}
                            />
                        </section>

                        {selectedSeats.length > 0 && fields.length > 0 && (
                            <SelectSeatForm
                                form={form}
                                selectedSeats={selectedSeats.map(seat => ({
                                    id: seat.id,
                                    seat_number: seat.seat_number
                                }))}
                            />
                        )}
                    </div>

                    <div className="relative">
                        <div className="sticky top-28 bg-[#002558] text-white rounded-3xl p-8 space-y-8 shadow-2xl">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-white/10 pb-4">Ringkasan pesanan</h3>

                            <div className="space-y-4 max-h-75 overflow-y-auto no-scrollbar">
                                {selectedSeats.length === 0 ? (
                                    <p className="text-blue-200 text-sm italic opacity-60">Belum ada kursi yang dipilih.</p>
                                ) : (
                                    selectedSeats.map(seat => (
                                        <div key={seat.id} className="flex justify-between items-center text-sm group animate-in fade-in">
                                            <div className="flex items-center gap-2">
                                                <HugeiconsIcon icon={Ticket} size={16} className="text-blue-400" />
                                                <span className="font-medium">Kursi {seat.seat_number}</span>
                                            </div>
                                            <span className="font-bold">Rp {seat.base_price.toLocaleString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-blue-300 tracking-widest">Subtotal</span>
                                        <span className="text-2xl font-black text-white">{formatCurrency(total_price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-blue-300 tracking-widest">Biaya aplikasi</span>
                                        <span className="text-2xl font-black text-white">{formatCurrency(applicationFee)}</span>
                                    </div>
                                    <hr className=' border-white/10 my-5' />
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-blue-300 tracking-widest">Total Order</span>
                                        <span className="text-2xl font-black text-white">{formatCurrency(total_price + applicationFee)}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                disabled={selectedSeats.length === 0}
                                onClick={form.handleSubmit(onSubmit)}
                                isLoading={isPending}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-lg shadow-lg active:scale-95 transition-all"
                            >
                                Bayar Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}