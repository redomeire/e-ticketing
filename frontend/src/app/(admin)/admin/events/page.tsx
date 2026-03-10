"use client"

import React, { useState } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    ViewIcon,
    Search01Icon as SearchIcon,
    PlusSignIcon as PlusIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const initialEvents = [
    { id: 1, name: "Resident Evil 9 Launch", slug: "re-9-launch", date: "12 Okt 2026", status: true, totalSeats: 500 },
    { id: 2, name: "TEDx Bandung 2026", slug: "tedx-bdg-26", date: "20 Nov 2026", status: true, totalSeats: 1200 },
    { id: 3, name: "Happy Music Festival", slug: "happy-music-fest", date: "05 Des 2026", status: false, totalSeats: 2500 },
    { id: 4, name: "Tech Conference UB", slug: "tech-conf-ub", date: "15 Jan 2027", status: true, totalSeats: 300 },
    { id: 5, name: "Web Dev Workshop", slug: "web-dev-ws", date: "10 Feb 2027", status: false, totalSeats: 100 },
];

export default function AdminEventPage() {
    const [events, setEvents] = useState(initialEvents);

    const toggleStatus = (id: number) => {
        setEvents(events.map(event =>
            event.id === id ? { ...event, status: !event.status } : event
        ));
    };

    return (
        <div className="space-y-8 p-2">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen Event</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium">Kelola status dan operasional seluruh event Anda secara terpusat.</p>
                </div>

                <Link href="/admin/events/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold gap-3 px-6 shadow-md transition-all active:scale-95 text-base">
                        <HugeiconsIcon icon={PlusIcon} size={20} />
                        Tambah Event
                    </Button>
                </Link>
            </div>

            {/* --- CONTROLS --- */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-112.5">
                    <HugeiconsIcon icon={SearchIcon} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Cari event berdasarkan nama atau slug..."
                        className="h-12 pl-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-base text-slate-500 font-bold whitespace-nowrap">Tampilkan:</span>
                    <Select defaultValue="10">
                        <SelectTrigger className="w-25 h-12 border-slate-200 rounded-xl text-base font-bold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="10" className="text-base font-medium">10</SelectItem>
                            <SelectItem value="25" className="text-base font-medium">25</SelectItem>
                            <SelectItem value="50" className="text-base font-medium">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/80">
                        <TableRow className="hover:bg-transparent h-16">
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-8">Informasi Event</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-6">Tanggal</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Kapasitas</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Status</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-8 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id} className="hover:bg-slate-50/40 transition-colors border-slate-50 h-20">
                                <TableCell className="px-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-slate-900 text-base tracking-tight">{event.name}</span>
                                        <span className="text-sm text-slate-400 font-semibold tracking-wide">/{event.slug}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 text-base text-slate-600 font-semibold">{event.date}</TableCell>
                                <TableCell className="px-6 text-center font-bold text-slate-800 text-base">{event.totalSeats}</TableCell>
                                <TableCell className="px-6">
                                    <div className="flex flex-col items-center gap-3">
                                        <Badge className={`rounded-lg font-bold text-xs uppercase px-3 py-1 shadow-none border-none ${event.status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {event.status ? "Aktif" : "Non-Aktif"}
                                        </Badge>
                                        <Switch
                                            checked={event.status}
                                            onCheckedChange={() => toggleStatus(event.id)}
                                            className="data-[state=checked]:bg-emerald-500 scale-110"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <Link href={`/admin/events/${event.slug}`}>
                                        <Button variant="ghost" size="icon" className="h-12 w-12 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all">
                                            <HugeiconsIcon icon={ViewIcon} size={24} />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* --- PAGINATION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-6">
                <p className="text-base text-slate-500 font-bold">Menampilkan 1 - 5 dari 24 event</p>
                <Pagination className="justify-end w-auto mx-0">
                    <PaginationContent className="gap-2">
                        <PaginationItem>
                            <PaginationPrevious href="#" className="rounded-xl border-slate-200 h-11 px-5 text-base font-bold hover:bg-slate-50" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive className="rounded-xl h-11 w-11 bg-blue-600 text-white border-blue-600 text-base font-black shadow-lg">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" className="rounded-xl h-11 w-11 border-slate-200 text-base font-bold hover:bg-slate-50">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" className="rounded-xl h-11 w-11 border-slate-200 text-base font-bold hover:bg-slate-50">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis className="text-slate-400" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" className="rounded-xl border-slate-200 h-11 px-5 text-base font-bold hover:bg-slate-50" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}