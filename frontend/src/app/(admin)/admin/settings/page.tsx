"use client"

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Lock,
    AiImageIcon as LogoIcon,
    CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 p-2 font-sans pb-20 max-w-6xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan</h1>
                <p className="text-base text-slate-500 font-medium">Konfigurasi profil admin, preferensi platform, dan optimasi backend.</p>
            </div>
            <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-8 space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                            <HugeiconsIcon icon={LogoIcon} size={32} />
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline" className="h-10 rounded-lg font-bold text-sm">Ganti Avatar</Button>
                            <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">JPG, PNG atau GIF. Maksimal 2MB.</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700">Nama Lengkap</Label>
                            <Input defaultValue="Redo Admin" className="h-11 rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700">Email Utama</Label>
                            <Input defaultValue="redo@user.com" className="h-11 rounded-xl border-slate-200" />
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <HugeiconsIcon icon={Lock} size={18} className="text-blue-600" />
                            Ubah Kata Sandi
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Input type="password" placeholder="Password Lama" className="h-11 rounded-xl border-slate-200" />
                            <Input type="password" placeholder="Password Baru" className="h-11 rounded-xl border-slate-200" />
                            <Input type="password" placeholder="Konfirmasi Baru" className="h-11 rounded-xl border-slate-200" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-end pt-8 border-t border-slate-100">
                <Button className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 gap-3">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                    Simpan Perubahan
                </Button>
            </div>
        </div>
    );
}