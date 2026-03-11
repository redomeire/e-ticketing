"use client";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { name: "Profil Biodata", href: "/user/profile" },
    { name: "Preferensi Akun", href: "/user/settings/change-preferences" },
    { name: "Ubah Kata Sandi", href: "/user/settings/change-password" },
];

export default function UserAside() {
    const pathname = usePathname();
    return (
        <aside className="lg:col-span-1 space-y-4">
            <Card className="border-none shadow-sm rounded-[2rem] bg-white p-8">
                <nav className="flex flex-col gap-5">
                    {sidebarItems.map((item) => (
                        <Link key={item.name} href={item.href}>
                            <button
                                key={item.name}
                                className={`w-full text-left p-5 rounded-xl text-sm font-black uppercase tracking-wider border border-transparent hover:border-blue-500 transition-all ${pathname === item.href
                                    ? "bg-[#002558] text-white shadow-lg shadow-blue-100"
                                    : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                {item.name}
                            </button>
                        </Link>
                    ))}
                </nav>
            </Card>
        </aside>
    )
}