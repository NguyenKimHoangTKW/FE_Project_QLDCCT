import { Route, Routes } from "react-router-dom";
import ListWriteCourseDVDC from "../pages/ListWriteCourse";
import TemplateWriteSyllabusInterfaceGVDeCuong from "../pages/TemplateWriteSyllabus";
import PreviewTemplateSyllabusFinal from "../pages/PreviewTemplateSyllabusFinal";
import IndexGVDCinterface from "../pages/indexGVDCinterface";
import ViewAllNotificationGVDeCuong from "../pages/ViewAllNotification";


function GVDeCuongRoutes() {
  return (
    <Routes>
      <Route path="*" element={<IndexGVDCinterface />} />
      <Route path="danh-sach-de-cuong-duoc-phan-cong" element={<ListWriteCourseDVDC />} />
      <Route path="xem-truc-tuyen-mau-de-cuong/:id_syllabus" element={<TemplateWriteSyllabusInterfaceGVDeCuong />} />
      <Route path="xem-truc-tuyen-mau-de-cuong-preview/:id_syllabus" element={<PreviewTemplateSyllabusFinal />} />
      <Route path="xem-tat-ca-thong-bao" element={<ViewAllNotificationGVDeCuong />} />
    </Routes>
  );
}
export default GVDeCuongRoutes;
