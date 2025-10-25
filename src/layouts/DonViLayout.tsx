import { Outlet } from "react-router-dom";
import DonViHeaderLayout from "../components/layout/DonVi/DonViHeader";
import DonViSideNav from "../components/layout/DonVi/DonViSideNav";
import DonViFooter from "../components/layout/DonVi/DonViFooter";
function DonViLayout() {
    return (
        <div className="app">
            <div className="layout">
                <DonViHeaderLayout />
                <DonViSideNav />
                <div className="page-container">
                    <Outlet />
                </div>
                <DonViFooter />
            </div>
        </div>
    )
}
export default DonViLayout;