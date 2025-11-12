import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoutes from "./modules/Admin/routes/AdminRoutes";
import CTDTRoutes from "./modules/CTDT/routes/CTDTRoutes";
import ClientLayout from "./layouts/ClientLayout";
import CTDTLayout from "./layouts/CTDTLayout";
import DonViLayout from "./layouts/DonViLayout";
import DonViRoutes from "./modules/DonVi/routes/DonViRoutes";
import GVDeCuongLayout from "./layouts/GVDeCuongLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GVDeCuongRoutes from "./modules/GVDeCuong/routes/GVDeCuongRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Trang chủ công khai */}
        <Route path="/" element={<ClientLayout />} />

        {/* ✅ Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[5]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        {/* ✅ CTDT */}
        <Route
          path="/ctdt/*"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <CTDTLayout />
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<CTDTRoutes />} />
        </Route>

        {/* ✅ Đơn vị */}
        <Route
          path="/donvi/*"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <DonViLayout />
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<DonViRoutes />} />
        </Route>

        {/* ✅ Giảng viên đề cương */}
        <Route
          path="/gv-de-cuong/*"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <GVDeCuongLayout />
            </ProtectedRoute>
          }
        >
          <Route path="*" element={<GVDeCuongRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
