import { Outlet } from "react-router-dom";
import AdminFooter from "../components/layout/Admin/AdminFooter";
import AdminHeaderLayout from "../components/layout/Admin/AdminHeader";
import AdminSideNav from "../components/layout/Admin/AdminSideNav";
function AdminLayout() {
    return (
        <div className="app">
            <div className="layout">
                <AdminHeaderLayout />
                <AdminSideNav />
                <div className="page-container">
                    <Outlet />
                </div>
                <AdminFooter />
            </div>
        </div>
    )
}
export default AdminLayout;