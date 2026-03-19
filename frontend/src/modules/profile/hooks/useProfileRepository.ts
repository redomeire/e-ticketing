import { IHttpRequest, IHttpResponse } from "@/config/http";
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { IProfile } from "../types/profile";
import profileRepository from "../repositories/profile.repository";

export function useGetProfile(
    req: IHttpRequest<{}>,
    options?: Omit<UseQueryOptions<unknown, unknown, IHttpResponse<IProfile>>, 'queryKey'>
) {
    return useQuery({
        queryKey: ["profile", req.options],
        queryFn: () => profileRepository.getProfile(req),
        ...options
    });
}

export function useUpdateProfile(
    req: IHttpRequest<IProfile>,
    options?: Omit<UseMutationOptions<IHttpResponse<{}>, unknown, IProfile>, 'mutationKey'>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-profile", req.payload],
        mutationFn: (payload: IProfile) => profileRepository.updateProfile({ payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"]
            });
        },
        ...options,
    });
}