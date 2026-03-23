"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import DropzoneComponent from "@/components/ui/dropzone";
import RichTextEditor from "@/components/ui/rich-text-editor";

interface Props {
    event: IGetEventDetailResponse;
}

export default function UpdateEventForm({ event }: Props) {
    const router = useRouter();

    const form = useForm<UpdateEventValues>({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            ...event,
            event_categories: event.categories
        }
    });

    const {
        mutateAsync: updateEvent,
        isPending: isUpdating
    } = useAdminUpdateEvent({
        options: {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    });

    const onSubmit = async (data: UpdateEventValues) => {
        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("id", event.id.toString());

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("terms_and_conditions", data.terms_and_conditions);
            formData.append("start_time", data.start_time);
            formData.append("end_time", data.end_time);
            formData.append("location", data.location);
            formData.append("is_active", event.is_active ? "1" : "0");

            if (data.event_categories) {
                formData.append("event_categories", JSON.stringify(data.event_categories));
            }

            if (data.cover_image instanceof File) {
                formData.append("cover_image", data.cover_image);
            }

            const result = await updateEvent(formData);

            if (result.success) {
                router.push('/admin/events');
            }
        } catch (error) {
            console.error("Update failed", error);
        }
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
                    <CardHeader className="pb-4 border-b border-slate-50 px-10 pt-8">
                        <div className="flex items-center gap-2 text-[#002558]">
                            <HugeiconsIcon icon={InformationCircleIcon} size={20} />
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Metadata Event</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <DropzoneComponent
                            name="cover_image"
                            withValidation
                            withPreview
                            cover_image_url={event.cover_image_url}
                            options={{
                                accept: {
                                    "image/svg+xml": [],
                                    "image/png": [],
                                    "image/jpg": [],
                                    "image/gif": [],
                                },
                                maxSize: 3 * 1024 * 1024,
                                multiple: false
                            }}
                        />
                        <div className="grid md:grid-cols-2 gap-8">
                            <Input name="name" label="NAMA EVENT" withValidation className="h-12 rounded-xl" />
                            <Input name="location" label="LOKASI" withValidation className="h-12 rounded-xl" />
                            <Input name="start_time" type="datetime-local" label="MULAI" withValidation className="h-12 rounded-xl" />
                            <Input name="end_time" type="datetime-local" label="SELESAI" withValidation className="h-12 rounded-xl" />
                        </div>
                        <div className="grid gap-8">
                            <RichTextEditor
                                name="description"
                                withValidation
                                label="DESKRIPSI"
                                placeholder="Deskripsikan event kamu secara menarik untuk calon penonton"
                            />
                            <RichTextEditor
                                name="terms_and_conditions"
                                withValidation
                                label="SYARAT & KETENTUAN"
                                placeholder="Deskripsikan event kamu secara menarik untuk calon penonton"
                            />
                        </div>
                        <SearchInputTag<IEventCategory, IAdminCreateEventCategoryRequest>
                            name="event_categories"
                            label="TAG KATEGORI"
                            getDisplayValue={(item) => item.name}
                            getValue={(item) => item.id}
                            useQueryHook={useGetEventCategories}
                            useMutationHook={useAdminCreateEventCategory}
                        />
                    </CardContent>
                </Card>
            </form>
        </FormProviderWrapper>
    );
}