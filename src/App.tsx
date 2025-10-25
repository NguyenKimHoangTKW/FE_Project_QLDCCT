import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoutes from "./modules/Admin/routes/AdminRoutes";
import CTDTRoutes from "./modules/CTDT/routes/CTDTRoutes";
import ClientLayout from "./layouts/ClientLayout";
import CTDTLayout from "./layouts/CTDTLayout";
import DonViLayout from "./layouts/DonViLayout";
import DonViRoutes from "./modules/DonVi/routes/DonViRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>
        <Route>
          <Route path="/ctdt/*" element={<CTDTLayout />}>
            <Route path="*" element={<CTDTRoutes />} />
          </Route>
        </Route>
        <Route>
          <Route path="/donvi/*" element={<DonViLayout />}>
            <Route path="*" element={<DonViRoutes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
