import { Outlet } from "react-router-dom";
import GVDeCuongHeaderLayout from "../components/layout/GVDeCuong/GVDeCuongHeader";
import GVDeCuongSideNav from "../components/layout/GVDeCuong/GVDeCuongSideNav";
import GVDeCuongFooter from "../components/layout/GVDeCuong/GVDeCuongFooter";
function GVDeCuongLayout() {
    return (
        <div className="app">
            <div className="layout">
                <GVDeCuongHeaderLayout />
                <GVDeCuongSideNav />
                <div className="page-container">
                    <Outlet />
                </div>
                <GVDeCuongFooter />
            </div>
        </div>
    )
}
export default GVDeCuongLayout;