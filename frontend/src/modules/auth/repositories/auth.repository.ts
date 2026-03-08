import api from "@/config/api"
import { IHttpRequest, IHttpResponse } from "@/config/http";

type IRegisterRequest = {
    email: string;
    password: string;
    name: string;
}

const register = async (
    params: IHttpRequest<IRegisterRequest>
): Promise<IHttpResponse<{}>> => {
    const response = await api.post(
        '/auth/register',
        params.payload,
        params.options
    );
    return response.data;
}

const logout = async (
    params: IHttpRequest<{}>
): Promise<IHttpResponse<{}>> => {
    const response = await api.post(
        '/auth/logout',
        params.payload,
        params.options
    );
    return response.data;
}

const authRepository = {
    logout,
    register
}

export type { IRegisterRequest };

export default authRepository;