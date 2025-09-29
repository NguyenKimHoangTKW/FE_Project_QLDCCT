import { Route, Routes } from "react-router-dom";
import DanhSachNam from "../pages/CanBoVienChuc/Year";
import CivilServants from "../pages/CanBoVienChuc/CivilServants";
import FacultyInterface from "../pages/Faculty/Faculty";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="quan-li-can-bo-vien-chuc" element={<CivilServants />} />
      <Route path="quan-li-danh-sach-nam" element={<DanhSachNam />}></Route>
       <Route path="quan-li-danh-sach-don-vi" element={<FacultyInterface />}></Route>
    </Routes>
  );
}

export default AdminRoutes;
