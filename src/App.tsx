import { BrowserRouter, Routes, Route } from "react-router-dom";

import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import CTDTLayout from "./layouts/CTDTLayout";
import DonViLayout from "./layouts/DonViLayout";
import GVDeCuongLayout from "./layouts/GVDeCuongLayout";

import AdminRoutes from "./modules/Admin/routes/AdminRoutes";
import CTDTRoutes from "./modules/CTDT/routes/CTDTRoutes";
import DonViRoutes from "./modules/DonVi/routes/DonViRoutes";
import GVDeCuongRoutes from "./modules/GVDeCuong/routes/GVDeCuongRoutes";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<ClientLayout />} />


        <Route element={<ProtectedRoute allowedRoles={[5]} />}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="*" element={<AdminRoutes />} />
          </Route>
        </Route>


        {/* ===== CTDT ===== */}
        <Route element={<ProtectedRoute allowedRoles={[2]} />}>
          <Route path="/ctdt/*" element={<CTDTLayout />}>
            <Route path="*" element={<CTDTRoutes />} />
          </Route>
        </Route>


        {/* ===== ĐƠN VỊ ===== */}
        <Route element={<ProtectedRoute allowedRoles={[3]} />}>
          <Route path="/donvi/*" element={<DonViLayout />}>
            <Route path="*" element={<DonViRoutes />} />
          </Route>
        </Route>


        {/* ===== Giảng viên đề cương ===== */}
        <Route element={<ProtectedRoute allowedRoles={[4]} />}>
          <Route path="/gv-de-cuong/*" element={<GVDeCuongLayout />}>
            <Route path="*" element={<GVDeCuongRoutes />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
