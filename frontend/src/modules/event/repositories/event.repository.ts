import api from "@/config/api"
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import {
    IEvent,
    IEventCategory,
    IEventSeat,
    IEventTicketCategory
} from "../types/event";

type IGetEventsResponse = Omit<IEvent, 'description' | 'terms_and_conditions' | 'max_row' | 'max_column'> & {
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
    ticket_categories: ((IEventTicketCategory & { seats: IEventSeat[] }) & { available_tickets_count: number })[];
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
    max_row: number;
    max_column: number;
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

const getEventCategories = async (
    params: IHttpRequest<{}>
): Promise<IHttpResponse<IPaginatedData<IEventCategory>>> => {
    const response = await api.get(
        '/event/categories',
        params.options
    );
    return response.data;
}

type IAdminGetEventsResponse =
    Pick<IEvent, 'id' | 'name' | 'start_time' | 'slug' | 'is_active'>
    & {
        ticket_categories: Pick<IEventCategory, 'id' | 'quota'>[]
    }

const adminGetEvents = async (
    params: IHttpRequest<{}>
): Promise<IHttpResponse<IPaginatedData<IAdminGetEventsResponse>>> => {
    const response = await api.get(
        '/event/admin',
        params.options
    );
    return response.data;
}

type IAdminCreateEventRequest = Partial<IEvent> & {
    event_categories?: { name: string }[],
    ticket_categories: {
        base_price: number;
        name: string;
        quota: number;
        seats: { row: number; column: number; number: string }[]
    }[]
}

const adminCreateEvent = async (
    params: IHttpRequest<FormData>,
): Promise<IHttpResponse<{}>> => {
    const response = await api.post(
        '/event/admin',
        params.payload,
        params.options
    );
    return response.data;
}

type IAdminUpdateEventRequest = (Partial<IEvent> & {
    event_categories?: { name: string }[],
})

type IAdminUpdateEventResponse = IEvent;

const adminUpdateEvent = async (
    id: number,
    params: IHttpRequest<FormData>
): Promise<IHttpResponse<IAdminUpdateEventResponse>> => {
    const response = await api.post( // spoof PUT with POST
        `/event/admin/${id}`,
        params.payload,
        params.options
    );
    return response.data;
}

type IAdminToggleEventActiveResponse = IAdminUpdateEventResponse

const adminToggleEventActive = async (
    id: number,
    params: IHttpRequest<{ is_active: boolean }>
): Promise<IHttpResponse<IAdminToggleEventActiveResponse>> => {
    const response = await api.put(
        `/event/admin/${id}/toggle`,
        params.payload,
        params.options
    );
    return response.data;
}

interface IAdminUpdateSeatsRequest {
    max_row: number;
    max_column: number;
    slug: string;
    ticket_categories: (Partial<IEventTicketCategory> & {
        seats?: { row: number; column: number; number: string }[]
    })[]
}

const adminUpdateSeats = async (
    params: IHttpRequest<IAdminUpdateSeatsRequest>
): Promise<IHttpResponse<{}>> => {
    const response = await api.put(
        `/event/admin/${params.payload?.slug}/seats`,
        params.payload,
        params.options
    );
    return response.data;
}

interface IAdminCreateEventCategoryRequest {
    name: string;
}

const adminCreateEventCategory = async (
    params: IHttpRequest<IAdminCreateEventCategoryRequest>,
): Promise<IHttpResponse<IEventCategory>> => {
    const response = await api.post(
        `/event/admin/category`,
        params.payload,
        params.options
    );
    return response.data;
}

const eventRepository = {
    getEvents,
    getEventDetail,
    getEventSeats,
    getEventCategories,
    adminGetEvents,
    adminUpdateEvent,
    adminToggleEventActive,
    adminUpdateSeats,
    adminCreateEventCategory,
    adminCreateEvent
}

export type {
    IGetEventsResponse,
    IGetEventDetailResponse,
    IGetEventDetailRequest,
    IGetEventSeatsRequest,
    IGetEventSeatsResponse,
    IAdminGetEventsResponse,
    IAdminUpdateEventRequest,
    IAdminUpdateSeatsRequest,
    IAdminUpdateEventResponse,
    IAdminCreateEventCategoryRequest,
    IAdminCreateEventRequest
};

export default eventRepository;