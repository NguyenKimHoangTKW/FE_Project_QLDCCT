import { Route, Routes } from "react-router-dom";
import SemesterInterfaceDonVi from "../pages/Semester";
import KeySemesterInterfaceDonVi from "../pages/KeySemester";
import CourseInterfaceDonVi from "../../CTDT/pages/Course";
import SyllabusTempalteInterfaceDonVi from "../pages/SyllabusTempalte";
import CourseObjectivesInterfaceDonVi from "../pages/CourseObjectives";
import CourseLearningOutcomeInterfaceDonVi from "../pages/CourseLearningOutcome";
import ProgramLearningOutcomeInterfaceDonVi from "../pages/ProgramLearningOutcome";
import CreateTemplateInterfaceDonVi from "../pages/CreateTemplate";
import PreviewTemplateInterfaceDonVi from "../pages/PreviewTemplate";

function DonViRoutes() {
  return (
    <Routes>
           <Route path="danh-sach-hoc-ky-thuoc-donvi" element={<SemesterInterfaceDonVi />} />
           <Route path="danh-sach-khoa-hoc-thuoc-donvi" element={<KeySemesterInterfaceDonVi />} />
           <Route path="danh-sach-mon-hoc-thuoc-donvi" element={<CourseInterfaceDonVi />} />
           <Route path="danh-sach-mau-de-cuong" element={<SyllabusTempalteInterfaceDonVi />} />
           <Route path="danh-sach-muc-tieu-hoc-phan" element={<CourseObjectivesInterfaceDonVi />} />
           <Route path="danh-sach-chuan-dau-ra-hoc-phan" element={<CourseLearningOutcomeInterfaceDonVi />} />
           <Route path="danh-sach-chuan-dau-ra-ctdt" element={<ProgramLearningOutcomeInterfaceDonVi />} />
           <Route path="tao-moi-mau-de-cuong" element={<CreateTemplateInterfaceDonVi />} />
           <Route path="xem-truc-tuyen-mau-de-cuong/:id_template" element={<PreviewTemplateInterfaceDonVi />} />
    </Routes>
  );
}
export default DonViRoutes;
