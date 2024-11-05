import axios from "axios";
import { setupInterceptors } from "./Interceptors";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

setupInterceptors(axiosInstance);

export default axiosInstance;