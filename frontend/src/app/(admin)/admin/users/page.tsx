"use client"

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Search01Icon as SearchIcon,
    Mail01Icon as MailIcon,
    UserGroupIcon as RoleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// --- DUMMY DATA USERS ---
const initialUsers = [
    { id: 1, name: "Redo", email: "redo@student.ub.ac.id", role: "ADMIN", joinedAt: "12 Jan 2026", status: true },
    { id: 2, name: "Ahmad Jaelani", email: "jaelani@gmail.com", role: "ORGANIZER", joinedAt: "05 Feb 2026", status: true },
    { id: 3, name: "Siti Sarah", email: "sarah.siti@outlook.com", role: "USER", joinedAt: "20 Feb 2026", status: false },
    { id: 4, name: "Budi Santoso", email: "budi.san@yahoo.com", role: "USER", joinedAt: "01 Mar 2026", status: true },
    { id: 5, name: "Diana Putri", email: "diana.p@gmail.com", role: "USER", joinedAt: "08 Mar 2026", status: true },
];

export default function Page() {
    const [users, setUsers] = useState(initialUsers);

    const toggleStatus = (id: number) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, status: !user.status } : user
        ));
    };

    return (
        <div className="space-y-8 p-2 font-sans">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manajemen User</h1>
                    <p className="text-base text-slate-500 mt-2 font-medium">Kelola hak akses, status akun, dan data pendaftar platform Anda.</p>
                </div>
            </div>

            {/* --- CONTROLS --- */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-112.5">
                    <HugeiconsIcon icon={SearchIcon} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Cari user berdasarkan nama atau email..."
                        className="h-12 pl-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-base text-slate-500 font-bold whitespace-nowrap">Tampilkan:</span>
                    <Select defaultValue="10">
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

            {/* --- TABLE --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/80">
                        <TableRow className="hover:bg-transparent h-16">
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-8">User & Kontak</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-6">Role</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Tanggal Bergabung</TableHead>
                            <TableHead className="font-bold text-slate-700 text-sm uppercase px-6 text-center">Status Akun</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
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
                                        <span className={`text-sm font-bold ${user.role === 'ADMIN' ? 'text-blue-600' : 'text-slate-600'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 text-center text-base text-slate-500 font-semibold">{user.joinedAt}</TableCell>
                                <TableCell className="px-6">
                                    <div className="flex flex-col items-center gap-3">
                                        <Badge className={`rounded-lg font-bold text-xs uppercase px-3 py-1 shadow-none border-none ${user.status ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {user.status ? "Aktif" : "Diblokir"}
                                        </Badge>
                                        {
                                            user.role !== "ADMIN" && (
                                                <Switch
                                                    checked={user.status}
                                                    onCheckedChange={() => toggleStatus(user.id)}
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
            </div>

            {/* --- PAGINATION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-6">
                <p className="text-base text-slate-500 font-bold">Menampilkan 1 - 5 dari 1,240 user</p>
                <Pagination className="justify-end w-auto mx-0">
                    <PaginationContent className="gap-2">
                        <PaginationItem>
                            <PaginationPrevious href="#" className="rounded-xl border-slate-200 h-11 px-5 text-base font-bold hover:bg-slate-50 transition-colors" />
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
                            <PaginationNext href="#" className="rounded-xl border-slate-200 h-11 px-5 text-base font-bold hover:bg-slate-50 transition-colors" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}