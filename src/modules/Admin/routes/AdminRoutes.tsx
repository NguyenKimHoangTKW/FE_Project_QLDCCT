import { Route, Routes } from "react-router-dom";
import CivilServants from "../pages/CivilServants";
import FacultyInterface from "../pages/Faculty";
import TrainingProgramInterface from "../pages/TrainingProgram";
import UsersList from "../pages/UserList";
import GroupCourseInterface from "../pages/GroupCourse";
import UserPermissionPage from "../pages/UserPermissionPage";
import CourseInterfaceAdmin from "../pages/Course";
import ProgramLearningOutcomeInterfaceAdmin from "../pages/ProgramLearningOutcome";
import ContributionMatrixInterfaceAdmin from "../pages/ContributionMatrix";
import StatisticalCLOInterfaceAdmin from "../pages/StatisticalCLO";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="quan-li-can-bo-vien-chuc" element={<CivilServants />} />
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
      <Route path="quan-li-danh-sach-mon-hoc" element={<CourseInterfaceAdmin />}></Route>
      <Route path="quan-li-danh-sach-chuan-dau-ra-chuong-trinh-dao-tao" element={<ProgramLearningOutcomeInterfaceAdmin />}></Route>
      <Route path="quan-li-danh-sach-user/phan-quyen/:id_users" element={<UserPermissionPage />}></Route>
      <Route path="quan-li-ma-tran-dong-gop" element={<ContributionMatrixInterfaceAdmin />}></Route>
      <Route path="quan-li-thong-ke-nhap-lieu-clo" element={<StatisticalCLOInterfaceAdmin />}></Route>
    </Routes>
  );
}
export default AdminRoutes;
