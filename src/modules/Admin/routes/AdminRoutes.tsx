import { Route, Routes } from "react-router-dom";
import DanhSachNam from "../pages/CanBoVienChuc/Year";
import CivilServants from "../pages/CanBoVienChuc/CivilServants";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="quan-li-can-bo-vien-chuc" element={<CivilServants />} />
      <Route path="quan-li-danh-sach-nam" element={<DanhSachNam />}></Route>
    </Routes>
  );
}

export default AdminRoutes;
