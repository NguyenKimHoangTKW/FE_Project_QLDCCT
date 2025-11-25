import { Route, Routes } from "react-router-dom";
import CivilServantsInterfaceCtdt from "../pages/CivilServants";
import CourseInterfaceCtdt from "../pages/Course";
import PreviewTemplateSyllabus from "../pages/PreviewTemplateSyllabus";
import BrowseOutlineInterfaceCTDT from "../pages/BrowseOutline";
import IndexCTDTinterface from "../pages/indexCTDTinterface";
function CTDTRoutes() {
  return (
    <Routes>
      <Route path="*" element={<IndexCTDTinterface />} />
      <Route path="danh-sach-can-bo-vien-chuc" element={<CivilServantsInterfaceCtdt />} />
      <Route path="danh-sach-mon-hoc" element={<CourseInterfaceCtdt />} />
      <Route path="preview-syllabus/:id_syllabus/:check_view" element={<PreviewTemplateSyllabus />} />
      <Route path="danh-sach-de-cuong-can-duyet" element={<BrowseOutlineInterfaceCTDT />} />
    </Routes>
  );
}
export default CTDTRoutes;
