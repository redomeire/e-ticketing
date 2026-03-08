"use client";

import { useState } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Mail,
    Lock,
    ViewIcon,
    ViewOffSlashIcon as ViewOff,
    GoogleIcon,
    ArrowLeft02Icon as ArrowLeft
} from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import loginSchema, { LoginFormData } from '@/modules/auth/schema/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import FormProviderWrapper from '@/components/provider/FormProviderWrapper';

export default function Page() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onBlur"
    });

    const handleSubmit = async (data: LoginFormData) => {
        const result = await signIn("credentials", {
            ...data,
            redirect: false
        })
        if (result?.error) {
            console.log("Login failed:", result.error);
            toast.error("Wrong email or password!");
        } else {
            toast.success("Login successful!");
            window.location.reload();
        }
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12 lg:p-20 justify-center relative">
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold transition-colors">
                <HugeiconsIcon icon={ArrowLeft} size={20} />
                <span className="text-sm">Kembali ke Beranda</span>
            </Link>

            <div className="max-w-100 w-full mx-auto">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-[#002558] mb-2 tracking-tight">Selamat Datang</h2>
                    <p className="text-gray-500 font-medium">Silakan masukkan akun Anda untuk melanjutkan.</p>
                </div>
                <FormProviderWrapper form={form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-gray-700">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    withValidation
                                    placeholder="contoh@email.com"
                                    className="h-14 pl-12 bg-gray-50 border-gray-200 focus-visible:ring-blue-600 text-base rounded-xl"
                                    startIcon={<HugeiconsIcon icon={Mail} size={20} />}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password" className="text-sm font-bold text-gray-700">Password</Label>
                                <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Lupa Password?</a>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="password"
                                    withValidation
                                    placeholder="Masukkan password Anda"
                                    className="h-14 pl-12 pr-12 bg-gray-50 border-gray-200 focus-visible:ring-blue-600 text-base rounded-xl"
                                    startIcon={<HugeiconsIcon icon={Lock} size={20} />}
                                    endIcon={
                                        <HugeiconsIcon
                                            icon={isPasswordVisible ? ViewOff : ViewIcon}
                                            size={20}
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        />
                                    }
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            isLoading={form.formState.isSubmitting}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-lg shadow-blue-200 rounded-xl transition-all active:scale-95"
                            disabled={
                                form.formState.isSubmitting
                                || !form.formState.isValid
                            }
                        >
                            Masuk Sekarang
                        </Button>
                    </form>
                </FormProviderWrapper>

                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="px-4 bg-white text-gray-300">Atau masuk dengan</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full h-14 border-gray-200 text-gray-700 font-bold gap-3 hover:bg-gray-50 rounded-xl transition-all active:scale-95"
                >
                    <HugeiconsIcon icon={GoogleIcon} size={20} className="text-red-500" />
                    Masuk dengan Google
                </Button>

                <p className="mt-12 text-center text-sm text-gray-500 font-medium">
                    Belum punya akun? <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">Daftar Sekarang</Link>
                </p>
            </div>
        </div>
    );
}