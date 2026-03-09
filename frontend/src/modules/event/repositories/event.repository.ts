import api from "@/config/api"
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import {
    IEvent,
    IEventCategory,
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
    ticket_categories: IEventTicketCategory[];
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

const eventRepository = {
    getEvents,
    getEventDetail
}

export type { IGetEventsResponse, IGetEventDetailResponse, IGetEventDetailRequest };

export default eventRepository;