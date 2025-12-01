import { Route, Routes } from "react-router-dom";
import CivilServantsInterfaceCtdt from "../pages/CivilServants";
import CourseInterfaceCtdt from "../pages/Course";
import PreviewTemplateSyllabus from "../pages/PreviewTemplateSyllabus";
import BrowseOutlineInterfaceCTDT from "../pages/BrowseOutline";
import IndexCTDTinterface from "../pages/indexCTDTinterface";
import ViewAllNotificationCTDT from "../pages/ViewAllNotification";
import ClassInterfaceCtdt from "../pages/Class";
import StudentInterfaceCtdt from "../pages/Student";
function CTDTRoutes() {
  return (
    <Routes>
      <Route path="*" element={<IndexCTDTinterface />} />
      <Route path="danh-sach-can-bo-vien-chuc" element={<CivilServantsInterfaceCtdt />} />
      <Route path="danh-sach-mon-hoc" element={<CourseInterfaceCtdt />} />
      <Route path="preview-syllabus/:id_syllabus/:check_view" element={<PreviewTemplateSyllabus />} />
      <Route path="danh-sach-de-cuong-can-duyet" element={<BrowseOutlineInterfaceCTDT />} />
      <Route path="xem-tat-ca-thong-bao" element={<ViewAllNotificationCTDT />} />
      <Route path="danh-sach-lop" element={<ClassInterfaceCtdt />} />
      <Route path="danh-sach-sinh-vien" element={<StudentInterfaceCtdt />} />
    </Routes>
  );
}
export default CTDTRoutes;
