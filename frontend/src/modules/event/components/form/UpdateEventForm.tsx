"use client"

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FormProviderWrapper from "@/components/provider/FormProviderWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateEventSchema, UpdateEventValues } from "@/modules/event/schema/updateEvent.schema";
import SearchInputTag from "@/components/ui/search-input-tag";
import { IEventCategory } from "@/modules/event/types/event";
import {
    useAdminUpdateEvent,
    useAdminCreateEventCategory,
    useGetEventCategories,
} from "@/modules/event/hooks/useEventRepository";
import { IAdminCreateEventCategoryRequest, IGetEventDetailResponse } from "@/modules/event/repositories/event.repository";

interface Props {
    event: IGetEventDetailResponse;
}

// TODO: fix error 
// 1. If you change previously assigned seat to another category, it will create a new seat instead of updating the existing one.

export default function UpdateEventForm({ event }: Props) {
    const router = useRouter();

    const form = useForm<UpdateEventValues>({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            ...event,
            event_categories: event.categories
        }
    });

    const { mutateAsync: updateEvent, isPending: isUpdating } = useAdminUpdateEvent({});

    const onSubmit = async (data: UpdateEventValues) => {
        if (!event && !data.event_categories) return;
        if (!data.event_categories) return;
        const cleanedEventCategories = data.event_categories.filter(ec => ec.name);
        const result = await updateEvent({
            id: event.id,
            ...data,
            event_categories: cleanedEventCategories,
        });
        if (result.success) router.push('/admin/events');
    };
    return (
        <FormProviderWrapper form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 pb-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-[#002558] tracking-tighter uppercase">Update Event</h1>
                            <p className="text-sm text-slate-500 font-bold tracking-tight">{event?.name}</p>
                        </div>
                    </div>
                    <Button isLoading={isUpdating} type="submit" className="bg-blue-600 hover:bg-blue-700 h-12 text-white rounded-xl font-bold px-8 shadow-xl">
                        Simpan Perubahan
                    </Button>
                </div>

                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-10 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Input name="name" label="NAMA EVENT" withValidation className="h-12 rounded-xl" />
                        <Input name="location" label="LOKASI" withValidation className="h-12 rounded-xl" />
                        <Input name="start_time" type="datetime-local" label="MULAI" withValidation className="h-12 rounded-xl" />
                        <Input name="end_time" type="datetime-local" label="SELESAI" withValidation className="h-12 rounded-xl" />
                    </div>
                    <div className="grid gap-8">
                        <Textarea name="description" withValidation label="DESKRIPSI" className="min-h-32 rounded-2xl" />
                        <Textarea name="terms_and_conditions" withValidation label="SYARAT & KETENTUAN" className="min-h-32 rounded-2xl" />
                    </div>
                    <SearchInputTag<IEventCategory, IAdminCreateEventCategoryRequest>
                        name="event_categories"
                        label="TAG KATEGORI"
                        getDisplayValue={(item) => item.name}
                        getValue={(item) => item.id}
                        useQueryHook={useGetEventCategories}
                        useMutationHook={useAdminCreateEventCategory}
                    />
                </Card>
            </form>
        </FormProviderWrapper>
    );
}