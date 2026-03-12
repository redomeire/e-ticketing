"use client"

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft01Icon,
    Ticket01Icon,
    GridIcon,
    Office,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventValues } from "@/modules/event/schema/createEvent.schema";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import SearchInputTag from "@/components/ui/search-input-tag";
import { IEventCategory } from "@/modules/event/types/event";
import {
    useAdminUpdateEvent,
    useAdminCreateEventCategory,
    useGetEventCategories,
    useGetEventDetail,
    useGetEventSeats
} from "@/modules/event/hooks/useEventRepository";
import { IAdminCreateEventCategoryRequest } from "@/modules/event/repositories/event.repository";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";

interface ICategoryState {
    id: string;
    name: string;
    price: number;
    quota: number;
    colors: {
        bg: string;
        text: string;
        border: string;
        selected: string;
    };
}

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

export default function EventDetailPage() {
    const { slug } = useParams();
    const router = useRouter();

    const { data: eventResponse, isPending: isLoadingData } = useGetEventDetail({
        payload: { slug: slug as string }
    }, { staleTime: Infinity, refetchOnWindowFocus: false });

    const { data: eventSeatResponse, isPending: isLoadingSeat } = useGetEventSeats({
        payload: { slug: slug as string }
    }, { staleTime: Infinity, refetchOnWindowFocus: false });

    const event = eventResponse?.data;
    const seats = eventSeatResponse?.data;

    const form = useForm<CreateEventValues>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: "",
            location: "",
            start_time: "",
            end_time: "",
            description: "",
            terms_and_conditions: "",
            max_row: 0,
            max_column: 0,
            ticket_categories: [],
            event_categories: []
        }
    });

    const [categories, setCategories] = useState<ICategoryState[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string>("REGULAR");
    const [seatData, setSeatData] = useState<Record<string, string>>({});

    const { mutateAsync: updateEvent, isPending: isUpdating } = useAdminUpdateEvent({});

    const getSeatLabel = useCallback((r: number, c: number) => {
        return `${String.fromCharCode(64 + r)}${c}`;
    }, []);

    useEffect(() => {
        if (event && seats) {
            const tempMappedSeats: Record<string, string> = {};
            const sortedSeats = [...seats.seats].sort((a, b) => a.id - b.id);
            sortedSeats.forEach(seat => {
                // UI menggunakan 1-based index (r+1, c+1)
                tempMappedSeats[`${seat.row_index + 1}-${seat.column_index + 1}`] = seat.category_name;
            });
            setSeatData(tempMappedSeats);

            const mappedCats = event.ticket_categories.map(tc => ({
                id: tc.name,
                name: tc.name,
                price: tc.base_price,
                quota: tc.quota,
                colors: generateColor(tc.name)
            }));
            setCategories(mappedCats);

            form.reset({
                name: event.name || "",
                description: event.description || "",
                terms_and_conditions: event.terms_and_conditions || "",
                start_time: event.start_time?.replace(" ", "T").substring(0, 16) || "",
                end_time: event.end_time?.replace(" ", "T").substring(0, 16) || "",
                location: event.location || "",
                max_row: event.max_row,
                max_column: event.max_column,
                event_categories: event.categories || [],
                ticket_categories: event.ticket_categories.map(tc => ({
                    name: tc.name,
                    base_price: tc.base_price.toString(),
                    quota: tc.quota,
                    seats: seats.seats
                        .filter(s => s.category_name === tc.name)
                        .map(s => ({
                            row: s.row_index + 1,
                            column: s.column_index + 1,
                            number: s.seat_number
                        }))
                }))
            });
        }
    }, [event, seats, form]);

    useEffect(() => {
        if (!isLoadingData && event && categories.length > 0) {
            const updatedTicketCats = categories.map(cat => ({
                name: cat.name,
                base_price: cat.price.toString(),
                quota: cat.quota,
                seats: Object.entries(seatData)
                    .filter(([, catId]) => catId === cat.id)
                    .map(([key]) => {
                        const [r, c] = key.split("-").map(Number);
                        return { row: r, column: c, number: getSeatLabel(r, c) };
                    })
            }));
            form.setValue("ticket_categories", updatedTicketCats, { shouldValidate: true });
        }
    }, [seatData, categories, isLoadingData, event, form, getSeatLabel]);

    const handleSeatClick = (r: number, c: number) => {
        const foundSeatFromAPI = seats?.seats.find(s => s.row_index === r - 1 && s.column_index === c - 1);
        if (foundSeatFromAPI && !foundSeatFromAPI.is_available) return;

        const key = `${r}-${c}`;
        setSeatData(prev => {
            const current = prev[key];
            if (current === activeCategoryId) {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            }
            return { ...prev, [key]: activeCategoryId };
        });
    };

    const onSubmit = async (data: CreateEventValues) => {
        if (!event) return;
        if (!data.event_categories) return;
        const cleanedEventCategories = data.event_categories.filter(ec => ec.name);
        const result = await updateEvent({
            id: event.id,
            ...data,
            event_categories: cleanedEventCategories,
            ticket_categories: data.ticket_categories.map(tc => ({
                ...tc, base_price: parseFloat(tc.base_price)
            }))
        });
        if (result.success) router.push('/admin/events');
    };

    const watchRows = Number(form.watch("max_row") || 0);
    const watchCols = Number(form.watch("max_column") || 0);

    return (
        <QueryStateHandler isPending={isLoadingData || isLoadingSeat} data={event}>
            <FormProviderWrapper form={form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 pb-20 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/admin/events">
                                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
                                    <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-[#002558] tracking-tighter uppercase">Update Event</h1>
                                <p className="text-sm text-slate-500 font-bold tracking-tight">{event?.name}</p>
                            </div>
                        </div>
                        <Button isLoading={isUpdating} type="submit" className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold px-8 shadow-xl">
                            Simpan Perubahan
                        </Button>
                    </div>

                    <Card className="border-none shadow-sm rounded-[2rem] bg-white p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Input name="name" label="NAMA EVENT" withValidation className="h-12 rounded-xl" />
                            <Input name="location" label="LOKASI" withValidation className="h-12 rounded-xl" />
                            <Input name="start_time" type="datetime-local" label="MULAI" withValidation className="h-12 rounded-xl" />
                            <Input name="end_time" type="datetime-local" label="SELESAI" withValidation className="h-12 rounded-xl" />
                        </div>
                        <div className="grid gap-8">
                            <Textarea name="description" withValidation label="DESKRIPSI" className="min-h-32 rounded-2xl" />
                            <Textarea name="terms_and_conditions" withValidation label="SYARAT & KETENTUAN" className="min-h-32 rounded-2xl" />
                        </div>
                        <SearchInputTag<IEventCategory, IAdminCreateEventCategoryRequest>
                            name="event_categories"
                            label="TAG KATEGORI"
                            getDisplayValue={(item) => item.name}
                            getValue={(item) => item.id}
                            useQueryHook={useGetEventCategories}
                            useMutationHook={useAdminCreateEventCategory}
                        />
                    </Card>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] bg-white p-8 space-y-6">
                            <div className="flex items-center gap-2 text-[#002558] mb-4">
                                <HugeiconsIcon icon={Ticket01Icon} size={20} />
                                <h3 className="text-lg font-black uppercase tracking-tight">Brush Kategori</h3>
                            </div>
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveCategoryId(cat.id)}
                                        style={{
                                            backgroundColor: activeCategoryId === cat.id ? cat.colors.bg : 'transparent',
                                            borderColor: activeCategoryId === cat.id ? cat.colors.selected : 'transparent',
                                            color: cat.colors.text
                                        }}
                                        className={`w-full flex items-start flex-col justify-between p-4 rounded-2xl border-2 transition-all ${activeCategoryId !== cat.id ? "bg-slate-50 border-transparent text-slate-400" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colors.selected }} />
                                            <span className="text-sm font-black">{cat.name}</span>
                                        </div>
                                        <span className="text-[11px] font-bold">{formatCurrency(cat.price)}</span>
                                    </button>
                                ))}
                                <button type="button" onClick={() => setActiveCategoryId("OFF")} className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${activeCategoryId === "OFF" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 border-transparent"}`}>
                                    <HugeiconsIcon icon={Office} size={18} />
                                    <span className="text-sm font-black uppercase">Mode Off</span>
                                </button>
                            </div>
                        </Card>

                        <div className="lg:col-span-2">
                            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                                <CardHeader className="p-8 border-b flex flex-row items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-2 text-[#002558]">
                                        <HugeiconsIcon icon={GridIcon} size={22} />
                                        <CardTitle className="text-lg font-black uppercase">Editor Grid</CardTitle>
                                    </div>
                                    <div className="flex gap-4">
                                        <Input name="max_row" type="number" label="ROWS" withValidation className="w-24 text-center font-black" />
                                        <Input name="max_column" type="number" label="COLS" withValidation className="w-24 text-center font-black" />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-12 bg-slate-50/30 overflow-auto">
                                    <div className="w-full h-3 bg-slate-200 rounded-full mb-16 relative">
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Layar / Panggung</span>
                                    </div>
                                    <div
                                        className="grid gap-2 mx-auto"
                                        style={{
                                            gridTemplateColumns: `repeat(${watchCols}, 44px)`,
                                            width: 'fit-content'
                                        }}
                                    >
                                        {Array.from({ length: watchRows }).map((_, rIdx) => {
                                            const r = rIdx + 1;
                                            return Array.from({ length: watchCols }).map((_, cIdx) => {
                                                const c = cIdx + 1;
                                                const key = `${r}-${c}`;
                                                const assignedId = seatData[key];
                                                const category = categories.find(cat => cat.id === assignedId);
                                                const foundSeat = seats?.seats.find(s => s.row_index === rIdx && s.column_index === cIdx);
                                                const isLockedOrSold = foundSeat !== undefined && foundSeat.is_available === false;
                                                const label = getSeatLabel(r, c);

                                                return (
                                                    <button
                                                        key={key}
                                                        type="button"
                                                        disabled={isLockedOrSold}
                                                        onClick={() => handleSeatClick(r, c)}
                                                        style={{
                                                            backgroundColor: category ? category.colors.bg : isLockedOrSold ? undefined : 'white',
                                                            borderColor: category ? category.colors.selected : isLockedOrSold ? '#fda4af' : '#e2e8f0',
                                                            color: category ? category.colors.text : undefined
                                                        }}
                                                        className={`h-11 w-11 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2 disabled:cursor-not-allowed
                                                            ${isLockedOrSold ? "bg-rose-50 text-rose-300 opacity-60 border-rose-200" :
                                                                category ? "shadow-md scale-105 border-transparent" : "text-slate-300 hover:border-blue-400"}`}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            });
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </FormProviderWrapper>
        </QueryStateHandler>
    );
}