"use client"

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Settings02Icon as SettingsIcon,
    Moon02Icon as DarkModeIcon,
    Notification03Icon as NotificationIcon,
    CheckmarkCircle02Icon as SaveIcon,
    Mail01Icon as MailIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ChangePreferencesPage() {
    return (
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="px-20 pt-12 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-blue-600">
                        <HugeiconsIcon icon={SettingsIcon} size={28} />
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Preferensi Aplikasi</h2>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold gap-3 px-8 shadow-md transition-all active:scale-95 text-base">
                        <HugeiconsIcon icon={SaveIcon} size={20} />
                        Simpan Perubahan
                    </Button>
                </div>
            </CardHeader>

            {/* REVISI: Padding px-20 diterapkan di sini */}
            <CardContent className="px-20 pb-12 space-y-6">

                {[
                    {
                        title: "Mode Gelap (Dark Mode)",
                        desc: "Optimalkan kenyamanan visual saat kondisi cahaya rendah.",
                        icon: DarkModeIcon,
                        color: "text-slate-900",
                        activeColor: "data-[state=checked]:bg-blue-600"
                    },
                    {
                        title: "Notifikasi Real-time",
                        desc: "Dapatkan info instan saat tiket Anda terjual atau event dimulai.",
                        icon: NotificationIcon,
                        color: "text-orange-500",
                        activeColor: "data-[state=checked]:bg-orange-500",
                        checked: true
                    },
                    {
                        title: "Newsletter & Promosi",
                        desc: "Terima email kurasi event eksklusif langsung ke inbox Anda.",
                        icon: MailIcon,
                        color: "text-emerald-600",
                        activeColor: "data-[state=checked]:bg-emerald-600",
                        checked: true
                    },
                ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:border-blue-50">
                        <div className="flex items-center gap-8">
                            <div className={`h-16 w-16 bg-white rounded-2xl flex items-center justify-center ${pref.color} shadow-sm border border-slate-50`}>
                                <HugeiconsIcon icon={pref.icon} size={28} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-slate-900 tracking-tight">{pref.title}</p>
                                <p className="text-base text-slate-500 font-bold">{pref.desc}</p>
                            </div>
                        </div>
                        <Switch defaultChecked={pref.checked} className={`scale-125 ${pref.activeColor}`} />
                    </div>
                ))}

            </CardContent>
        </Card>
    );
}