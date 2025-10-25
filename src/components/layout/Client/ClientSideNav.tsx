import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { URL_USER } from "../../../URL_Config";
import { LoginServicesAPI } from "../../../api/LoginServicesAPI";
import { SweetAlert } from "../../ui/SweetAlert";
import { useState } from "react";
import Loading from "../../ui/Loading";

function ClientSideNav() {
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const tokenGoogle = credentialResponse.credential;
      const decoded: any = jwtDecode(tokenGoogle);

      const res = await LoginServicesAPI.LoginWithGoogle({
        email: decoded.email,
        Username: decoded.name,
        avatar_url: decoded.picture,
      });

      if (res.status === 200 && res.data.success) {
        const { token, user } = res.data;

        localStorage.setItem("accessToken", token);

        switch (user.id_type_users) {
          case 2:
            window.location.href = "/ctdt";
            break;
          case 5:
            window.location.href = "/admin";
            break;
          case 3:
            window.location.href = "/donvi";
            break;
          default:
            window.location.href = "/";
            break;
        }
      } else {
        console.error("Login thất bại:", res.data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="side-nav">
      <Loading isOpen={loading} />
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li
            className="nav-item"
            style={{
              border: "1px solid #d0d7de",
              borderRadius: "8px",
              overflow: "hidden",
              margin: "10px 10px 20px 10px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                background: "#0d6efd",
                color: "#fff",
                padding: "10px 15px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              <i className="anticon anticon-user" />
              ĐĂNG NHẬP
            </div>

            <div
              style={{
                padding: "15px",
                textAlign: "center",
                background: "#f8f9fa",
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => alert("Login thất bại!")}
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ClientSideNav;
