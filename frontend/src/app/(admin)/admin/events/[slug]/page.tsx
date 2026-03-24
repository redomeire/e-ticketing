"use client"

import { useParams } from "next/navigation";
import {
    useGetEventDetail,
    useGetEventSeats
} from "@/modules/event/hooks/useEventRepository";
import { QueryStateHandler } from "@/components/query/QueryStateHandler";
import UpdateEventForm from "@/modules/event/components/form/UpdateEventForm";
import UpdateSeatsForm from "@/modules/event/components/form/UpdateSeatsForm";

export default function EventDetailPage() {
    const { slug } = useParams();

    const {
        data: eventResponse,
        isPending: isLoadingData
    } = useGetEventDetail({
        payload: { slug: slug as string }
    }, {
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });

    const {
        data: eventSeatResponse,
        isPending: isLoadingSeat
    } = useGetEventSeats({
        payload: {
            slug: slug as string
        }
    }, {
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });

    const event = eventResponse?.data;
    const seats = eventSeatResponse?.data;

    return (
        <>
            <QueryStateHandler isPending={isLoadingData} data={event}>
                {
                    event && (
                        <UpdateEventForm
                            event={event!}
                        />
                    )
                }
            </QueryStateHandler>
            <QueryStateHandler isPending={isLoadingSeat} data={seats}>
                {
                    seats && seats.seats.length && event && (
                        <UpdateSeatsForm
                            event={event!}
                            isLoadingSeat={isLoadingSeat}
                            seats={seats}
                        />
                    )
                }
            </QueryStateHandler>
        </>
    );
}