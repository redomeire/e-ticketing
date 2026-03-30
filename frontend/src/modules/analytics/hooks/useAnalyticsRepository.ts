import { IHttpRequest, IHttpResponse } from "@/config/http";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IAnalytics } from "../types/analytics";
import analyticsRepository from "../repositories/analyticsRepository";


export function useGetAnalytics(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IAnalytics>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["analytics"],
        queryFn: () => analyticsRepository.getAnalytics(req),
        ...options
    });
}