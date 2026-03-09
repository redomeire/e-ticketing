import { AxiosRequestConfig } from "axios";

interface IHttpRequest<T> {
    payload?: T;
    options?: AxiosRequestConfig;
}

interface IHttpResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface IPaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type { IHttpRequest, IHttpResponse, IPaginatedData };