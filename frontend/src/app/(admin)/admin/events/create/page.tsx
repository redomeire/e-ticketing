"use client"

import React, { useState } from "react";
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
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

export default function Page() {
    const [eventData, setEventData] = useState({
        name: "Kiwari",
        description: "Bersiaplah untuk petualangan terbesar tahun ini! One Piece Fan Fest 2026 hadir membawa atmosfer Grand Line langsung ke hadapan Anda.",
        terms_and_conditions: "Berawal dari pertanyaan yang sempat viral, TEDxBandung melahirkan jawaban-jawaban...",
        start_time: "2026-03-11T15:25",
        end_time: "2026-03-15T17:00",
        location: "Museum Sri Baduga",
        max_row_index: 10,
        max_column_index: 10,
    });

    const [categories, setCategories] = useState([
        { id: "REGULAR", name: "REGULAR", price: 50000, quota: 100, colors: generateColor("REGULAR") },
        { id: "VIP", name: "VIP", price: 75000, quota: 50, colors: generateColor("VIP") }
    ]);

    const [activeCategoryId, setActiveCategoryId] = useState<string>("REGULAR");
    const [newCat, setNewCat] = useState({ name: "", price: "", quota: "" });
    const [seatData, setSeatData] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEventData(prev => ({
            ...prev,
            [name]: name.includes('index') ? Number(value) : value
        }));
    };

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
            quota: Number(newCat.quota) || 0,
            colors: generateColor(categoryName)
        }]);
        setNewCat({ name: "", price: "", quota: "" });
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

    const getSeatLabel = (r: number, c: number) => {
        if (seatData[`${r}-${c}`] === "OFF") return "OFF";
        let activeCount = 0;
        for (let i = 1; i <= c; i++) {
            if (seatData[`${r}-${i}`] !== "OFF") activeCount++;
        }
        return `${String.fromCharCode(64 + r)}${activeCount}`;
    };

    return (
        <div className="space-y-8 p-4 font-sans pb-20 max-w-7xl mx-auto">
            <div className="flex items-center gap-6">
                <Link href="/admin/events">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Event</h1>
                    <p className="text-sm text-slate-500">Kelola detail, kategori, dan denah kursi untuk event Anda.</p>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-sm rounded-xl">
                    <CardHeader className="pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-2 text-blue-600">
                            <HugeiconsIcon icon={InformationCircleIcon} size={20} />
                            <CardTitle className="text-lg font-bold">Metadata</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-500 uppercase">Nama Event</Label>
                            <Input name="name" value={eventData.name} onChange={handleInputChange} className="h-10 rounded-lg shadow-none" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-500 uppercase">Lokasi</Label>
                            <Input name="location" value={eventData.location} onChange={handleInputChange} className="h-10 rounded-lg shadow-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-500 uppercase">Mulai</Label>
                                <Input name="start_time" type="datetime-local" value={eventData.start_time} onChange={handleInputChange} className="h-10 rounded-lg shadow-none text-xs" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-bold text-slate-500 uppercase">Selesai</Label>
                                <Input name="end_time" type="datetime-local" value={eventData.end_time} onChange={handleInputChange} className="h-10 rounded-lg shadow-none text-xs" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-500 uppercase">Deskripsi</Label>
                            <Textarea name="description" value={eventData.description} onChange={handleInputChange} className="text-sm min-h-25 rounded-lg" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-1 border-none shadow-sm rounded-xl">
                    <CardHeader className="pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-2 text-blue-600">
                            <HugeiconsIcon icon={Ticket01Icon} size={20} />
                            <CardTitle className="text-lg font-bold">Kategori & Brush</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategoryId(cat.id)}
                                    style={{
                                        backgroundColor: activeCategoryId === cat.id ? cat.colors.bg : 'transparent',
                                        borderColor: activeCategoryId === cat.id ? cat.colors.selected : 'transparent',
                                        color: cat.colors.text
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${activeCategoryId !== cat.id ? "bg-slate-50 border-transparent" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colors.selected }} />
                                        <span className="text-xs font-bold">{cat.name}</span>
                                    </div>
                                    <span className="text-[10px] font-medium opacity-60">Rp {cat.price.toLocaleString()}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => setActiveCategoryId("OFF")}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${activeCategoryId === "OFF" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-400 border-transparent"}`}
                            >
                                <HugeiconsIcon icon={Office} size={16} />
                                <span className="text-xs font-bold">MODE OFF (LORONG)</span>
                            </button>
                        </div>
                        <div className="pt-4 border-t space-y-3">
                            <Input name="name" placeholder="Nama Baru" className="h-9 text-xs" value={newCat.name} onChange={handleNewCatChange} />
                            <Input name="price" placeholder="Harga" type="number" className="h-9 text-xs" value={newCat.price} onChange={handleNewCatChange} />
                            <Button onClick={handleAddCategory} className="w-full h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700">Tambah Kategori</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-600">
                                <HugeiconsIcon icon={GridIcon} size={20} />
                                <CardTitle className="text-lg font-bold text-slate-900">Editor Denah Kursi</CardTitle>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-[10px] font-bold text-slate-400">ROWS</Label>
                                    <Input name="max_row_index" type="number" value={eventData.max_row_index} onChange={handleInputChange} className="h-8 w-14 text-center font-bold" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-[10px] font-bold text-slate-400">COLS</Label>
                                    <Input name="max_column_index" type="number" value={eventData.max_column_index} onChange={handleInputChange} className="h-8 w-14 text-center font-bold" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 bg-slate-50/30 overflow-auto">
                            <div className="w-full h-2 bg-gray-200 rounded-full mb-16 relative">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Panggung / Layar</span>
                            </div>
                            <div
                                className="grid gap-2 mx-auto"
                                style={{
                                    gridTemplateColumns: `repeat(${eventData.max_column_index}, minmax(44px, 1fr))`,
                                    width: 'fit-content'
                                }}
                            >
                                {Array.from({ length: eventData.max_row_index }).map((_, rIdx) => {
                                    const r = rIdx + 1;
                                    return Array.from({ length: eventData.max_column_index }).map((_, cIdx) => {
                                        const c = cIdx + 1;
                                        const key = `${r}-${c}`;
                                        const assignedId = seatData[key];
                                        const category = categories.find(cat => cat.id === assignedId);
                                        const isOff = assignedId === "OFF";
                                        const label = getSeatLabel(r, c);

                                        return (
                                            <button
                                                key={key}
                                                onClick={() => handleSeatClick(r, c)}
                                                style={{
                                                    backgroundColor: category ? category.colors.bg : isOff ? undefined : 'white',
                                                    borderColor: category ? category.colors.selected : isOff ? undefined : '#60a5fa', // blue-400
                                                    color: category ? category.colors.text : undefined
                                                }}
                                                className={`
                                                    h-10 w-10 rounded-lg flex items-center justify-center text-[9px] font-black transition-all border
                                                    ${isOff
                                                        ? "bg-slate-200 text-slate-400 border-dashed border-slate-300 opacity-40"
                                                        : category
                                                            ? "shadow-sm scale-105"
                                                            : "text-slate-300 hover:border-blue-300"}
                                                `}
                                            >
                                                {label}
                                            </button>
                                        );
                                    });
                                })}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <Button className="bg-[#002558] hover:bg-black h-12 px-10 rounded-xl font-bold gap-2 shadow-lg transition-all active:scale-95">
                                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                                    Buat Event
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}