import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { URL_USER } from "../URL_Config";

interface GooglePayload {
  email: string;
  name: string;
  picture: string;
}

const LoginWithGoogle: React.FC = () => {
  const handleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const decoded: GooglePayload = jwtDecode(token);

    const res = await axios.post(`${URL_USER}/login-with-google`, {
      email: decoded.email,
      Username: decoded.name,
      avatar_url: decoded.picture,
    });
    const data = res.data;
    if (data.success) {
      window.location.href = "/admin";
    }
  };

  const handleLoginError = () => {
    alert("Google Login thất bại!");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="card p-5 text-center">
        <h3 className="mb-3">Đăng nhập hệ thống</h3>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </div>
  );
};

export default LoginWithGoogle;
