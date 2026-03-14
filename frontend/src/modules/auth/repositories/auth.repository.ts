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

const forgotPassword = async (
    params: IHttpRequest<{ email: string }>
): Promise<IHttpResponse<{}>> => {
    const response = await api.post(
        '/auth/forgot-password',
        params.payload,
        params.options
    );
    return response.data;
}

const sendVerificationEmail = async (
    params: IHttpRequest<{ email: string }>
): Promise<IHttpResponse<{}>> => {
    const response = await api.post(
        '/auth/send-verification-email',
        params.payload,
        params.options
    );
    return response.data;
}

interface IResetPasswordRequest {
    token: string;
    password: string;
    email: string;
    password_confirmation: string;
}

const resetPassword = async (
    params: IHttpRequest<IResetPasswordRequest>
): Promise<IHttpResponse<{}>> => {
    const response = await api.post(
        `/auth/reset-password/${params.payload?.token}`,
        params.payload,
        params.options
    );
    return response.data;
}

const authRepository = {
    logout,
    register,
    forgotPassword,
    sendVerificationEmail,
    resetPassword,
}

export type { IRegisterRequest, IResetPasswordRequest };

export default authRepository;