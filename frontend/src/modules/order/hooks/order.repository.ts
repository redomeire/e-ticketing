import api from "@/config/api";
import { IHttpRequest, IHttpResponse } from "@/config/http";

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

const orderRepository = {
    checkout
}

export type {
    ICheckoutRequest,
    ICheckoutResponse
}

export default orderRepository;