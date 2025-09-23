import { Route, Routes } from "react-router-dom";
import TableDemo from "../pages/CanBoVienChuc/CivilServants";
import DanhSachNam from "../pages/CanBoVienChuc/Year";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="test" element={<TableDemo />} />
      <Route path="quan-li-danh-sach-nam" element={<DanhSachNam />}></Route>
    </Routes>
  );
}

export default AdminRoutes;
