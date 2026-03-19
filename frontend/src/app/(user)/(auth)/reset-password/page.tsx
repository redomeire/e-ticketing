"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, ChampionIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { resetPasswordSchema, ResetPasswordValues } from "@/modules/auth/schema/reset-password.schema";
import { useResetPassword } from "@/modules/auth/hooks/useAuthRepository";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: email,
            token: token,
            password: "",
            password_confirmation: "",
        },
    });

    const { mutateAsync: resetPassword, isPending } = useResetPassword({});

    const onSubmit = async (data: ResetPasswordValues) => {
        try {
            const result = await resetPassword(data);
            if (result.success) {
                router.push("/auth/login?reset=success");
            }
        } catch (error) {
            console.error("Gagal reset password:", error);
        }
    };

    if (!token || !email) {
        return (
            <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] p-10 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                    <HugeiconsIcon icon={AlertCircleIcon} size={32} />
                </div>
                <h2 className="text-xl font-black text-[#002558] uppercase">Link Tidak Valid</h2>
                <p className="text-slate-500 text-sm font-medium">Link reset password ini sudah tidak berlaku atau tidak lengkap. Silakan minta link baru.</p>
                <Button onClick={() => router.push("/forgot-password")} className="w-full h-12 rounded-2xl bg-slate-900 text-white font-bold">
                    Minta Link Baru
                </Button>
            </Card>
        );
    }

    return (
        <div className="max-w-md w-full">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
                <CardHeader className="p-10 pb-0">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <HugeiconsIcon icon={LockPasswordIcon} size={28} />
                    </div>
                    <CardTitle className="text-3xl font-black text-[#002558] tracking-tighter uppercase">Setel Ulang</CardTitle>
                    <p className="text-slate-400 font-bold text-sm tracking-tight">Buat password baru yang kuat untuk akun <span className="text-blue-600">{email}</span></p>
                </CardHeader>

                <CardContent className="p-10">
                    <FormProviderWrapper form={form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <input type="hidden" {...form.register("email")} />
                            <input type="hidden" {...form.register("token")} />

                            <Input
                                name="password"
                                type="password"
                                label="PASSWORD BARU"
                                placeholder="••••••••"
                                withValidation
                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50"
                            />

                            <Input
                                name="password_confirmation"
                                type="password"
                                label="KONFIRMASI PASSWORD"
                                placeholder="••••••••"
                                withValidation
                                className="h-14 rounded-2xl border-slate-100 bg-slate-50/50"
                            />

                            <Button
                                isLoading={isPending}
                                type="submit"
                                className="w-full bg-[#002558] hover:bg-slate-800 h-14 text-white rounded-2xl font-black shadow-lg transition-all active:scale-[0.98] uppercase tracking-wider gap-2"
                            >
                                <HugeiconsIcon icon={ChampionIcon} size={20} />
                                Update Password
                            </Button>
                        </form>
                    </FormProviderWrapper>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <Suspense fallback={<div className="font-black text-[#002558] animate-pulse uppercase">Memuat Sesi...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}