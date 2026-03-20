"use client";

import { FormEvent, useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Search,
    Calendar,
    Menu,
    Close,
    UserIcon,
    Logout,
    ArrowDown01 as ChevronDown,
    Settings02Icon as Settings,
    Clock01Icon
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import Link from 'next/link';
import { useLogout } from '@/modules/auth/hooks/useAuthRepository';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const { mutateAsync: logout } = useLogout({});
    const router = useRouter();

    const isAdmin = session?.user.role === "admin";
    const profileBaseRoute = isAdmin ? "/admin" : "/user";

    const navLinks = [
        { name: 'Buat Event', icon: Calendar, href: '/admin/events/create' }
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            signOut();
        }
    }

    const onSearch = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const value = formData.get("search")?.toString() || "";

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("search", value);
        router.push(`/?${searchParams.toString()}`);
    }

    return (
        <header className="w-full bg-[#002558] text-white sticky top-0 z-50">
            <div className="border-b border-white/10 hidden md:block">
                <div className="container mx-auto flex h-12 items-center justify-end gap-6 px-4 text-sm font-medium opacity-90">
                    <Link href="#" className="hover:text-blue-300 transition-colors">Mulai Jadi Event Creator</Link>
                    <Link href="#" className="hover:text-blue-300 transition-colors">Biaya</Link>
                    <Link href="#" className="hover:text-blue-300 transition-colors">Blog</Link>
                    <Link href="#" className="hover:text-blue-300 transition-colors">LOKET X</Link>
                    <Link href="#" className="text-blue-400 font-bold border-l border-white/20 pl-5">LOKET Screen</Link>
                    <Link href="#" className="hover:text-blue-300 transition-colors">Pusat Bantuan</Link>
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

                <form onSubmit={onSearch} className="relative flex-1 max-w-2xl group hidden md:flex">
                    <Input
                        name="search"
                        placeholder="Cari event seru di sini"
                        className="bg-white/10 border-none text-white placeholder:text-white/50 h-12 text-base pl-5 focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                    <Button
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-l-none"
                    >
                        <HugeiconsIcon icon={Search} size={20} />
                    </Button>
                </form>

                <nav className="hidden xl:flex items-center gap-4">
                    {isAdmin ?
                        navLinks.map((link) => (
                            <Link key={link.name} href={link.href}>
                                <Button variant="ghost" className="text-white hover:bg-white/10 gap-2 text-sm font-semibold">
                                    <HugeiconsIcon icon={link.icon} size={18} /> {link.name}
                                </Button>
                            </Link>
                        ))
                        :
                        <div className="w-50"></div>
                    }

                    <div className="flex items-center gap-3 ml-2">
                        {isLoading ? (
                            <div className="w-20 h-11 bg-white/10 animate-pulse rounded-lg" />
                        ) : isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 text-sm font-bold shadow-lg gap-2 ring-offset-[#002558] focus-visible:ring-blue-500">
                                        <HugeiconsIcon icon={UserIcon} size={18} />
                                        <span>Profil</span>
                                        <HugeiconsIcon icon={ChevronDown} size={14} className="opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2 rounded-xl" align="end">
                                    <DropdownMenuLabel className="flex flex-col gap-1 p-3">
                                        <p className="text-sm font-bold leading-none">{isAdmin ? "Administrator" : session?.user.name}</p>
                                        <p className="text-xs font-medium leading-none text-muted-foreground">{session?.user.email}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {!isAdmin ? (
                                        <>
                                            <Link href="/order/history">
                                                <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 font-bold">
                                                    <HugeiconsIcon icon={Clock01Icon} size={18} />
                                                    <span>Riwayat Pemesanan</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href={`${profileBaseRoute}/profile`}>
                                                <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 font-bold">
                                                    <HugeiconsIcon icon={UserIcon} size={18} />
                                                    <span>Profil {isAdmin ? "Admin" : "Saya"}</span>
                                                </DropdownMenuItem>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/admin">
                                                <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 font-bold">
                                                    <HugeiconsIcon icon={UserIcon} size={18} />
                                                    <span>Dashboard</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href={`${profileBaseRoute}/settings`}>
                                                <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 font-bold">
                                                    <HugeiconsIcon icon={Settings} size={18} />
                                                    <span>Pengaturan</span>
                                                </DropdownMenuItem>
                                            </Link>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer gap-2 py-2.5 text-red-600 font-bold focus:text-red-600 focus:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <HugeiconsIcon icon={Logout} size={18} />
                                        <span>Keluar</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </nav>
                <div className="flex xl:hidden items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white md:hidden"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <HugeiconsIcon icon={isSearchOpen ? Close : Search} size={24} />
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
                                    {isAdmin && navLinks.map((link) => (
                                        <Link key={link.name} href={link.href} className="flex items-center gap-4 text-xl font-bold hover:text-blue-300">
                                            <HugeiconsIcon icon={link.icon} size={24} className="text-blue-400" />
                                            {link.name}
                                        </Link>
                                    ))}
                                    {isAuthenticated && (
                                        <>
                                            <Link href={`${profileBaseRoute}/profile`} className="flex items-center gap-4 text-xl font-bold hover:text-blue-300">
                                                <HugeiconsIcon icon={UserIcon} size={24} className="text-blue-400" />
                                                Profil {isAdmin ? "Admin" : "Saya"}
                                            </Link>
                                            {!isAdmin && (
                                                <Link href="/order/history" className="flex items-center gap-4 text-xl font-bold hover:text-blue-300">
                                                    <HugeiconsIcon icon={Clock01Icon} size={24} className="text-blue-400" />
                                                    Riwayat Pemesanan
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="h-px bg-white/10 w-full" />
                                <Button onClick={handleLogout} variant="outline" className="w-full border-red-500 text-red-500 h-14 text-lg gap-2 font-bold">
                                    <HugeiconsIcon icon={Logout} size={20} /> Keluar
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className={cn(
                "md:hidden bg-[#001b41] border-b border-white/10 px-4 transition-all duration-300 overflow-hidden",
                isSearchOpen ? "h-20 py-4" : "h-0 py-0 border-none"
            )}>
                <div className="relative">
                    <Input
                        name="mobile-search"
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