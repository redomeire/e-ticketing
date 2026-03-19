"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search01Icon as SearchIcon,
    PlusSignIcon as PlusIcon,
    GridIcon,
    Location01Icon as LocationIcon,
    Edit02Icon as EditIcon,
    Ticket01Icon as CategoryIcon,
    Settings02Icon as ToolIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "@/components/ui/card";

const venueTemplates = [
    { id: 1, name: "Main Hall Universitas Brawijaya", location: "Malang", dimension: "20x30", capacity: 600, status: "Ready" },
    { id: 2, name: "Museum Sri Baduga Theater", location: "Bandung", dimension: "10x10", capacity: 100, status: "Ready" },
    { id: 3, name: "Stadion Gajayana - VIP Section", location: "Malang", dimension: "5x50", capacity: 250, status: "Draft" },
];

const categoryPresets = [
    { id: 1, name: "VIP", defaultPrice: 750000, color: "bg-purple-600", icon: "Star" },
    { id: 2, name: "REGULAR", defaultPrice: 150000, color: "bg-blue-600", icon: "User" },
    { id: 3, name: "EARLY BIRD", defaultPrice: 100000, color: "bg-emerald-600", icon: "Clock" },
];

export default function MasterSeatsPage() {
    return (
        <div className="space-y-8 p-2 font-sans pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Master Data Seats</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium">Kelola standarisasi tempat dan kategori tiket untuk efisiensi pembuatan event.</p>
                </div>
            </div>

            <Tabs defaultValue="venues" className="w-full">
                <TabsList className="bg-slate-100 p-1.5 h-14 rounded-2xl gap-2 w-full md:w-auto mb-8">
                    <TabsTrigger value="venues" className="rounded-xl px-8 h-11 font-bold text-base data-[state=active]:bg-white data-[state=active]:text-blue-600 shadow-none">
                        <HugeiconsIcon icon={GridIcon} size={18} className="mr-2" />
                        Template Venue
                    </TabsTrigger>
                    <TabsTrigger value="presets" className="rounded-xl px-8 h-11 font-bold text-base data-[state=active]:bg-white data-[state=active]:text-blue-600 shadow-none">
                        <HugeiconsIcon icon={CategoryIcon} size={18} className="mr-2" />
                        Preset Kategori
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="venues" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="relative w-full md:w-112.5">
                            <HugeiconsIcon icon={SearchIcon} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Cari template venue..."
                                className="h-12 pl-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium"
                            />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold gap-3 px-6 shadow-md transition-all active:scale-95 text-base">
                            <HugeiconsIcon icon={PlusIcon} size={20} />
                            Buat Template Baru
                        </Button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/80">
                                <TableRow className="hover:bg-transparent h-16">
                                    <TableHead className="font-bold text-slate-700 text-sm uppercase px-8">Nama Venue & Lokasi</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Dimensi</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Kapasitas</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-sm uppercase px-8 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {venueTemplates.map((venue) => (
                                    <TableRow key={venue.id} className="hover:bg-slate-50/40 transition-colors border-slate-50 h-20">
                                        <TableCell className="px-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-slate-900 text-base tracking-tight">{venue.name}</span>
                                                <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-sm">
                                                    <HugeiconsIcon icon={LocationIcon} size={14} />
                                                    {venue.location}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 text-center">
                                            <Badge variant="outline" className="rounded-lg border-slate-200 px-3 py-1 font-bold text-slate-600">
                                                {venue.dimension}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 text-center font-bold text-slate-800 text-base">{venue.capacity} Kursi</TableCell>
                                        <TableCell className="px-8 text-right">
                                            <Button variant="ghost" size="icon" className="h-12 w-12 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                <HugeiconsIcon icon={EditIcon} size={24} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="presets" className="space-y-6">
                    <Card className="border-none shadow-sm rounded-2xl p-8 bg-white">
                        <div className="grid md:grid-cols-3 gap-6">
                            {categoryPresets.map((preset) => (
                                <div key={preset.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-4 group hover:border-blue-200 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className={`h-12 w-12 rounded-xl ${preset.color} flex items-center justify-center text-white shadow-lg`}>
                                            <HugeiconsIcon icon={CategoryIcon} size={24} />
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-300 group-hover:text-slate-600">
                                            <HugeiconsIcon icon={ToolIcon} size={20} />
                                        </Button>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{preset.name}</h3>
                                        <p className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">Default: Rp {preset.defaultPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            <button className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all">
                                <HugeiconsIcon icon={PlusIcon} size={32} />
                                <span className="font-bold text-sm uppercase">Tambah Preset Baru</span>
                            </button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <p className="text-base text-slate-500 font-bold">Menampilkan 1 - 3 dari 12 template</p>
                    <Select defaultValue="10">
                        <SelectTrigger className="w-24 h-11 border-slate-200 rounded-xl text-base font-bold">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="10" className="text-base font-medium">10</SelectItem>
                            <SelectItem value="25" className="text-base font-medium">25</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Pagination className="justify-end w-auto mx-0">
                    <PaginationContent className="gap-2">
                        <PaginationItem>
                            <PaginationPrevious href="#" className="rounded-xl border-slate-200 h-11 px-5 text-base font-bold" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive className="rounded-xl h-11 w-11 bg-blue-600 text-white border-blue-600 text-base font-black">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" className="rounded-xl border-slate-200 h-11 px-5 text-base font-bold" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}