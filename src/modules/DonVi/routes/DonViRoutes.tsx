import { Route, Routes } from "react-router-dom";
import SemesterInterfaceDonVi from "../pages/Semester";
import KeySemesterInterfaceDonVi from "../pages/KeySemester";
import CourseInterfaceDonVi from "../../CTDT/pages/Course";
import SyllabusTempalteInterfaceDonVi from "../pages/SyllabusTempalte";

function DonViRoutes() {
  return (
    <Routes>
           <Route path="danh-sach-hoc-ky-thuoc-donvi" element={<SemesterInterfaceDonVi />} />
           <Route path="danh-sach-khoa-hoc-thuoc-donvi" element={<KeySemesterInterfaceDonVi />} />
           <Route path="danh-sach-mon-hoc-thuoc-donvi" element={<CourseInterfaceDonVi />} />
           <Route path="danh-sach-mau-de-cuong" element={<SyllabusTempalteInterfaceDonVi />} />
    </Routes>
  );
}
export default DonViRoutes;
