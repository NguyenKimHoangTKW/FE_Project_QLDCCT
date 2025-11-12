import { Route, Routes } from "react-router-dom";
import ListWriteCourseDVDC from "../pages/ListWriteCourse";


function GVDeCuongRoutes() {
  return (
    <Routes>
      <Route path="danh-sach-de-cuong-duoc-phan-cong" element={<ListWriteCourseDVDC />} />
    </Routes>
  );
}
export default GVDeCuongRoutes;
