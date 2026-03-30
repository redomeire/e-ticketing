import { IHttpRequest, IHttpResponse } from "@/config/http";
import { IAnalytics } from "../types/analytics";
import api from "@/config/api";

const getAnalytics = async (
    req: IHttpRequest<{}>
): Promise<IHttpResponse<IAnalytics>> => {
    const response = await api.get(
        '/event/admin/analytics',
        req.options
    );
    return response.data;
}

const analyticsRepository = {
    getAnalytics,
};

export default analyticsRepository;