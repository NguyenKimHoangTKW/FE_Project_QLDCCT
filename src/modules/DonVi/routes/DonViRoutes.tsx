import { Route, Routes } from "react-router-dom";
import SemesterInterfaceDonVi from "../pages/Semester";
import KeySemesterInterfaceDonVi from "../pages/KeySemester";
import SyllabusTempalteInterfaceDonVi from "../pages/SyllabusTempalte";
import CourseObjectivesInterfaceDonVi from "../pages/CourseObjectives";
import CourseLearningOutcomeInterfaceDonVi from "../pages/CourseLearningOutcome";
import ProgramLearningOutcomeInterfaceDonVi from "../pages/ProgramLearningOutcome";
import CreateTemplateInterfaceDonVi from "../pages/CreateTemplate";
import PreviewTemplateInterfaceDonVi from "../pages/PreviewTemplate";
import CourseInterfaceDonVi from "../pages/Course";
import CivilServantsInterfaceDonVi from "../pages/CivilServants";
import LevelContributionInterfaceDonVi from "../pages/LevelContribution";

function DonViRoutes() {
  return (
    <Routes>
      <Route path="danh-sach-mon-hoc-thuoc-donvi" element={<CourseInterfaceDonVi />} />
      <Route path="danh-sach-hoc-ky-thuoc-donvi" element={<SemesterInterfaceDonVi />} />
      <Route path="danh-sach-khoa-hoc-thuoc-donvi" element={<KeySemesterInterfaceDonVi />} />
      <Route path="danh-sach-mau-de-cuong" element={<SyllabusTempalteInterfaceDonVi />} />
      <Route path="danh-sach-muc-tieu-hoc-phan" element={<CourseObjectivesInterfaceDonVi />} />
      <Route path="danh-sach-chuan-dau-ra-hoc-phan" element={<CourseLearningOutcomeInterfaceDonVi />} />
      <Route path="danh-sach-chuan-dau-ra-ctdt" element={<ProgramLearningOutcomeInterfaceDonVi />} />
      <Route path="tao-moi-mau-de-cuong" element={<CreateTemplateInterfaceDonVi />} />
      <Route path="xem-truc-tuyen-mau-de-cuong/:id_template" element={<PreviewTemplateInterfaceDonVi />} />
      <Route path="quan-li-danh-sach-can-bo-vien-chuc" element={<CivilServantsInterfaceDonVi />} />
      <Route path="quan-li-danh-sach-muc-do-dong-gop" element={<LevelContributionInterfaceDonVi />} />
    </Routes>
  );
}
export default DonViRoutes;
