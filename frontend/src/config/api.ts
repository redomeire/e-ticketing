import axios from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";


const api = axios.create({
    baseURL: "/api/v1",
    timeout: 10000,
    headers: {
        "Accept": "application/json",
    }
})

api.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        config.headers["Authorization"] = `Bearer ${session?.token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status < 300) {
            console.log(response);
            toast.success(response.data.message ?? "success")
            return response;
        }
        if (response.status === 401) {
            localStorage.removeItem("token");
            throw new Error("Unauthorized. Please log in again.");
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.data) {
            toast.error(error.response.data.message ?? "An error occurred");
        }
        console.error("API Error:", error);
        return Promise.reject(error);
    }
)

export default api;