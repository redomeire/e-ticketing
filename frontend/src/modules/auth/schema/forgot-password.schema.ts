import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.email("Format email tidak valid").min(1, "Email wajib diisi"),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;