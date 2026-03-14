"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, ArrowLeft01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/modules/auth/schema/forgot-password.schema";
import { useForgotPassword } from "@/modules/auth/hooks/useAuthRepository";
import { useRouter } from "next/navigation";

export default function Page() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { mutateAsync: forgotPassword, isSuccess, isPending } = useForgotPassword({});
    const router = useRouter();

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        await forgotPassword(data);
        setIsSubmitted(true);
        if (isSuccess) {
            form.reset();
            router.push("/auth/login");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                <div>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <HugeiconsIcon icon={Tick02Icon} size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-[#002558] uppercase tracking-tighter">Cek Email Kamu</h2>
                        <p className="text-slate-500 font-medium">
                            Jika email tersebut terdaftar, kami telah mengirimkan instruksi pemulihan kata sandi ke
                            <span className="text-[#002558] font-bold block">{form.getValues("email")}</span>
                        </p>
                    </div>
                    <Link href="/login" className="block">
                        <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-200 font-bold text-slate-600">
                            Kembali ke Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full space-y-4">
                <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#002558] transition-colors font-bold text-sm group">
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Login
                </Link>

                <Card className="ring-transparent rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader>
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <HugeiconsIcon icon={Mail01Icon} size={28} />
                        </div>
                        <CardTitle className="text-3xl font-black text-[#002558] tracking-tighter uppercase">Lupa Sandi?</CardTitle>
                        <p className="text-slate-400 font-bold text-sm tracking-tight">Tenang, masukkan email kamu di bawah untuk mendapatkan link reset.</p>
                    </CardHeader>

                    <CardContent className="p-10">
                        <FormProviderWrapper form={form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Input
                                    name="email"
                                    label="Email"
                                    placeholder="name@company.com"
                                    withValidation
                                    className="h-14 rounded-2xl focus:bg-white transition-all"
                                />

                                <Button
                                    isLoading={isPending}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-white rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-[0.98] uppercase tracking-wider"
                                >
                                    Kirim Link Reset
                                </Button>
                            </form>
                            <Link href="/auth/login" className="block mt-3 text-center text-sm transition-colors font-bold underline hover:text-blue-500">
                                Kembali ke Login
                            </Link>
                        </FormProviderWrapper>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}