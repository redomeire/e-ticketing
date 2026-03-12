import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import eventRepository, { IAdminCreateEventCategoryRequest, IAdminCreateEventRequest, IAdminGetEventsResponse, IAdminUpdateEventRequest, IAdminUpdateEventResponse, IGetEventDetailRequest, IGetEventDetailResponse, IGetEventSeatsRequest, IGetEventSeatsResponse, IGetEventsResponse } from "../repositories/event.repository";
import { IHttpRequest, IPaginatedData, IHttpResponse } from "@/config/http";
import { IEventCategory } from "../types/event";

export function useGetEvents(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<IGetEventsResponse>>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["events", req.options],
        queryFn: () => eventRepository.getEvents(req),
        ...options,
    });
}

export function useGetEventDetail(
    req: IHttpRequest<IGetEventDetailRequest>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IGetEventDetailResponse>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["event", { slug: req.payload?.slug }],
        queryFn: () => eventRepository.getEventDetail(req),
        ...options
    });
}

export function useGetEventSeats(
    req: IHttpRequest<IGetEventSeatsRequest>,
    options?: Omit<UseQueryOptions<unknown, unknown,
        IHttpResponse<IGetEventSeatsResponse>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["event-seats", req.payload],
        queryFn: () => eventRepository.getEventSeats(req),
        ...options
    });
}

export function useGetEventCategories(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<IEventCategory>>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["event-categories", req.options],
        queryFn: () => eventRepository.getEventCategories(req),
        ...options,
    });
}

export function useAdminGetEvents(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["admin-events"],
        queryFn: () => eventRepository.adminGetEvents(req),
        ...options,
    });
}

export function useAdminCreateEvent(
    req: IHttpRequest<IAdminCreateEventRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, IAdminCreateEventRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-create-event", req.payload],
        mutationFn: (payload: IAdminCreateEventRequest) => eventRepository.adminCreateEvent({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-events"]
            });
        },
        ...options,
    });
}

export function useAdminUpdateEvent(
    req: IHttpRequest<IAdminUpdateEventRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<IAdminUpdateEventResponse>, unknown, IAdminUpdateEventRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-update-event", req.payload],
        mutationFn: (payload: IAdminUpdateEventRequest) => eventRepository.adminUpdateEvent({ payload }),
        onMutate: async (newPayload: IAdminUpdateEventRequest) => {
            await queryClient.cancelQueries({ queryKey: ["admin-events"] });
            console.log("Updating event with payload:", newPayload);

            const previous = queryClient.getQueryData<IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>>(["admin-events"]);

            queryClient.setQueryData<IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>>(['admin-events'], (old) => {
                console.log(old)
                if (!old) return old;
                const updatedEvents = old.data.data.map(event =>
                    event.id === newPayload.id
                        ? { ...event, is_active: newPayload.is_active }
                        : event
                );
                const returned = {
                    ...old,
                    data: {
                        ...old.data,
                        data: updatedEvents,
                    }
                };
                return returned as IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>;
            });

            return { previous };
        },
        onError: (err, newPayload, context) => {
            queryClient.setQueryData(["admin-events"], context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-events"]
            });
            queryClient.invalidateQueries({
                queryKey: ["event", { slug: req.payload?.slug }]
            })
        },
        ...options,
    });
}

export function useAdminCreateEventCategory(
    options?: Omit<UseMutationOptions<IHttpResponse<IEventCategory>, unknown, IAdminCreateEventCategoryRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IAdminCreateEventCategoryRequest) =>
            eventRepository.adminCreateEventCategory({ payload }), // Mengirim payload langsung
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["event-categories"] });
        },
        ...options,
    });
}