"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Mengasumsikan wrapper Input dengan startIcon
import { Label } from "@/components/ui/label";
import {
    Shield02Icon as ShieldIcon,
    LockIcon,
    Key01Icon,
    SecurityPasswordIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function ChangePasswordPage() {
    return (
        <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardHeader className="px-20 pt-12 pb-6">
                <div className="flex items-center gap-4 text-[#002558]">
                    <HugeiconsIcon icon={ShieldIcon} size={28} />
                    <h2 className="text-2xl font-black tracking-tight">Perbarui Keamanan Akun</h2>
                </div>
            </CardHeader>

            <CardContent className="px-20 pb-12 space-y-10">
                <div className="max-w-2xl space-y-8">
                    <div className="space-y-3">
                        <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">
                            Kata Sandi Saat Ini
                        </Label>
                        <Input
                            type="password"
                            placeholder="Masukkan kata sandi lama..."
                            className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                            startIcon={<HugeiconsIcon icon={Key01Icon} size={20} className="text-slate-400" />}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">
                                Kata Sandi Baru
                            </Label>
                            <Input
                                type="password"
                                placeholder="Minimal 8 karakter..."
                                className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                                startIcon={<HugeiconsIcon icon={LockIcon} size={20} className="text-slate-400" />}
                            />
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-3">
                            <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">
                                Konfirmasi Kata Sandi
                            </Label>
                            <Input
                                type="password"
                                placeholder="Ulangi kata sandi baru..."
                                className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                                startIcon={<HugeiconsIcon icon={SecurityPasswordIcon} size={20} className="text-slate-400" />}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold gap-3 px-10 shadow-md transition-all active:scale-95 text-base">
                            Update Password
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}