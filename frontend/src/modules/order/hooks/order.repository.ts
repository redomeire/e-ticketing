import api from "@/config/api";
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import { IOrderHistory } from "../types/order";
import { IAttendee } from "@/modules/event/types/event";

interface ICheckoutRequest {
    attendees: {
        name: string;
        email: string;
        phone: string;
        is_male: boolean;
        seat_id: number;
    }[]
}

interface ICheckoutResponse {
    invoice_url: string;
    order_id: number;
}

const checkout = async (
    params: IHttpRequest<ICheckoutRequest>
): Promise<IHttpResponse<ICheckoutResponse>> => {
    const response = await api.post(
        `/event/seats/checkout`,
        params.payload,
        params.options
    );
    return response.data;
}

const getOrderHistory = async (
    params: IHttpRequest<{}>
): Promise<IHttpResponse<IPaginatedData<IOrderHistory>>> => {
    const response = await api.get(
        `/event/orders`,
        params.options
    );
    return response.data;
}

interface IGetOrderHistoryDetailRequest {
    orderId: number;
}

type IGetOrderHistoryDetailResponse = {
    id: number;
    invoice_id: string;
    status: string;
    total_amount: number;
    base_amount: number;
    created_at: string;
    event_name: string;
    start_time: string;
    end_time: string;
    location: string;
    attendees: (IAttendee & { category: string; seat_number: string })[];
}

const getOrderHistoryDetail = async (
    params: IHttpRequest<IGetOrderHistoryDetailRequest>
): Promise<IHttpResponse<IGetOrderHistoryDetailResponse>> => {
    const response = await api.get(
        `/event/orders/${params.payload?.orderId}`,
        params.options
    );
    return response.data;
}

const orderRepository = {
    checkout,
    getOrderHistory,
    getOrderHistoryDetail
}

export type {
    ICheckoutRequest,
    ICheckoutResponse,
    IGetOrderHistoryDetailRequest,
    IGetOrderHistoryDetailResponse
}

export default orderRepository;