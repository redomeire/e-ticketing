import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import eventRepository, { IAdminCreateEventCategoryRequest, IAdminCreateEventRequest, IAdminGetEventsResponse, IAdminUpdateEventResponse, IAdminUpdateSeatsRequest, IGetEventDetailRequest, IGetEventDetailResponse, IGetEventSeatsRequest, IGetEventSeatsResponse, IGetEventsResponse } from "../repositories/event.repository";
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
        queryKey: ["admin-events", req.options],
        queryFn: () => eventRepository.adminGetEvents(req),
        ...options,
    });
}

export function useAdminCreateEvent(
    req: IHttpRequest<IAdminCreateEventRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, FormData>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-create-event", req.payload],
        mutationFn: (payload: FormData) => eventRepository.adminCreateEvent({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-events"]
            });
        },
        ...options,
    });
}

export function useAdminUpdateEvent(
    req: IHttpRequest<FormData>,
    options?: Omit<UseMutationOptions<IHttpResponse<IAdminUpdateEventResponse>, unknown, FormData>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-update-event", req.payload],
        mutationFn: (formData: FormData) => {
            const id = Number(formData.get("id"));
            const payload = formData;
            return eventRepository.adminUpdateEvent(id, { payload });
        },
        onError: (err, newPayload, context) => {
            queryClient.setQueryData(["admin-events"], context);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-events"]
            });
        },
        ...options,
    });
}

export function useAdminToggleEventActive(
    req: IHttpRequest<{ id: number; is_active: boolean }>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, { id: number; is_active: boolean }>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-toggle-event-active", req.payload],
        mutationFn: (payload: { id: number; is_active: boolean }) => eventRepository.adminToggleEventActive(payload.id, { payload }),
        onMutate: async (newPayload: { id: number; is_active: boolean }) => {
            await queryClient.cancelQueries({ queryKey: ["admin-events", req.options] });

            const previous = queryClient.getQueryData<IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>>(["admin-events", req.options]);

            queryClient.setQueryData<IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>>(['admin-events', req.options], (old) => {
                if (!old) return old;
                const updatedEvents = old.data.data.map(event =>
                    event.id === newPayload.id
                        ? { ...event, is_active: newPayload.is_active }
                        : event
                );
                return {
                    ...old,
                    data: {
                        ...old.data,
                        data: updatedEvents,
                    }
                } as IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>;
            });

            return { previous };
        },
        onError: (err, newPayload, context) => {
            queryClient.setQueryData(["admin-events", req.options], context);
        },
        ...options,
    });
}

export function useAdminUpdateSeats(
    req: IHttpRequest<IAdminUpdateSeatsRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, IAdminUpdateSeatsRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["admin-update-seats"],
        mutationFn: (payload: IAdminUpdateSeatsRequest) => eventRepository.adminUpdateSeats({ payload }),
        onSuccess: (data, variables) => {
            const slug = variables.slug;
            queryClient.invalidateQueries({
                queryKey: ["event", { slug }]
            });
            queryClient.invalidateQueries({
                queryKey: ["event-seats", { slug }]
            });
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
            eventRepository.adminCreateEventCategory({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["event-categories"] });
        },
        ...options,
    });
}

export function useAdminDeleteEvent(
    req: IHttpRequest<{ id: number }>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, { id: number }>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-delete-event", req.payload],
        mutationFn: (payload: { id: number }) => eventRepository.adminDeleteEvent(payload.id, { payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-events"]
            });
        },
        ...options,
    });
}