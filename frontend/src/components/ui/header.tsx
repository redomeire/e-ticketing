"use client";

import React, { useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search,
    Calendar,
    Compass,
    Menu,
    Close,
    ChevronDown
} from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import Link from 'next/link';

const Header = () => {
    const [is_search_open, set_is_search_open] = useState(false);

    const nav_links = [
        { name: 'Buat Event', icon: Calendar, href: '#' },
        { name: 'Jelajah Event', icon: Compass, href: '#' },
    ];

    return (
        <header className="w-full bg-[#002558] text-white sticky top-0 z-50">
            <div className="border-b border-white/10 hidden md:block">
                <div className="container mx-auto flex h-12 items-center justify-end gap-6 px-4 text-sm font-medium opacity-90">
                    <a href="#" className="hover:text-blue-300 transition-colors">Mulai Jadi Event Creator</a>
                    <a href="#" className="hover:text-blue-300 transition-colors">Biaya</a>
                    <a href="#" className="hover:text-blue-300 transition-colors">Blog</a>
                    <a href="#" className="hover:text-blue-300 transition-colors">LOKET X</a>
                    <a href="#" className="text-blue-400 font-bold border-l border-white/20 pl-5">LOKET Screen</a>
                    <a href="#" className="hover:text-blue-300 transition-colors">Pusat Bantuan</a>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-blue-300">
                        ID <HugeiconsIcon icon={ChevronDown} size={14} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto flex h-20 items-center justify-between gap-6 px-4">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">LOKET</h1>
                    <span className="bg-blue-600 px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                        12 Tahun
                    </span>
                </Link>
                <div className="relative flex-1 max-w-2xl group hidden md:flex">
                    <Input
                        placeholder="Cari event seru di sini"
                        className="bg-white/10 border-none text-white placeholder:text-white/50 h-12 text-base pl-5 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-l-none"
                    >
                        <HugeiconsIcon icon={Search} size={20} />
                    </Button>
                </div>
                <nav className="hidden xl:flex items-center gap-4">
                    {nav_links.map((link) => (
                        <Button key={link.name} variant="ghost" className="text-white hover:bg-white/10 gap-2 text-sm font-semibold">
                            <HugeiconsIcon icon={link.icon} size={18} /> {link.name}
                        </Button>
                    ))}

                    <div className="flex items-center gap-3 ml-2">
                        <Link href="/auth/register">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white h-11 px-6 text-sm font-bold">
                                Daftar
                            </Button>
                        </Link>
                        <Link href="/auth/login">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 text-sm font-bold shadow-lg">
                                Masuk
                            </Button>
                        </Link>
                    </div>
                </nav>
                <div className="flex xl:hidden items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white md:hidden"
                        onClick={() => set_is_search_open(!is_search_open)}
                    >
                        <HugeiconsIcon icon={is_search_open ? Close : Search} size={24} />
                    </Button>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                <HugeiconsIcon icon={Menu} size={28} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#002558] border-white/10 text-white p-0 w-[85%]">
                            <SheetHeader className="p-8 border-b border-white/10">
                                <SheetTitle className="text-left text-2xl font-black italic text-white uppercase">
                                    LOKET
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col p-8 gap-8">
                                <div className="flex flex-col gap-6">
                                    {nav_links.map((link) => (
                                        <a key={link.name} href={link.href} className="flex items-center gap-4 text-xl font-bold hover:text-blue-300">
                                            <HugeiconsIcon icon={link.icon} size={24} className="text-blue-400" />
                                            {link.name}
                                        </a>
                                    ))}
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                <div className="flex flex-col gap-4">
                                    <Link href="/auth/login">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold">
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button variant="outline" className="w-full border-white text-white h-14 text-lg">
                                            Daftar
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className={cn(
                "md:hidden bg-[#001b41] border-b border-white/10 px-4 transition-all duration-300 overflow-hidden",
                is_search_open ? "h-20 py-4" : "h-0 py-0 border-none"
            )}>
                <div className="relative">
                    <Input
                        autoFocus
                        placeholder="Cari event..."
                        className="bg-white/10 border-white/20 text-white h-12 text-base pr-12"
                    />
                    <div className="absolute right-4 top-3.5 text-white/50">
                        <HugeiconsIcon icon={Search} size={20} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto pb-5 px-4 flex gap-6 text-xs text-white/50 font-medium overflow-x-auto no-scrollbar">
                {['#Promo_Indodana', '#LOKETPlus', '#LOKETScreen', '#LOKET_Promo', '#Loket'].map((tag) => (
                    <span key={tag} className="hover:text-white cursor-pointer transition-colors whitespace-nowrap italic">
                        {tag}
                    </span>
                ))}
            </div>
        </header>
    );
};

export default Header;