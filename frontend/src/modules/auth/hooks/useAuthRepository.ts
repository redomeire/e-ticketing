import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import authRepository, { IRegisterRequest, IResetPasswordRequest } from "../repositories/auth.repository";
import { IHttpRequest, IHttpResponse } from "@/config/http";

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

export function useForgotPassword(
    req: IHttpRequest<{ email: string }>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, { email: string }>, 'mutationKey'>
) {
    return useMutation({
        mutationFn: (payload: { email: string }) => authRepository.forgotPassword({ ...req, payload }),
        ...options
    });
}

export function useSendVerificationEmail(
    req: IHttpRequest<{ email: string }>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, { email: string }>, 'mutationKey'>
) {
    return useMutation({
        mutationFn: (payload: { email: string }) => authRepository.sendVerificationEmail({ ...req, payload }),
        ...options
    });
}

export function useResetPassword(
    req: IHttpRequest<IResetPasswordRequest>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, IResetPasswordRequest>, 'mutationKey'>
) {
    return useMutation({
        mutationFn: (payload: IResetPasswordRequest) => authRepository.resetPassword({ ...req, payload }),
        ...options
    });
}