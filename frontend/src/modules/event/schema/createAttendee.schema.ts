import { z } from "zod";

export const attendeeSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.email("Format email salah"),
    phone: z.string().min(10, "Nomor HP minimal 10 digit"),
    isMale: z.enum(["laki-laki", "perempuan"], "Jenis kelamin harus 'Laki-laki' atau 'Perempuan'"),
    seatId: z.number()
});

export const bookingSchema = z.object({
    attendees: z.array(attendeeSchema)
});

export type BookingFormData = z.infer<typeof bookingSchema>;