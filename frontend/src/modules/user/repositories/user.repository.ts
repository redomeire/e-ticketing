import api from "@/config/api"
import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import { IUser } from "../types/user";

const adminGetUsers = async (
    params: IHttpRequest<{}>
): Promise<IHttpResponse<IPaginatedData<IUser>>> => {
    const response = await api.get(
        '/event/admin/users',
        params.options
    );
    return response.data;
}

interface IAdminToggleUserActiveRequest {
    id: number;
    is_active: boolean;
}

const adminToggleUserActive = async (
    req: IHttpRequest<IAdminToggleUserActiveRequest>
): Promise<IHttpResponse<IUser>> => {
    const response = await api.patch(
        `/event/admin/users/${req.payload?.id}`,
        { is_active: req.payload?.is_active },
        req.options
    );
    return response.data;
}

const userRepository = {
    adminGetUsers,
    adminToggleUserActive
}

export type {
    IAdminToggleUserActiveRequest
}

export default userRepository;