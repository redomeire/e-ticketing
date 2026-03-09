import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import orderRepository, { ICheckoutRequest, ICheckoutResponse } from "../hooks/order.repository";
import { IOrderHistory } from "../types/order";

export function useCheckout(
    options?: Omit<UseMutationOptions<IHttpResponse<ICheckoutResponse>, unknown, ICheckoutRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["checkout"],
        mutationFn: (payload: ICheckoutRequest) => orderRepository.checkout({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["checkout"] });
        },
        ...options
    });
}

export function useGetOrderHistory(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<IOrderHistory>>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["order", req.options],
        queryFn: () => orderRepository.getOrderHistory(req),
        ...options
    });
}