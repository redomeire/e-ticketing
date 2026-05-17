import { signOut } from "@/modules/auth/config/auth";
import axios from "axios";
import { toast } from "sonner";

const isServer = typeof window === "undefined";

const api = axios.create({
    baseURL: isServer ?
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1` : "/api/v1",
    timeout: 10000,
    headers: {
        "Accept": "application/json",
    }
})

api.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    async (response) => {
        if (response.status >= 200 && response.status < 300) {
            if (!isServer) {
                toast.success(response.data.message ?? "success")
            }
            return response;
        }
        if (response.status === 401) {
            if (isServer) {
                await signOut();
            }
            throw new Error("Unauthorized. Please log in again.");
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.data && !isServer) {
            toast.error(error.response.data.message ?? "An error occurred");
        }
        console.error("API Error:", error);
        return Promise.reject(error);
    }
)

export default api;