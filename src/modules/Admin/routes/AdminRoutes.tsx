import { Route, Routes } from "react-router-dom";
import DanhSachNam from "../pages/CanBoVienChuc/Year";
import CivilServants from "../pages/CanBoVienChuc/CivilServants";
import FacultyInterface from "../pages/Faculty/Faculty";
import TrainingProgramInterface from "../pages/TrainingProgram/TrainingProgram";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="quan-li-can-bo-vien-chuc" element={<CivilServants />} />
      <Route path="quan-li-danh-sach-nam" element={<DanhSachNam />}></Route>
      <Route path="quan-li-danh-sach-don-vi" element={<FacultyInterface />}></Route>
      <Route path="quan-li-danh-sach-chuong-trinh-dao-tao" element={<TrainingProgramInterface />}></Route>
    </Routes>
  );
}

export default AdminRoutes;
