import { z } from "zod";
const seatSchema = z.object({
    row: z.number(),
    column: z.number(),
    number: z.string()
});

const ticketCategorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    base_price: z.string().min(1, "Harga dasar wajib diisi"),
    quota: z.coerce.number<number>().min(1, "Kuota minimal 1"),
    seats: z.array(seatSchema).min(1, "Minimal pilih 1 kursi"),
});

export const updateSeatsSchema = z.object({
    slug: z.string().min(1, "Slug event wajib diisi"),
    ticket_categories: z.array(ticketCategorySchema).min(1),
    max_row: z.coerce.number<number>().min(1, "Minimal 1 baris"),
    max_column: z.coerce.number<number>().min(1, "Minimal 1 kolom"),
});

export type UpdateSeatsValues = z.infer<typeof updateSeatsSchema>;
