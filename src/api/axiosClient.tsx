import axios from "axios";
import Swal from "sweetalert2";

export const API_BASE = "https://localhost:44314/api";

const axiosClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            Swal.fire({
                icon: "warning",
                title: "Phiên đăng nhập đã hết hạn",
                text: "Vui lòng đăng nhập lại!",
                confirmButtonText: "OK"
            }).then(() => {
                localStorage.clear();
                window.location.href = "/";
            });
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
