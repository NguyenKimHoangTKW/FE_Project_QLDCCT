import axios from "axios";
import Swal from "sweetalert2";
import { URL_USER } from "../URL_Config";

const axiosInstance = axios.create({
  baseURL: URL_USER,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const message =
        error.response.data?.message || "Phiên đăng nhập đã hết hạn.";

      await Swal.fire({
        icon: "warning",
        title: "Phiên đăng nhập đã hết hạn!",
        text: message,
        confirmButtonText: "Đăng nhập lại",
      });

      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export const LoginServicesAPI = {
  LoginWithGoogle: (data: {
    email: string;
    Username: string;
    avatar_url: string;
  }) => axiosInstance.post("/login-with-google", data),
  LogoutWithGoogle: () =>
    axiosInstance.post("/logout", {}, { withCredentials: true }),
};

export default axiosInstance;
