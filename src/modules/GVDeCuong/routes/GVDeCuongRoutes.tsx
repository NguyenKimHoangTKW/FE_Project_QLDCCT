import { Route, Routes } from "react-router-dom";
import ListWriteCourseDVDC from "../pages/ListWriteCourse";
import TemplateWriteSyllabusInterfaceGVDeCuong from "../pages/TemplateWriteSyllabus";
import PreviewTemplateSyllabusFinal from "../pages/PreviewTemplateSyllabusFinal";


function GVDeCuongRoutes() {
  return (
    <Routes>
      <Route path="danh-sach-de-cuong-duoc-phan-cong" element={<ListWriteCourseDVDC />} />
      <Route path="xem-truc-tuyen-mau-de-cuong/:id_syllabus" element={<TemplateWriteSyllabusInterfaceGVDeCuong />} />
      <Route path="xem-truc-tuyen-mau-de-cuong-preview/:id_syllabus" element={<PreviewTemplateSyllabusFinal />} />
    </Routes>
  );
}
export default GVDeCuongRoutes;
