"use client"

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Ticket01Icon,
    GridIcon,
    Office,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useAdminUpdateSeats } from "@/modules/event/hooks/useEventRepository";
import { updateSeatsSchema, UpdateSeatsValues } from "../../schema/updateSeats.schema";
import { generateColor } from "../../utils/generateColor";
import { IGetEventDetailResponse, IGetEventSeatsResponse } from "../../repositories/event.repository";
import { cn } from "@/lib/utils/cn";

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

interface Props {
    max_row: number;
    max_column: number;
    event: IGetEventDetailResponse;
    seats: IGetEventSeatsResponse;
    isLoadingSeat: boolean;
}

export default function UpdateSeatsForm({ max_row, max_column, event, seats }: Props) {
    const router = useRouter();
    const params = useParams();
    const form = useForm<UpdateSeatsValues>({
        resolver: zodResolver(updateSeatsSchema),
        defaultValues: {
            max_column,
            max_row,
            slug: params.slug as string,
            ticket_categories: [],
        }
    });

    const [categories, setCategories] = useState<ICategoryState[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<string>("REGULAR");
    const [seatData, setSeatData] = useState<Record<string, string>>({});

    const { mutateAsync: updateSeats, isPending: isUpdating } = useAdminUpdateSeats({});

    const getSeatLabel = useCallback((r: number, c: number) => {
        return `${String.fromCharCode(64 + r)}${c}`;
    }, []);

    useEffect(() => {
        if (event && seats) {
            const tempMappedSeats: Record<string, string> = {};
            seats.seats.forEach(seat => {
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
                slug: event.slug,
                max_column: event.max_column,
                max_row: event.max_row,
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

    // eslint-disable-next-line react-hooks/incompatible-library
    const watchColumn = Number(form.watch("max_column") || 0);
    const watchRow = Number(form.watch("max_row") || 0);

    const handleSeatClick = (r: number, c: number) => {
        const foundSeatFromAPI = seats?.seats.find(s => s.row_index === r - 1 && s.column_index === c - 1);
        if (foundSeatFromAPI && !foundSeatFromAPI.is_available) return;

        const key = `${r}-${c}`;
        setSeatData(prev => {
            const newState = { ...prev };
            const currentCat = prev[key];

            if (activeCategoryId === "OFF") {
                delete newState[key];
                return newState;
            }

            if (currentCat === activeCategoryId) {
                delete newState[key];
                return newState;
            }

            return { ...prev, [key]: activeCategoryId };
        });
    };

    const onSubmit = async (formData: UpdateSeatsValues) => {
        if (!event) return;
        const formattedTicketCategories = categories.map(cat => ({
            name: cat.name,
            base_price: cat.price,
            quota: cat.quota,
            seats: Object.entries(seatData)
                .filter(([, catName]) => catName === cat.name)
                .map(([key]) => {
                    const [r, c] = key.split("-").map(Number);
                    return {
                        row: r,
                        column: c,
                        number: getSeatLabel(r, c)
                    };
                })
        }));
        const finalPayload = {
            slug: event.slug,
            max_row: Number(formData.max_row),
            max_column: Number(formData.max_column),
            ticket_categories: formattedTicketCategories
        };

        console.log("MENGIRIM PAYLOAD ASLI KE SERVER:", finalPayload);
        const result = await updateSeats(finalPayload);

        if (result.success) {
            router.push('/admin/events');
        }
    };

    return (
        <FormProviderWrapper form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 pb-20 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-[#002558] tracking-tighter uppercase">Editor Denah</h1>
                            <p className="text-sm text-slate-500 font-bold tracking-tight">{event?.name}</p>
                        </div>
                    </div>
                    <Button isLoading={isUpdating} type="submit" className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold px-8 shadow-xl">
                        Simpan Perubahan
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] bg-white p-8 space-y-6">
                        <div className="flex items-center gap-2 text-[#002558] mb-4">
                            <HugeiconsIcon icon={Ticket01Icon} size={20} />
                            <h3 className="text-lg font-black tracking-tight">Brush Kategori</h3>
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
                                        <span className="text-sm font-black uppercase">{cat.name}</span>
                                    </div>
                                    <span className="text-[11px] font-bold">{formatCurrency(cat.price)}</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setActiveCategoryId("OFF")}
                                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${activeCategoryId === "OFF" ? "bg-rose-500 text-white border-rose-600 shadow-lg" : "bg-slate-50 text-slate-400 border-transparent"}`}
                            >
                                <HugeiconsIcon icon={Office} size={18} />
                                <span className="text-sm font-black uppercase">Mode Off (Hapus Kursi)</span>
                            </button>
                        </div>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                            <CardHeader className="p-8 border-b flex flex-row items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-2 text-[#002558]">
                                    <HugeiconsIcon icon={GridIcon} size={22} />
                                    <CardTitle className="text-lg font-black">Grid Editor</CardTitle>
                                </div>
                                <div className="flex gap-4">
                                    <Input name="max_row" type="number" label="Baris" withValidation className="w-24 text-center font-black" />
                                    <Input name="max_column" type="number" label="Kolom" withValidation className="w-24 text-center font-black" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-12 bg-slate-50/30 overflow-auto text-center">
                                <div className="w-full h-3 bg-slate-200 rounded-full mb-16 relative">
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Layar Utama</span>
                                </div>
                                <div
                                    className="grid gap-2 mx-auto"
                                    style={{
                                        gridTemplateColumns: `repeat(${watchColumn}, 44px)`,
                                        width: 'fit-content'
                                    }}
                                >
                                    {Array.from({ length: watchRow }).map((_, rIdx) => {
                                        const r = rIdx + 1;
                                        return Array.from({ length: watchColumn }).map((_, cIdx) => {
                                            const c = cIdx + 1;
                                            const key = `${r}-${c}`;
                                            const assignedCatName = seatData[key];
                                            const category = categories.find(cat => cat.id === assignedCatName);

                                            const isNotAvailable = seats?.seats.find(s => s.row_index === r - 1 && s.column_index === c - 1)?.is_available === false;

                                            const label = getSeatLabel(r, c);

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    disabled={isNotAvailable}
                                                    onClick={() => handleSeatClick(r, c)}
                                                    style={{
                                                        backgroundColor: category ? category.colors.bg : '#f3f4f6',
                                                        borderColor: category ? category.colors.selected : '#e2e8f0',
                                                        color: category ? category.colors.text : '#6a7282'
                                                    }}
                                                    className={cn("h-11 w-11 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2",
                                                        category ? "shadow-md scale-105 border-transparent" : "text-slate-300 hover:border-blue-400 opacity-40",
                                                        isNotAvailable && "bg-gray-100! text-gray-500! border-transparent! cursor-not-allowed",
                                                    )}
                                                >
                                                    {isNotAvailable ? "OFF" : label}
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
    );
}