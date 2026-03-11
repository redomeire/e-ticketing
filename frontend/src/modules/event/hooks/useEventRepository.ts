import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import eventRepository, { IAdminGetEventsResponse, IAdminUpdateEventRequest, IAdminUpdateEventResponse, IGetEventDetailRequest, IGetEventSeatsRequest, IGetEventSeatsResponse, IGetEventsResponse } from "../repositories/event.repository";
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
    options?: UseQueryOptions
) {
    return useQuery({
        queryKey: ["event", req.payload],
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

export function useAdminUpdateEvent(
    req: IHttpRequest<IAdminUpdateEventRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<IAdminUpdateEventResponse>, unknown, IAdminUpdateEventRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-update-event", req.payload],
        mutationFn: (payload: IAdminUpdateEventRequest) => eventRepository.adminUpdateEvent({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-events"]
            });
        },
        ...options,
    });
}