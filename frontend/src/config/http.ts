import { AxiosRequestConfig } from "axios";

interface IHttpRequest<T> {
    payload?: T;
    options?: AxiosRequestConfig;
}

interface IHttpResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

interface IPaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    Limit: number;
    totalPages: number;
}

export type { IHttpRequest, IHttpResponse, IPaginatedData };