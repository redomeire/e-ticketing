"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    PencilEdit02Icon as EditIcon,
    Camera01Icon as CameraIcon,
    SmartPhone01Icon as PhoneIcon,
    Calendar03Icon as CalendarIcon,
    GlobalIcon,
    InformationCircleIcon,
    UserCircleIcon,
    Tick02Icon as SaveIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

export default function LinkedInProfilePage() {
    const [profile, setProfile] = useState({
        name: "Redo Admin",
        headline: "Software Developer | Final Year IT Student at Universitas Brawijaya",
        location: "Malang, Jawa Timur, Indonesia",
        phone: "+62 812 3456 7890",
        website: "https://happymusic.com/redo",
        is_male: true,
        date_of_birth: "2002-08-23",
        bio: "Fokus pada optimasi performa aplikasi web menggunakan teknik in-memory caching. Sedang mengembangkan sistem royalti berbasis NFT dan solusi pelacakan keuangan."
    });

    return (
        <>
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                <div className="relative h-60 bg-linear-to-r from-[#002558] to-slate-800">
                    <button className="absolute top-6 right-8 h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#002558] shadow-lg">
                        <HugeiconsIcon icon={CameraIcon} size={20} />
                    </button>
                </div>

                <div className="px-10 pb-10">
                    <div className="relative flex justify-between items-end -mt-20 mb-6">
                        <div className="h-44 w-44 rounded-full border-[6px] border-white overflow-hidden bg-white shadow-xl">
                            <Image
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Redo"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                                fill
                            />
                        </div>
                        {/* REVISI: Button Blue-600 sesuai spesifikasi */}
                        <Button className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold gap-3 px-6 shadow-md transition-all active:scale-95 text-base">
                            <HugeiconsIcon icon={SaveIcon} size={20} />
                            Simpan Perubahan
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                        <p className="text-lg text-slate-700 font-bold leading-snug max-w-3xl">{profile.headline}</p>
                        <p className="text-base text-slate-500 font-bold mt-2">{profile.location} • <span className="text-blue-600 hover:underline cursor-pointer">Informasi kontak</span></p>
                    </div>
                </div>
            </Card>
            <Card className="border-none shadow-sm rounded-[2rem] bg-white p-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-[#002558] tracking-tight">Tentang Saya</h2>
                    <HugeiconsIcon icon={EditIcon} size={24} className="text-slate-300" />
                </div>
                <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="text-lg text-slate-600 font-medium border-none p-0 focus-visible:ring-0 min-h-30 resize-none leading-relaxed"
                />
            </Card>
            <Card className="border-none shadow-sm rounded-[2rem] bg-white p-10">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-black text-[#002558] tracking-tight">Informasi Dasar</h2>
                    <HugeiconsIcon icon={InformationCircleIcon} size={24} className="text-slate-300" />
                </div>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Username / Name Input */}
                    <div className="space-y-3">
                        <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Username Identitas</Label>
                        <Input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                            startIcon={<HugeiconsIcon icon={UserCircleIcon} size={20} className="text-slate-400" />}
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-3">
                        <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Nomor Telepon</Label>
                        <Input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                            startIcon={<HugeiconsIcon icon={PhoneIcon} size={20} className="text-slate-400" />}
                        />
                    </div>

                    {/* Website Input */}
                    <div className="space-y-3">
                        <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Website / Portofolio</Label>
                        <Input
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                            startIcon={<HugeiconsIcon icon={GlobalIcon} size={20} className="text-slate-400" />}
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-3">
                        <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Tanggal Lahir</Label>
                        <Input
                            type="date"
                            value={profile.date_of_birth}
                            onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                            className="pl-12 h-12 border-slate-200 focus-visible:ring-blue-600 rounded-xl text-base font-medium shadow-none"
                            startIcon={<HugeiconsIcon icon={CalendarIcon} size={20} className="text-slate-400" />}
                        />
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-black text-[#002558] uppercase tracking-tighter">Jenis Kelamin</Label>
                        <RadioGroup
                            defaultValue={profile.is_male ? "male" : "female"}
                            onValueChange={(v) => setProfile({ ...profile, is_male: v === "male" })}
                            className="flex gap-10 h-12 items-center"
                        >
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="male" id="male" className="h-5 w-5 border-slate-300" />
                                <Label htmlFor="male" className="text-base font-bold text-slate-800">Laki-laki</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RadioGroupItem value="female" id="female" className="h-5 w-5 border-slate-300" />
                                <Label htmlFor="female" className="text-base font-bold text-slate-800">Perempuan</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </Card>
        </>
    );
}