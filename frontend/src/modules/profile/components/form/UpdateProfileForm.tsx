"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    UserCircleIcon,
    PhoneOffIcon,
    CalendarIcon,
    Male02Icon,
    Female02Icon,
    SaveIcon,
    InformationCircleIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IProfile } from "../../types/profile";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileFormData, updateProfileSchema } from "../../schema/updateProfile.schema";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { useUpdateProfile } from "../../hooks/useProfileRepository";

interface Props {
    profile: IProfile;
}

export default function UpdateProfileForm({ profile }: Props) {
    const form = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            phone: profile.phone || "",
            date_of_birth: profile.date_of_birth || "",
            is_male: profile.is_male ? "true" : "false"
        }
    })

    const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile({});

    const handleSubmit = async (data: UpdateProfileFormData) => {
        await updateProfile({
            ...data,
            is_male: data.is_male === "true"
        });
    };

    const selectedGender = useWatch({
        control: form.control,
        name: "is_male",
    });

    return (
        <FormProviderWrapper form={form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-8">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-xl font-black text-[#002558] uppercase tracking-tight">Informasi Dasar</CardTitle>
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <HugeiconsIcon icon={UserCircleIcon} size={24} />
                        </div>
                    </CardHeader>

                    <CardContent className="p-10 pt-6 space-y-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-[#002558] uppercase tracking-widest ml-1">Nomor Telepon</Label>
                            <div className="relative">
                                <Input
                                    name="phone"
                                    placeholder="+62 8..."
                                    withValidation
                                    startIcon={<HugeiconsIcon icon={PhoneOffIcon} size={20} />}
                                    className="pl-12 h-14 border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-blue-600 rounded-2xl text-base font-bold transition-all shadow-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-[#002558] uppercase tracking-widest ml-1">Tanggal Lahir</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    name="date_of_birth"
                                    withValidation
                                    startIcon={<HugeiconsIcon icon={CalendarIcon} size={20} />}
                                    className="pl-12 h-14 border-slate-100 bg-slate-50/50 focus-visible:bg-white focus-visible:ring-blue-600 rounded-2xl text-base font-bold transition-all shadow-none"
                                />
                            </div>
                        </div>

                        {/* Input Gender (Radio Group) */}
                        <div className="space-y-4">
                            <Label className="text-xs font-black text-[#002558] uppercase tracking-widest ml-1">Jenis Kelamin</Label>
                            <RadioGroup
                                name="is_male"
                                withValidation
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {/* Opsi Laki-laki */}
                                <label
                                    htmlFor="option-male"
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedGender === "true"
                                        ? 'border-blue-600 bg-blue-50/30'
                                        : 'border-slate-100 bg-white hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${selectedGender === "true" ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            <HugeiconsIcon icon={Male02Icon} size={20} />
                                        </div>
                                        <span className="font-bold text-[#002558]">Laki-laki</span>
                                    </div>
                                    <RadioGroupItem value="true" id="option-male" className="h-5 w-5" />
                                </label>

                                <label
                                    htmlFor="option-female"
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedGender === "false"
                                        ? 'border-blue-600 bg-blue-50/30'
                                        : 'border-slate-100 bg-white hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${selectedGender === "false" ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            <HugeiconsIcon icon={Female02Icon} size={20} />
                                        </div>
                                        <span className="font-bold text-[#002558]">Perempuan</span>
                                    </div>
                                    <RadioGroupItem value="false" id="option-female" className="h-5 w-5" />
                                </label>
                            </RadioGroup>
                        </div>
                    </CardContent>

                    <div className="p-10 pt-0">
                        <Button
                            type="submit"
                            isLoading={isUpdating}
                            className="w-full bg-blue-600 hover:bg-blue-700 h-16 text-white rounded-[1.5rem] font-black gap-3 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] uppercase tracking-widest"
                        >
                            <HugeiconsIcon icon={SaveIcon} size={20} />
                            Simpan Perubahan Profil
                        </Button>
                    </div>
                </Card>

                <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <HugeiconsIcon icon={InformationCircleIcon} size={24} className="text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        Data profil ini bersifat privat dan hanya digunakan untuk keperluan administrasi internal.
                    </p>
                </div>
            </form>
        </FormProviderWrapper>
    )
}