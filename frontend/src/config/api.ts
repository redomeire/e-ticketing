import { auth, signOut } from "@/modules/auth/config/auth";
import axios from "axios";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
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
        // detect if it is client side
        let session: Session | null = null;
        if (isServer) {
            session = await auth();
            config.headers["Authorization"] = `Bearer ${session?.token}`;
            return config;
        }
        session = await getSession();
        config.headers["Authorization"] = `Bearer ${session?.token}`;
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