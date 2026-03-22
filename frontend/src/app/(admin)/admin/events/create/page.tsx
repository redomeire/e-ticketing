"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft01Icon,
    Ticket01Icon,
    GridIcon,
    CheckmarkCircle02Icon,
    InformationCircleIcon,
    Office,
    Delete02Icon as DeleteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema, CreateEventValues } from "@/modules/event/schema/createEvent.schema";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import SearchInputTag from "@/components/ui/search-input-tag";
import { IEventCategory } from "@/modules/event/types/event";
import { useAdminCreateEvent, useAdminCreateEventCategory, useGetEventCategories } from "@/modules/event/hooks/useEventRepository";
import { IAdminCreateEventCategoryRequest } from "@/modules/event/repositories/event.repository";
import { useRouter } from "next/navigation";
import { generateColor } from "@/modules/event/utils/generateColor";
import Dropzone from "@/components/ui/dropzone";
import RichTextEditor from "@/components/ui/rich-text-editor";

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

export default function CreateEventPage() {
    const router = useRouter();
    const form = useForm<CreateEventValues>({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: "",
            location: "",
            description: "",
            terms_and_conditions: "",
            start_time: "",
            end_time: "",
            event_categories: [],
            max_row: 10,
            max_column: 10,
            ticket_categories: [],
        }
    });

    const [categories, setCategories] = useState<ICategoryState[]>([
        {
            id: "REGULAR",
            name: "REGULAR",
            price: 50000,
            quota: 1,
            colors: generateColor("REGULAR")
        },
        {
            id: "VIP",
            name: "VIP",
            price: 75000,
            quota: 1,
            colors: generateColor("VIP")
        }
    ]);

    const { mutateAsync: createEvent, isPending } = useAdminCreateEvent({
        options: {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    });

    const [activeCategoryId, setActiveCategoryId] = useState<string>("REGULAR");
    const [seatData, setSeatData] = useState<Record<string, string>>({});
    const [newCat, setNewCat] = useState({ name: "", price: "", quota: "" });

    const getStaticLabel = (r: number, c: number) => {
        return `${String.fromCharCode(64 + r)}${c}`;
    };

    useEffect(() => {
        const updatedTicketCats = categories.map(cat => ({
            name: cat.name,
            base_price: cat.price.toString(),
            quota: cat.quota,
            seats: Object.entries(seatData)
                .filter(([, catId]) => catId === cat.id)
                .map(([key]) => {
                    const [r, c] = key.split("-").map(Number);
                    return { row: r, column: c, number: getStaticLabel(r, c) };
                })
        }));
        form.setValue("ticket_categories", updatedTicketCats, { shouldValidate: true });
    }, [seatData, categories, form]);

    useEffect(() => {
        // calculate quota based on seatData and group by category
        const categoryCountMap: Record<string, number> = {};
        Object.values(seatData).forEach(catId => {
            if (!categoryCountMap[catId]) categoryCountMap[catId] = 0;
            categoryCountMap[catId]++;
        });
        setCategories(prev => prev.map(cat => ({
            ...cat,
            quota: categoryCountMap[cat.id] || 0
        })));
    }, [seatData]);

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
            if (updatedSeatData[key] === id) delete updatedSeatData[key];
        });
        setSeatData(updatedSeatData);

        if (activeCategoryId === id) setActiveCategoryId(updatedCategories[0]?.id || "OFF");
    };

    const handleSeatClick = (r: number, c: number) => {
        const key = `${r}-${c}`;

        setSeatData(prev => {
            const current = prev[key];

            if (current === activeCategoryId || (activeCategoryId === "OFF" && !current)) {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            }
            if (activeCategoryId === "OFF") return prev;

            return { ...prev, [key]: activeCategoryId };
        });
    };

    const onSubmit: SubmitHandler<CreateEventValues> = async (data: CreateEventValues) => {
        if (typeof data.event_categories === 'undefined') return;
        const mappedTicketCategories = data.ticket_categories.map((item) => ({
            ...item, base_price: parseFloat(item.base_price)
        }));
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = (data as Record<string, unknown>)[key];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formData.append(key, (data as Record<string, any>)[key]);
            if (Array.isArray(value) && value[0] instanceof File) {
                formData.append(key, value[0]);
            }
            else if (key === "event_categories" || key === "ticket_categories") {
                const jsonValue = key === "ticket_categories" ? mappedTicketCategories : value;
                formData.append(key, JSON.stringify(jsonValue));
            }
        });

        const result = await createEvent(formData);
        if (result.success) router.push('/admin/events');
    };

    const watchRows = Number(form.watch("max_row") || 0);
    const watchCols = Number(form.watch("max_column") || 0);

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
                            <Dropzone
                                name="cover_image"
                                withValidation
                                withPreview
                                options={{
                                    accept: {
                                        "image/svg+xml": [],
                                        "image/png": [],
                                        "image/jpeg": [],
                                        "image/gif": [],
                                    },
                                    maxSize: 3 * 1024 * 1024,
                                    multiple: false
                                }}
                            />
                            <div className="grid md:grid-cols-2 gap-8">
                                <Input name="name" label="NAMA EVENT" withValidation className="h-12 rounded-xl" />
                                <Input name="location" label="LOKASI VENUE" withValidation className="h-12 rounded-xl" />
                                <Input name="start_time" type="datetime-local" label="WAKTU MULAI" withValidation className="h-12 rounded-xl" />
                                <Input name="end_time" type="datetime-local" label="WAKTU SELESAI" withValidation className="h-12 rounded-xl" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Deskripsi</Label>
                                <RichTextEditor
                                    name="description"
                                    withValidation
                                    placeholder="Deskripsikan event kamu secara menarik untuk calon penonton"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Syarat & Ketentuan</Label>
                                <RichTextEditor
                                    name="terms_and_conditions"
                                    withValidation
                                    placeholder="Jelaskan syarat dan ketentuan event kamu dengan jelas untuk menghindari kebingungan di kemudian hari"
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
                    <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] bg-white p-8">
                        <div className="flex items-center gap-2 text-[#002558] mb-8">
                            <HugeiconsIcon icon={Ticket01Icon} size={20} />
                            <h3 className="text-lg font-black uppercase tracking-tight">Kategori & Brush</h3>
                        </div>

                        <div className="flex flex-col gap-3">
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
                                        <span className="text-[11px] font-bold opacity-60 group-hover:opacity-0 transition-opacity">
                                            Rp {formatCurrency(cat.price)}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
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
                            <Input name="name_new" placeholder="Nama Kategori..." className="h-11 rounded-xl" value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
                            <Input name="price_new" type="number" placeholder="Harga Tiket..." className="h-11 rounded-xl" value={newCat.price} onChange={(e) => setNewCat({ ...newCat, price: e.target.value })} />
                            <Button type="button" onClick={handleAddCategory} className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl font-bold">Tambah Brush</Button>
                        </div>
                    </Card>

                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2 text-[#002558]">
                                    <HugeiconsIcon icon={GridIcon} size={22} />
                                    <CardTitle className="text-lg font-black uppercase tracking-tight">Editor Denah Kursi</CardTitle>
                                </div>
                                <div className="flex gap-6">
                                    <Input name="max_row" type="number" label="ROWS" withValidation className="h-10 w-20 text-center font-black rounded-lg" />
                                    <Input name="max_column" type="number" label="COLS" withValidation className="h-10 w-20 text-center font-black rounded-lg" />
                                </div>
                            </CardHeader>

                            <CardContent className="p-12 bg-slate-50/30 overflow-auto">
                                <div className="w-full h-3 bg-slate-200 rounded-full mb-16 relative">
                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Panggung Utama</span>
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
                                            const isOff = assignedId === "OFF";
                                            const label = getStaticLabel(r, c);

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
                                                            category ? "shadow-md scale-105 border-transparent" : "text-slate-300 hover:border-blue-400"}`}
                                                >
                                                    {isOff ? "OFF" : label}
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
                    </div>
                </div>
                {/*display error*/}
                {
                    Object.keys(form.formState.errors).length > 0 && (
                        <Card className="border-none shadow-sm rounded-[2rem] bg-red-50 p-6">
                            <CardHeader className="flex items-center gap-2 text-red-500">
                                <HugeiconsIcon icon={InformationCircleIcon} size={20} />
                                <CardTitle className="text-sm font-black uppercase tracking-tight">Form Error</CardTitle>
                            </CardHeader>
                            <CardContent className="text-red-500">
                                {Object.entries(form.formState.errors).map(([key, error]) => (
                                    <p key={key} className="text-xs">
                                        {key}: {error.message}
                                    </p>
                                ))}
                            </CardContent>
                        </Card>
                    )
                }
            </form>
        </FormProviderWrapper>
    );
}