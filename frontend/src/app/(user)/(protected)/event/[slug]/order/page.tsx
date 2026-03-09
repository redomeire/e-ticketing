"use client";

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    UserIcon,
    Mail,
    Phone,
    Ticket
} from '@hugeicons/core-free-icons';
import { useParams } from 'next/navigation';
import { IGetEventSeatsResponse } from '@/modules/event/repositories/event.repository';
import { BookingFormData, bookingSchema } from '@/modules/event/schema/createAttendee.schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormProviderWrapper from '@/components/provider/FormProviderWrapper';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// prevent hydration mismatch
const SeatSelector = dynamic(
    () => import("@/modules/event/components/grid/SeatSelector"),
    {
        ssr: false,
        loading: () => <div className="h-100 flex items-center justify-center animate-pulse text-blue-900 font-bold">Menyiapkan Denah Kursi...</div>
    }
);

export default function BookingPage() {
    const [selectedSeats, setSelectedSeats] = useState<IGetEventSeatsResponse[]>([]);
    const [applicationFee, setApplicationFee] = useState(0);
    const params = useParams();

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: { attendees: [] },
        mode: "onBlur"
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "attendees"
    });

    const toggle_seat = (seat: IGetEventSeatsResponse) => {
        if (selectedSeats.find(s => s.id === seat.id)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
            setApplicationFee((prev) => prev - 0.1 * seat.ticket_category.base_price);
            const index = fields.findIndex(f => f.seatId === seat.id);
            if (index !== -1) {
                remove(index);
            }
        } else {
            setSelectedSeats((prev) => [...prev, seat]);
            setApplicationFee((prev) => prev + 0.1 * seat.ticket_category.base_price);
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
        return selectedSeats.reduce(
            (acc, curr) => acc + curr.ticket_category.base_price, 0
        );
    }, [selectedSeats]);

    const onSubmit = (data: BookingFormData) => {
        console.log(data);
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
                                onSeatClick={toggle_seat}
                                slug={params.slug as string}
                            />
                        </section>

                        {selectedSeats.length > 0 && fields.length > 0 && (
                            <FormProviderWrapper form={form}>
                                <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-2xl font-black text-[#002558] tracking-tight">Informasi Peserta</h2>
                                    {selectedSeats.map((seat, index) => (
                                        <div key={seat.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-black text-[#002558] text-lg">Kursi {seat.seat_number}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl">
                                                    <Checkbox id={`use-my-data-${seat.id}`} />
                                                    <Label htmlFor={`use-my-data-${seat.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                                                        Gunakan Data Pribadi
                                                    </Label>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</Label>
                                                    <div className="relative">
                                                        <Input
                                                            className="h-12 pl-10 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-600" placeholder="Sesuai KTP"
                                                            withValidation
                                                            name={`attendees.${index}.name`}
                                                        />
                                                        <HugeiconsIcon icon={UserIcon} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</Label>
                                                    <div className="relative">
                                                        <Input
                                                            className="h-12 pl-10 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-600" placeholder="email@contoh.com"
                                                            withValidation
                                                            name={`attendees.${index}.email`}
                                                        />
                                                        <HugeiconsIcon icon={Mail} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor WhatsApp</Label>
                                                    <div className="relative">
                                                        <Input
                                                            className="h-12 pl-10 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-600" placeholder="0812xxxx"
                                                            withValidation
                                                            name={`attendees.${index}.phone`}
                                                        />
                                                        <HugeiconsIcon icon={Phone} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jenis Kelamin</Label>
                                                    <div className="relative">
                                                        <Select
                                                            withValidation
                                                            name={`attendees.${index}.isMale`}
                                                        >
                                                            <SelectTrigger className="w-45 border-blue-600 ring-blue-600">
                                                                <SelectValue placeholder="Jenis Kelamin" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="laki-laki">Laki-Laki</SelectItem>
                                                                    <SelectItem value="perempuan">Perempuan</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <HugeiconsIcon icon={UserIcon} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </form>
                            </FormProviderWrapper>
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
                                            <span className="font-bold">Rp {seat.ticket_category.base_price.toLocaleString()}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-blue-300 tracking-widest">Subtotal</span>
                                        <span className="text-2xl font-black text-white">Rp {total_price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-blue-300 tracking-widest">Biaya aplikasi</span>
                                        <span className="text-2xl font-black text-white">Rp {applicationFee.toLocaleString()}</span>
                                    </div>
                                    <hr className=' border-white/10 my-5' />
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-bold text-blue-300 tracking-widest">Total Order</span>
                                        <span className="text-2xl font-black text-white">Rp {(total_price + applicationFee).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                disabled={selectedSeats.length === 0}
                                onClick={form.handleSubmit(onSubmit)}
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