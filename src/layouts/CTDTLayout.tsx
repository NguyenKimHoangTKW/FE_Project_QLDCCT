import { Outlet } from "react-router-dom";
import CTDTSideNav from "../components/layout/CTDT/CTDTSideNav";
import CTDTHeaderLayout from "../components/layout/CTDT/CTDTHeader";
import CTDTFooter from "../components/layout/CTDT/CTDTFooter";
function CTDTLayout() {
    return (
        <div className="app">
            <div className="layout">
                <CTDTHeaderLayout />
                <CTDTSideNav />
                <div className="page-container">
                    <Outlet />
                </div>
                <CTDTFooter />
            </div>
        </div>
    )
}
export default CTDTLayout;