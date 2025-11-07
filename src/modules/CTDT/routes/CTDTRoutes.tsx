import { Route, Routes } from "react-router-dom";
import CivilServantsInterfaceCtdt from "../pages/CivilServants";
import CourseInterfaceCtdt from "../pages/Course";


function CTDTRoutes() {
  return (
    <Routes>
      <Route path="danh-sach-can-bo-vien-chuc" element={<CivilServantsInterfaceCtdt />} />
      <Route path="danh-sach-mon-hoc" element={<CourseInterfaceCtdt />} />
    </Routes>
  );
}
export default CTDTRoutes;
