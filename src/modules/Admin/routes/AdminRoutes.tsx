import { Route, Routes } from "react-router-dom";
import DanhSachNam from "../pages/Year";
import CivilServants from "../pages/CivilServants";
import FacultyInterface from "../pages/Faculty";
import TrainingProgramInterface from "../pages/TrainingProgram";
import UsersList from "../pages/UserList";
import GroupCourseInterface from "../pages/GroupCourse";
import UserPermissionPage from "../pages/UserPermissionPage";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="quan-li-can-bo-vien-chuc" element={<CivilServants />} />
      <Route path="quan-li-danh-sach-nam" element={<DanhSachNam />}></Route>
      <Route
        path="quan-li-danh-sach-don-vi"
        element={<FacultyInterface />}
      ></Route>
      <Route
        path="quan-li-danh-sach-chuong-trinh-dao-tao"
        element={<TrainingProgramInterface />}
      ></Route>
      <Route path="quan-li-danh-sach-user" element={<UsersList />}></Route>

      <Route path="quan-li-danh-sach-nhom-hoc-phan" element={<GroupCourseInterface />}></Route>

      <Route path="quan-li-danh-sach-user/phan-quyen/:id_users" element={<UserPermissionPage />}></Route>
    </Routes>
  );
}
export default AdminRoutes;
