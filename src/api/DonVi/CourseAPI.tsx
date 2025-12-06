import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const CourseDonViAPI = {
  GetListCTDTByDonVi: () =>
    axios
      .get(`${URL_API_DONVI}/course/loads-ctdt-by-dv`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  GetListOptionCourse: () =>
    axios
      .get(`${URL_API_DONVI}/course/load-select-chuc-nang-course`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListCourseByKeyYear: (data: { id_key_year_semester: number, id_program: number }) =>
    axios
      .post(`${URL_API_DONVI}/course/loads-mon-hoc-dang-hoc-ky`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListCourse: (data: { id_gr_course: number, id_key_year_semester: number, id_semester: number, id_program: number, id_isCourse: number, Page: number; PageSize: number, searchTerm: string }) =>
    axios
      .post(`${URL_API_DONVI}/course/loads-danh-sach-mon-hoc-thuoc-don-vi`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  AddNewCourse: (data: { code_course: string, id_key_year_semester: number, id_semester: number, id_program: number, name_course: string, id_gr_course: number, credits: number, id_isCourse: number, totalPractice: number, totalTheory: number }) =>
    axios
      .post(`${URL_API_DONVI}/course/them-moi-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  InfoCourse: (data: { id_course: number }) =>
    axios
      .post(`${URL_API_DONVI}/course/info-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  UpdateCourse: (data: { id_course: number, code_course: string, name_course: string, id_gr_course: number, id_key_year_semester: number, id_semester: number, credits: number, id_isCourse: number, totalPractice: number, totalTheory: number }) =>
    axios
      .post(`${URL_API_DONVI}/course/cap-nhat-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  DeleteCourse: (data: { id_course: number }) =>
    axios
      .post(`${URL_API_DONVI}/course/xoa-du-lieu-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  GetListLogCourse: (data: { id_course: number }) =>
    axios
      .post(`${URL_API_DONVI}/course/log-hoat-dong-de-cuong`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  UploadExcelCourse: async (file: File, idProgram: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_program", idProgram.toString());
    return await axios.post(`${URL_API_DONVI}/course/upload-excel-danh-sach-mon-hoc`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((res) => res.data);
  },
  LoadListUserWriteCourse: (data: { id_course: number }) =>
    axios.post(`${URL_API_DONVI}/course/loads-danh-sach-giang-vien-viet-de-cuong`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    })
      .then((res) => res.data),
  ExportExcelCourse: (data: {
    id_gr_course: number,
    id_key_year_semester: number,
    id_semester: number,
    id_program: number,
    id_isCourse: number
  }) =>
    axios.post(
      `${URL_API_DONVI}/course/export-danh-sach-mon-hoc-thuoc-don-vi`,
      data,
      {
        responseType: "blob",
        withCredentials: true,
      }
    ), ExportExcelIsStatus: (data: {
      id_gr_course: number,
      id_key_year_semester: number,
      id_semester: number,
      id_program: number,
      id_isCourse: number
    }) =>
      axios.post(
        `${URL_API_DONVI}/course/export-danh-sach-mon-hoc-chua-co-de-cuong`,
        data,
        {
          responseType: "blob",
          withCredentials: true,
        }
      ),
};
