import { Route, Routes } from "react-router-dom";
import CourseInterfaceCtdt from "../pages/Course";


function CTDTRoutes() {
  return (
    <Routes>
      <Route path="danh-sach-mon-hoc" element={<CourseInterfaceCtdt />} />

    </Routes>
  );
}
export default CTDTRoutes;
