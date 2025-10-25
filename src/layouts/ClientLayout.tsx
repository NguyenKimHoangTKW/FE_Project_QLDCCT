import { Outlet } from "react-router-dom";
import ClientHeaderLayout from "../components/layout/Client/ClientHeader";
import ClientSideNav from "../components/layout/Client/ClientSideNav";
import ClientFooter from "../components/layout/Client/ClientFooter";

function ClientLayout() {
    return (
        <div className="app">
            <div className="layout">
                <ClientHeaderLayout />
                <ClientSideNav />
                <div className="page-container">
                    <Outlet />
                </div>
                <ClientFooter />
            </div>
        </div>
    )
}
export default ClientLayout;