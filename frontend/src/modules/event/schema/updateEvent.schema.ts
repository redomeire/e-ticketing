import { z } from "zod";

const eventCategorySchema = z.object({
    name: z.string().min(1)
});

const baseEventSchema = z.object({
    name: z.string().min(5, "Nama event minimal 5 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    terms_and_conditions: z.string().min(10, "S&K minimal 10 karakter"),
    start_time: z.string().min(1, "Waktu mulai wajib diisi"),
    end_time: z.string().min(1, "Waktu selesai wajib diisi"),
    cover_image: z.instanceof(File, { error: "File is required" })
        .refine((file) => file.size <= 5000000, "Max file size is 5MB")
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Only .jpg, .png, and .webp formats are supported"
        ),
    location: z.string().min(1, "Lokasi wajib diisi"),
    max_row: z.coerce.number<number>().min(1, "Minimal 1 baris"),
    max_column: z.coerce.number<number>().min(1, "Minimal 1 kolom"),
    event_categories: z.array(eventCategorySchema).optional(),
});

export const updateEventSchema = baseEventSchema.refine((data) => {
    return new Date(data.end_time) > new Date(data.start_time);
}, {
    message: "Waktu selesai harus setelah waktu mulai",
    path: ["end_time"],
});

export type UpdateEventValues = z.infer<typeof baseEventSchema>;