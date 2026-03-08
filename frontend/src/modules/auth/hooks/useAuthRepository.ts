import { useMutation, useQueryClient } from "@tanstack/react-query"
import authRepository, { IRegisterRequest } from "../repositories/auth.repository";
import { IHttpRequest } from "@/config/http";

export function useRegister(req: IHttpRequest<IRegisterRequest>) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authRepository.register(req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

export function useLogout(req: IHttpRequest<{}>) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authRepository.logout(req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}