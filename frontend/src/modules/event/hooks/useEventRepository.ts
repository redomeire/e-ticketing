import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import eventRepository, { IGetEventDetailRequest, IGetEventSeatsRequest, IGetEventSeatsResponse, IGetEventsResponse } from "../repositories/event.repository";
import { IHttpRequest, IPaginatedData, IHttpResponse } from "@/config/http";

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