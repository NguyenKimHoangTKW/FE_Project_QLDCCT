import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
    allowedRoles: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {

    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const location = useLocation();

    const previousPath = useRef(location.pathname);

    // luôn lưu path trước đó
    useEffect(() => {
        previousPath.current = location.pathname;
    }, [location.pathname]);

    useEffect(() => {

        if (!token) {
            navigate(-1);
            return;
        }

        let decoded: any = {};
        try {
            decoded = jwtDecode(token);
        } catch {
            localStorage.removeItem("accessToken");
            navigate(-1);
            return;
        }

        const userRole = Number(decoded.id_type_users);

        if (!allowedRoles.includes(userRole)) {
            navigate(-1);
        }

    }, [token, allowedRoles, navigate]);

    return <Outlet />;
};

export default ProtectedRoute;
