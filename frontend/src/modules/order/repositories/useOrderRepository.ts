import { IHttpResponse } from "@/config/http";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import orderRepository, { ICheckoutRequest, ICheckoutResponse } from "../hooks/order.repository";

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