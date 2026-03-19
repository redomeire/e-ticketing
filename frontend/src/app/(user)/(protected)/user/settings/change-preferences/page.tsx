"use client"

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Settings02Icon as SettingsIcon,
    Moon02Icon as DarkModeIcon,
    Notification03Icon as NotificationIcon,
    Mail01Icon as MailIcon,
    InformationCircleIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ChangePreferencesPage() {
    const preferences = [
        {
            title: "Mode Gelap (Dark Mode)",
            desc: "Optimalkan kenyamanan visual saat kondisi cahaya rendah.",
            icon: DarkModeIcon,
            color: "text-slate-900",
            bg: "bg-slate-100",
            activeColor: "data-[state=checked]:bg-slate-900"
        },
        {
            title: "Notifikasi Real-time",
            desc: "Dapatkan info instan saat tiket Anda terjual atau event dimulai.",
            icon: NotificationIcon,
            color: "text-orange-500",
            bg: "bg-orange-50",
            activeColor: "data-[state=checked]:bg-orange-500",
            checked: true
        },
        {
            title: "Newsletter & Promosi",
            desc: "Terima email kurasi event eksklusif langsung ke inbox Anda.",
            icon: MailIcon,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            activeColor: "data-[state=checked]:bg-emerald-600",
            checked: true
        },
    ];

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
            {/* Header Page */}
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-black text-[#002558]">Preferensi Aplikasi</h1>
                <p className="text-slate-500 font-medium">Sesuaikan pengalaman penggunaan platform sesuai keinginanmu.</p>
            </div>

            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-black text-[#002558] uppercase tracking-tight">Kustomisasi & Notifikasi</CardTitle>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <HugeiconsIcon icon={SettingsIcon} size={24} />
                    </div>
                </CardHeader>

                <CardContent className="p-10 pt-6 space-y-6">
                    {preferences.map((pref, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-6 rounded-[2rem] border-2 border-slate-50 bg-slate-50/30 transition-all hover:bg-white hover:border-slate-100"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${pref.bg} ${pref.color} shadow-sm border border-white`}>
                                    <HugeiconsIcon icon={pref.icon} size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-lg font-black text-[#002558] tracking-tight">{pref.title}</p>
                                    <p className="text-sm text-slate-500 font-bold max-w-70 leading-tight">{pref.desc}</p>
                                </div>
                            </div>

                            <div className="pr-2">
                                <Switch
                                    defaultChecked={pref.checked}
                                    className={`scale-110 ${pref.activeColor}`}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Info Box - Konsisten dengan Profile Page */}
            <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <HugeiconsIcon icon={InformationCircleIcon} size={24} className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                    Pengaturan ini disimpan secara lokal dan tersinkronisasi dengan akun utamamu. Perubahan pada notifikasi email mungkin membutuhkan waktu beberapa menit untuk aktif.
                </p>
            </div>
        </div>
    );
}