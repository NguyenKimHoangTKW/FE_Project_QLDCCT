import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { LoginServicesAPI } from "../../../api/LoginServicesAPI";
import { useState } from "react";
import Loading from "../../ui/Loading";

function ClientSideNav() {
  const [loading, setLoading] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");
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
        const { user } = res.data;

        localStorage.setItem("accessToken", res.data.token);

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
          case 4:
            window.location.href = "/gv-de-cuong";
            break;
          default:
            setShowErrorMessage("Bạn chưa được phân quyền để truy cập vào hệ thống, vui lòng liên hệ với quản trị viên để biết thêm chi tiết.");
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

              {showErrorMessage && (
                <>
                  <hr />
                  <div className="alert alert-danger" style={{ marginTop: "10px" }}>
                    {showErrorMessage}
                  </div>
                </>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ClientSideNav;
