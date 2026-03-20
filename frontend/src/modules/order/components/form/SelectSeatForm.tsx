import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Select } from "@/components/ui/select";
import { UserIcon, Mail, Phone } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { BookingFormData } from "@/modules/event/schema/createAttendee.schema";
import { useSession } from "next-auth/react";

interface Props {
    selectedSeats: {
        id: number;
        seat_number: string;
    }[];
    form: UseFormReturn<BookingFormData>;
}

export default function SelectSeatForm({ selectedSeats, form }: Props) {
    const { data } = useSession();
    const handleCheckedChange = (checked: boolean) => {
        if (checked) {
            if (data && data.user) {
                form.setValue(`attendees.0.name`, data.user.name || "");
                form.setValue(`attendees.0.email`, data.user.email || "");
            }
        } else {
            form.setValue(`attendees.0.name`, "");
            form.setValue(`attendees.0.email`, "");
        }
    }
    return (
        <FormProviderWrapper form={form}>
            <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-[#002558] tracking-tight">Informasi Peserta</h2>
                {selectedSeats.map((seat, index) => (
                    <div key={seat.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <span className="font-black text-[#002558] text-lg">Kursi {seat.seat_number}</span>
                            </div>
                            {index === 0 && (
                                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl">
                                    <Checkbox
                                        id={`use-my-data-${seat.id}`}
                                        onCheckedChange={handleCheckedChange}
                                    />
                                    <Label htmlFor={`use-my-data-${seat.id}`} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                                        Gunakan Data Pribadi
                                    </Label>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</Label>
                                <div className="relative">
                                    <Input
                                        className="h-12 pl-10 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-600" placeholder="Sesuai KTP"
                                        withValidation
                                        name={`attendees.${index}.name`}
                                    />
                                    <HugeiconsIcon icon={UserIcon} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</Label>
                                <div className="relative">
                                    <Input
                                        className="h-12 pl-10 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-600" placeholder="email@contoh.com"
                                        withValidation
                                        name={`attendees.${index}.email`}
                                    />
                                    <HugeiconsIcon icon={Mail} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor WhatsApp</Label>
                                <div className="relative">
                                    <Input
                                        className="h-12 pl-10 bg-gray-50 rounded-xl focus-visible:ring-1 focus-visible:ring-blue-600" placeholder="0812xxxx"
                                        withValidation
                                        name={`attendees.${index}.phone`}
                                    />
                                    <HugeiconsIcon icon={Phone} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jenis Kelamin</Label>
                                <div className="relative">
                                    <Select
                                        withValidation
                                        name={`attendees.${index}.isMale`}
                                    >
                                        <SelectTrigger className="w-45 border-blue-600 ring-blue-600">
                                            <SelectValue placeholder="Jenis Kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="laki-laki">Laki-Laki</SelectItem>
                                                <SelectItem value="perempuan">Perempuan</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <HugeiconsIcon icon={UserIcon} size={18} className="absolute left-3 top-3.5 text-gray-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </form>
        </FormProviderWrapper>
    )
}