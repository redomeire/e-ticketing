import z from "zod";

export const updateProfileSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits long").max(15, "Phone number must be less than 15 digits long"),
    is_male: z.string().min(1),
    date_of_birth: z.string().refine((date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate) && new Date(parsedDate) < new Date();
    }, "Date of birth must be a valid date in the past"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;