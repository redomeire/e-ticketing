import z from "zod";

// password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
}).refine((data) => /[A-Z]/.test(data.password), {
    error: "Password must contain at least one uppercase letter",
}).refine((data) => /[a-z]/.test(data.password), {
    error: "Password must contain at least one lowercase letter",
}).refine((data) => /[0-9]/.test(data.password), {
    error: "Password must contain at least one number",
}).refine((data) => /[!@#$%^&*(),.?":{}|<>]/.test(data.password), {
    error: "Password must contain at least one special character",
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export default registerSchema;