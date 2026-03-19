import api from "@/config/api"
import { IHttpRequest, IHttpResponse } from "@/config/http";
import { IProfile } from "../types/profile";

const getProfile = async (
    req: IHttpRequest<{}>
): Promise<IHttpResponse<IProfile>> => {
    const response = await api.get(
        '/profile',
        req.options
    );
    return response.data;
}

const updateProfile = async (
    req: IHttpRequest<IProfile>
): Promise<IHttpResponse<IProfile>> => {
    const response = await api.put(
        '/profile',
        req.payload,
        req.options
    );
    return response.data;
}

const profileRepository = {
    getProfile,
    updateProfile
}

export default profileRepository;