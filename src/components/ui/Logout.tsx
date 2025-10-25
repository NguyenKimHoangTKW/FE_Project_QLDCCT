import { LoginServicesAPI } from "../../api/LoginServicesAPI";
import { SweetAlert } from "./SweetAlert";

export const Logout = async () => {
  const res = await LoginServicesAPI.LogoutWithGoogle();
  if (res.data.success) {
    window.location.href = "/";
  } else {
    SweetAlert("error", res.message);
  }
};
