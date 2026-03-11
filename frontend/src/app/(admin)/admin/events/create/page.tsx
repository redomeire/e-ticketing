"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft01Icon,
    Ticket01Icon,
    GridIcon,
    CheckmarkCircle02Icon,
    InformationCircleIcon,
    Office,
    DeleteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventValues } from "@/modules/event/schema/createEvent.schema";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import SearchInputTag from "@/components/ui/search-input-tag";
import { IEventCategory } from "@/modules/event/types/event";
import { useAdminCreateEvent, useAdminCreateEventCategory, useGetEventCategories } from "@/modules/event/hooks/useEventRepository";
import { IAdminCreateEventCategoryRequest } from "@/modules/event/repositories/event.repository";
import { useRouter } from "next/navigation";

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

export default function CreateEventPage() {
    const router = useRouter();
    const form = useForm<CreateEventValues>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: "Black Myth Wukong Release Playgame",
            description: "Black Myth: Wukong is a 2024 action-RPG from Game Science...",
            terms_and_conditions: "Do NOT Insult other influencers or Players",
            start_time: "2026-03-12T15:25",
            end_time: "2026-03-15T17:00",
            location: "SCBD",
            max_row_index: 10,
            max_column_index: 10,
            ticket_categories: [
                { name: "REGULAR", base_price: "50000", quota: 1, seats: [] },
                { name: "VIP", base_price: "75000", quota: 1, seats: [] }
            ],
            event_categories: [{ name: "Santai" }, { name: "Hiburan" }]
        }
    });
    const [categories, setCategories] = useState([
        { id: "REGULAR", name: "REGULAR", price: 50000, quota: 1, colors: generateColor("REGULAR") },
        { id: "VIP", name: "VIP", price: 75000, quota: 1, colors: generateColor("VIP") }
    ]);
    const { mutateAsync: createEvent, isPending } = useAdminCreateEvent({});

    const [activeCategoryId, setActiveCategoryId] = useState<string>("REGULAR");
    const [seatData, setSeatData] = useState<Record<string, string>>({});
    const [newCat, setNewCat] = useState({ name: "", price: "", quota: "" });

    useEffect(() => {
        const updatedTicketCats = categories.map(cat => ({
            name: cat.name,
            base_price: cat.price.toString(),
            quota: cat.quota,
            seats: Object.entries(seatData)
                .filter(([, catId]) => catId === cat.id)
                .map(([key]) => {
                    const [r, c] = key.split("-").map(Number);
                    return { row: r, column: c, number: getSeatLabel(r, c, seatData) };
                })
        }));
        form.setValue("ticket_categories", updatedTicketCats, { shouldValidate: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seatData, categories]);

    const handleNewCatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewCat(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = () => {
        if (!newCat.name || !newCat.price) return;
        const categoryId = newCat.name.toUpperCase().replace(/\s+/g, '-');
        const categoryName = newCat.name.toUpperCase();

        setCategories([...categories, {
            id: categoryId,
            name: categoryName,
            price: Number(newCat.price),
            quota: Number(newCat.quota) || 1,
            colors: generateColor(categoryName)
        }]);
        setNewCat({ name: "", price: "", quota: "" });
    };

    const handleDeleteCategory = (id: string) => {
        if (categories.length <= 1) return;

        const updatedCategories = categories.filter(cat => cat.id !== id);
        setCategories(updatedCategories);

        const updatedSeatData = { ...seatData };
        Object.keys(updatedSeatData).forEach(key => {
            if (updatedSeatData[key] === id) {
                delete updatedSeatData[key];
            }
        });
        setSeatData(updatedSeatData);

        if (activeCategoryId === id) {
            setActiveCategoryId(updatedCategories[0]?.id || "OFF");
        }
    };

    const handleSeatClick = (r: number, c: number) => {
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

    function getSeatLabel(r: number, c: number, currentSeats: Record<string, string>) {
        if (currentSeats[`${r}-${c}`] === "OFF") return "OFF";

        let labelIndex = 0;
        for (let i = 1; i <= c; i++) {
            const seatStatus = currentSeats[`${r}-${i}`];
            if (seatStatus !== "OFF") {
                labelIndex++;
            }
        }
        return `${String.fromCharCode(64 + r)}${labelIndex}`;
    }

    const onSubmit = async (data: CreateEventValues) => {
        console.log("FINAL PAYLOAD SUCCESS:", data);
        if (typeof data.event_categories === 'undefined') return;
        const mappedTicketCategories = data.ticket_categories.map((item) => ({
            ...item, base_price: parseFloat(item.base_price)
        }))
        const result = await createEvent({
            ...data,
            ticket_categories: mappedTicketCategories
        });
        if (result.success) {
            router.push('/admin/events');
        }
    };

    return (
        <FormProviderWrapper form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 font-sans pb-20 max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/admin/events">
                        <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[#002558] tracking-tighter uppercase">Buat Event</h1>
                        <p className="text-sm text-slate-500 font-bold tracking-tight">Kelola detail, kategori, dan denah kursi secara profesional.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                        <CardHeader className="pb-4 border-b border-slate-50 px-10 pt-8">
                            <div className="flex items-center gap-2 text-[#002558]">
                                <HugeiconsIcon icon={InformationCircleIcon} size={20} />
                                <CardTitle className="text-lg font-black uppercase tracking-tight">Metadata Event</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <Input name="name" label="NAMA EVENT" withValidation className="h-12 rounded-xl" />
                                <Input name="location" label="LOKASI VENUE" withValidation className="h-12 rounded-xl" />
                                <Input name="start_time" type="datetime-local" label="WAKTU MULAI" withValidation className="h-12 rounded-xl" />
                                <Input name="end_time" type="datetime-local" label="WAKTU SELESAI" withValidation className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Deskripsi</Label>
                                <Textarea
                                    name="description"
                                    placeholder="Ceritakan detail event Anda..." className="min-h-30 rounded-2xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Syarat & Ketentuan</Label>
                                <Textarea
                                    name="terms_and_conditions"
                                    placeholder="Apa syarat dan ketentuan mengikuti event ini" className="min-h-30 rounded-2xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Kategori</Label>
                                <SearchInputTag<IEventCategory, IAdminCreateEventCategoryRequest>
                                    name="event_categories"
                                    placeholder="Cari kategori..."
                                    getDisplayValue={(item) => item.name}
                                    getValue={(item) => item.id}
                                    useQueryHook={useGetEventCategories}
                                    useMutationHook={useAdminCreateEventCategory}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* LEFT: Category Selection */}
                    <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] bg-white p-8">
                        <div className="flex items-center gap-2 text-[#002558] mb-8">
                            <HugeiconsIcon icon={Ticket01Icon} size={20} />
                            <h3 className="text-lg font-black uppercase tracking-tight">Kategori & Brush</h3>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Bagian Loop Kategori */}
                            {categories.map((cat) => (
                                <div key={cat.id} className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => setActiveCategoryId(cat.id)}
                                        style={{
                                            backgroundColor: activeCategoryId === cat.id ? cat.colors.bg : 'transparent',
                                            borderColor: activeCategoryId === cat.id ? cat.colors.selected : 'transparent',
                                            color: cat.colors.text
                                        }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${activeCategoryId !== cat.id ? "bg-slate-50 border-transparent text-slate-400" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colors.selected }} />
                                            <span className="text-sm font-black">{cat.name}</span>
                                        </div>
                                        {/* Tampilkan harga hanya jika tidak sedang hover (untuk memberi ruang tombol delete) */}
                                        <span className="text-[11px] font-bold opacity-60 group-hover:opacity-0 transition-opacity">
                                            Rp {formatCurrency(cat.price)}
                                        </span>
                                    </button>

                                    {/* Tombol Hapus (Muncul saat hover kartu) */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Mencegah trigger klik kategori
                                            handleDeleteCategory(cat.id);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <HugeiconsIcon icon={DeleteIcon} size={18} />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setActiveCategoryId("OFF")}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${activeCategoryId === "OFF" ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-slate-50 text-slate-400 border-transparent"}`}
                            >
                                <HugeiconsIcon icon={Office} size={18} />
                                <span className="text-sm font-black uppercase">Mode Off (Lorong)</span>
                            </button>
                        </div>

                        <div className="pt-8 mt-8 border-t border-slate-50 space-y-4">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tambah Kategori Baru</Label>
                            <Input name="name" placeholder="Nama Kategori..." className="h-11 rounded-xl" value={newCat.name} onChange={handleNewCatChange} />
                            <Input name="price" type="number" placeholder="Harga Tiket..." className="h-11 rounded-xl" value={newCat.price} onChange={handleNewCatChange} />
                            <Button type="button" onClick={handleAddCategory} className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl font-bold">Tambah Brush</Button>
                        </div>
                    </Card>

                    {/* RIGHT: Grid Editor */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2 text-[#002558]">
                                    <HugeiconsIcon icon={GridIcon} size={22} />
                                    <CardTitle className="text-lg font-black uppercase tracking-tight">Editor Denah Kursi</CardTitle>
                                </div>
                                <div className="flex gap-6">
                                    <Input name="max_row_index" type="number" label="ROWS" withValidation className="h-10 w-20 text-center font-black rounded-lg" />
                                    <Input name="max_column_index" type="number" label="COLS" withValidation className="h-10 w-20 text-center font-black rounded-lg" />
                                </div>
                            </CardHeader>

                            <CardContent className="p-12 bg-slate-50/30">
                                <div className="w-full h-3 bg-slate-200 rounded-full mb-16 relative">
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Panggung Utama</span>
                                </div>

                                <div
                                    className="grid gap-2 mx-auto"
                                    style={{
                                        gridTemplateColumns: `repeat(${form.watch("max_column_index")}, 44px)`,
                                        width: 'fit-content'
                                    }}
                                >
                                    {Array.from({ length: Number(form.watch("max_row_index") || 0) }).map((_, rIdx) => {
                                        const r = rIdx + 1;
                                        return Array.from({ length: Number(form.watch("max_column_index") || 0) }).map((_, cIdx) => {
                                            const c = cIdx + 1;
                                            const key = `${r}-${c}`;
                                            const assignedId = seatData[key];
                                            const category = categories.find(cat => cat.id === assignedId);
                                            const isOff = assignedId === "OFF";
                                            const label = getSeatLabel(r, c, seatData);

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => handleSeatClick(r, c)}
                                                    style={{
                                                        backgroundColor: category ? category.colors.bg : isOff ? undefined : 'white',
                                                        borderColor: category ? category.colors.selected : isOff ? undefined : '#e2e8f0',
                                                        color: category ? category.colors.text : undefined
                                                    }}
                                                    className={`h-11 w-11 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2
                                                        ${isOff ? "bg-slate-200 border-dashed border-slate-300 opacity-40 scale-90" :
                                                            category ? "shadow-md scale-105" : "text-slate-300 hover:border-blue-400 hover:text-blue-400"}`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        });
                                    })}
                                </div>

                                <div className="mt-12 flex justify-end">
                                    <Button
                                        isLoading={isPending}
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 h-14 px-12 rounded-2xl font-black text-white gap-3 shadow-xl transition-all active:scale-95 text-base uppercase tracking-wider">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />
                                        Terbitkan Event
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Debug Info: Hapus saat produksi */}
                        {Object.keys(form.formState.errors).length > 0 && (
                            <p className="mt-4 text-rose-600 font-bold text-sm bg-rose-50 p-4 rounded-xl">
                                Perhatian: Masih ada field yang belum valid. Pastikan setiap kategori memiliki minimal 1 kursi.
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </FormProviderWrapper>
    );
}