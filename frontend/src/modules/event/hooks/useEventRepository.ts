import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import eventRepository, { IGetEventDetailRequest, IGetEventsResponse } from "../repositories/event.repository";
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