import { z } from "zod";

export const resetPasswordSchema = z.object({
    email: z.email(),
    token: z.string().min(1, "Token tidak valid"),
    password: z.string()
        .min(8, "Password minimal 8 karakter")
        .regex(/[A-Z]/, "Password harus mengandung minimal satu huruf kapital")
        .regex(/[0-9]/, "Password harus mengandung minimal satu angka"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok",
    path: ["password_confirmation"],
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;