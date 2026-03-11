"use client"

import { Suspense, useMemo } from "react";
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
import { useAdminGetEvents, useAdminUpdateEvent } from "@/modules/event/hooks/useEventRepository";
import { formatDate } from "@/lib/utils/formatDate";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";

function PageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const pageQuery = searchParams.get("page") || "1";
    const limitQuery = searchParams.get("limit") || "10";

    const {
        data: events,
        error,
        isError,
        isPending
    } = useAdminGetEvents({
        options: {
            params: {
                page: parseInt(pageQuery, 10),
                limit: parseInt(limitQuery, 10),
                search: searchQuery
            }
        }
    }, {
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const { mutateAsync } = useAdminUpdateEvent({})

    const toggleStatus = async (id: number, isActive: boolean) => {
        await mutateAsync({
            id,
            is_active: !isActive
        })
    };

    const capacities = useMemo(() => {
        if (!events) return {};
        const capacityMap: Record<number, number> = {};
        events.data.data.forEach(event => {
            const totalSeats = event.ticket_categories.reduce((sum, category) => sum + category.quota, 0);
            capacityMap[event.id] = totalSeats;
        });
        return capacityMap;
    }, [events])

    const setParams = (param: Record<string, string | number>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set(Object.keys(param)[0], Object.values(param)[0].toString());
        router.push(`?${newParams.toString()}`);
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const searchValue = formData.get("search")?.toString() || "";
        setParams({ search: searchValue });
    }

    return (
        <div className="space-y-8 p-2">
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
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-112.5">
                    <HugeiconsIcon icon={SearchIcon} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        name="search"
                        placeholder="Cari event berdasarkan nama atau slug..."
                        className="h-12 pl-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium"
                    />
                </form>
                <div className="flex items-center gap-4">
                    <span className="text-base text-slate-500 font-bold whitespace-nowrap">Tampilkan:</span>
                    <Select onValueChange={(val) => {
                        setParams({ limit: val });
                    }} defaultValue="10">
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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <QueryStateHandler
                    isPending={isPending}
                    data={events?.data.data}
                    isError={isError}
                    error={error as unknown as Error}
                >
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
                            {events?.data.data.map((event) => (
                                <TableRow key={event.id} className="hover:bg-slate-50/40 transition-colors border-slate-50 h-20">
                                    <TableCell className="px-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-900 text-base tracking-tight">{event.name}</span>
                                            <span className="text-sm text-slate-400 font-semibold tracking-wide">/{event.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-base text-slate-600 font-semibold">{formatDate(event.start_time)}</TableCell>
                                    <TableCell className="px-6 text-center font-bold text-slate-800 text-base">{capacities[event.id]}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col items-center gap-3">
                                            <Badge className={`rounded-lg font-bold text-xs uppercase px-3 py-1 shadow-none border-none ${event.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {event.is_active ? "Aktif" : "Non-Aktif"}
                                            </Badge>
                                            <Switch
                                                checked={event.is_active}
                                                onCheckedChange={() => toggleStatus(event.id, event.is_active)}
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
                </QueryStateHandler>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-6">
                <p className="text-base text-slate-500 font-bold">
                    Menampilkan {events ? events.data.data.length : 0} dari {events ? events.data.total : 0} event
                </p>
                <div>
                    <Pagination className="w-fit">
                        <PaginationContent className="w-fit ">
                            {events?.data.links && events.data.links.length > 0 && events.data.links.map((link, index) => {
                                if (link.label.includes("Previous")) {
                                    return (
                                        <PaginationPrevious key={index} href="#" className="cursor-not-allowed opacity-50 bg-white border-gray-100 rounded-xl" />
                                    )
                                }
                                else if (link.label.includes("Next")) {
                                    return (
                                        <PaginationNext key={index} href="#" className="cursor-not-allowed opacity-50 bg-white border-gray-100 rounded-xl" />
                                    )
                                }
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={`?${new URLSearchParams({
                                                ...Object.fromEntries(searchParams.entries()),
                                                page: link.page ? link.page.toString() : pageQuery
                                            }).toString()}`}
                                            isActive={link.active}
                                            className={cn(
                                                "rounded-xl font-bold transition-all",
                                                link.active ? "bg-blue-600 text-white hover:text-white hover:bg-blue-700 shadow-lg shadow-blue-100" : "bg-white border-gray-100"
                                            )}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            })}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500 text-base">Memuat data event...</p>
            </div>
        }>
            <PageContent />
        </Suspense>
    )
}