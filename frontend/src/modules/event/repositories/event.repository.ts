import api from "@/config/api"
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import {
    IEvent,
    IEventCategory,
    IEventSeat,
    IEventTicketCategory
} from "../types/event";

type IGetEventsResponse = Omit<IEvent, 'description' | 'terms_and_conditions' | 'max_row_index' | 'max_column_index'> & {
    ticket_categories: IEventTicketCategory[];
};

const getEvents = async (
    params: IHttpRequest<{}>
): Promise<IHttpResponse<IPaginatedData<IGetEventsResponse>>> => {
    const response = await api.get(
        '/event',
        params.options
    );
    return response.data;
}

interface IGetEventDetailRequest {
    slug: string;
}

type IGetEventDetailResponse = IEvent & {
    ticket_categories: (IEventTicketCategory & { available_tickets_count: number })[];
    categories: IEventCategory[];
}

const getEventDetail = async (
    params: IHttpRequest<IGetEventDetailRequest>
): Promise<IHttpResponse<IGetEventDetailResponse>> => {
    const response = await api.get(
        `/event/${params.payload?.slug}`,
        params.options
    );
    return response.data;
}

interface IGetEventSeatsRequest {
    slug: string;
}

type IGetEventSeatsResponse = {
    max_row_index: number;
    max_column_index: number;
    seats: (IEventSeat & { base_price: string, category_name: string })[];
}

const getEventSeats = async (
    params: IHttpRequest<IGetEventSeatsRequest>
): Promise<IHttpResponse<IGetEventSeatsResponse[]>> => {
    const response = await api.get(
        `/event/${params.payload?.slug}/seats`,
        params.options
    );
    return response.data;
}

const eventRepository = {
    getEvents,
    getEventDetail,
    getEventSeats
}

export type {
    IGetEventsResponse,
    IGetEventDetailResponse,
    IGetEventDetailRequest,
    IGetEventSeatsRequest,
    IGetEventSeatsResponse
};

export default eventRepository;