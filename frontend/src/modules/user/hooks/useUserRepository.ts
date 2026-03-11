import { IHttpRequest, IHttpResponse, IPaginatedData } from "@/config/http";
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { IUser } from "../types/user";
import userRepository from "../repositories/user.repository";
import { IAdminUpdateEventRequest } from "@/modules/event/repositories/event.repository";

export function useAdminGetUsers(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IPaginatedData<IUser>>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["admin-users", req.options],
        queryFn: () => userRepository.adminGetUsers(req),
        ...options
    });
}

export function useAdminToggleUserActive(
    req: IHttpRequest<IAdminUpdateEventRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, IAdminUpdateEventRequest>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["admin-update-user", req.payload],
        mutationFn: (payload: IAdminUpdateEventRequest) => userRepository.adminToggleUserActive({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"]
            });
        },
        ...options,
    });
}