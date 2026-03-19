"use client"

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search01Icon as SearchIcon,
    Mail01Icon as MailIcon,
    UserGroupIcon as RoleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAdminGetUsers, useAdminToggleUserActive } from "@/modules/user/hooks/useUserRepository";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils/formatDate";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";
import { cn } from "@/lib/utils/cn";

export default function PageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";
    const pageQuery = searchParams.get("page") || "1";
    const limitQuery = searchParams.get("limit") || "10";

    const { data: users, isPending, isError, error } = useAdminGetUsers({
        options: {
            params: {
                page: parseInt(pageQuery, 10),
                limit: parseInt(limitQuery, 10),
                search: searchQuery,
            }
        }
    }, {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    const { mutateAsync } = useAdminToggleUserActive({})

    const toggleStatus = async (id: number, isActive: boolean) => {
        await mutateAsync({
            id,
            is_active: !isActive
        })
    };

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
        <div className="space-y-8 p-2 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen User</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium">Kelola hak akses, status akun, dan data pendaftar platform Anda.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <form onSubmit={handleSearchSubmit} className="relative w-full md:w-112.5">
                    <HugeiconsIcon icon={SearchIcon} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        name="search"
                        placeholder="Cari user berdasarkan nama atau email..."
                        className="h-12 pl-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                    />
                </form>
                <div className="flex items-center gap-4">
                    <span className="text-base text-slate-500 font-bold whitespace-nowrap">Tampilkan:</span>
                    <Select
                        defaultValue="10"
                        onValueChange={(val) => {
                            setParams({ limit: val })
                        }}
                    >
                        <SelectTrigger className="w-24 h-12 border-slate-200 rounded-xl text-base font-bold">
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
                    isError={isError}
                    error={error as unknown as Error}
                    data={users?.data.data}
                >
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-transparent h-16">
                                <TableHead className="font-bold text-slate-700 text-sm uppercase px-8">User & Kontak</TableHead>
                                <TableHead className="font-bold text-slate-700 text-sm uppercase px-6">Role</TableHead>
                                <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Tanggal Dibuat</TableHead>
                                <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Status Akun</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.data.data.map((user) => (
                                <TableRow key={user.id} className="hover:bg-slate-50/40 transition-colors border-slate-50 h-20">
                                    <TableCell className="px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
                                                {user.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-base tracking-tight">{user.name}</span>
                                                <div className="flex items-center gap-1 text-slate-400">
                                                    <HugeiconsIcon icon={MailIcon} size={14} />
                                                    <span className="text-sm font-semibold">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-2">
                                            <HugeiconsIcon icon={RoleIcon} size={16} className="text-slate-400" />
                                            <span className={`text-sm font-bold ${["admin", "superadmin"].includes(user.role) ? 'text-blue-600' : 'text-slate-600'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 text-center text-base text-slate-500 font-semibold">{formatDate(user.created_at)}</TableCell>
                                    <TableCell className="px-6">
                                        <div className="flex flex-col items-center gap-3">
                                            <Badge className={`rounded-lg font-bold text-xs uppercase px-3 py-1 shadow-none border-none ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {user.is_active ? "Aktif" : "Diblokir"}
                                            </Badge>
                                            {
                                                !["admin", "superadmin"].includes(user.role)
                                                && (
                                                    <Switch
                                                        checked={user.is_active}
                                                        onCheckedChange={() => toggleStatus(user.id, user.is_active)}
                                                        className="data-[state=checked]:bg-emerald-500 scale-110"
                                                    />
                                                )
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </QueryStateHandler>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-6">
                <p className="text-base text-slate-500 font-bold">
                    Menampilkan {users ? users.data.data.length : 0} dari {users ? users.data.total : 0} event
                </p>
                <div>
                    <Pagination className="w-fit">
                        <PaginationContent className="w-fit ">
                            {users?.data.links && users.data.links.length > 0 && users.data.links.map((link, index) => {
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