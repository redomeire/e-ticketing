import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import authRepository, { IRegisterRequest } from "../repositories/auth.repository";
import { IHttpRequest } from "@/config/http";

export function useRegister(
    req: IHttpRequest<IRegisterRequest>,
    options?: UseMutationOptions<unknown, unknown, IRegisterRequest>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: IRegisterRequest) => authRepository.register({ ...req, payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        ...options
    });
}

export function useLogout(
    req: IHttpRequest<{}>,
    options?: UseMutationOptions
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authRepository.logout(req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        ...options
    });
}