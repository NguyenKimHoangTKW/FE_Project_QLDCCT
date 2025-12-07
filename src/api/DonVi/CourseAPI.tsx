import axiosClient from "../axiosClient";

export const CourseDonViAPI = {
  GetListCTDTByDonVi: () =>
    axiosClient
      .get(`/donvi/course/loads-ctdt-by-dv`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  GetListOptionCourse: () =>
    axiosClient
      .get(`/donvi/course/load-select-chuc-nang-course`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListCourseByKeyYear: (data: { id_key_year_semester: number, id_program: number }) =>
    axiosClient
      .post(`/donvi/course/loads-mon-hoc-dang-hoc-ky`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListCourse: (data: { id_gr_course: number, id_key_year_semester: number, id_semester: number, id_program: number, id_isCourse: number, Page: number; PageSize: number, searchTerm: string }) =>
    axiosClient
      .post(`/donvi/course/loads-danh-sach-mon-hoc-thuoc-don-vi`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  AddNewCourse: (data: { code_course: string, id_key_year_semester: number, id_semester: number, id_program: number, name_course: string, id_gr_course: number, credits: number, id_isCourse: number, totalPractice: number, totalTheory: number }) =>
    axiosClient 
      .post(`/donvi/course/them-moi-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  InfoCourse: (data: { id_course: number }) =>
    axiosClient
      .post(`/donvi/course/info-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  UpdateCourse: (data: { id_course: number, code_course: string, name_course: string, id_gr_course: number, id_key_year_semester: number, id_semester: number, credits: number, id_isCourse: number, totalPractice: number, totalTheory: number }) =>
    axiosClient
      .post(`/donvi/course/cap-nhat-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  DeleteCourse: (data: { id_course: number }) =>
    axiosClient
      .post(`/donvi/course/xoa-du-lieu-mon-hoc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  GetListLogCourse: (data: { id_course: number }) =>
    axiosClient
      .post(`/donvi/course/log-hoat-dong-de-cuong`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  UploadExcelCourse: async (file: File, idProgram: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_program", idProgram.toString());
    return await axiosClient.post(`/donvi/course/upload-excel-danh-sach-mon-hoc`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((res) => res.data);
  },
  LoadListUserWriteCourse: (data: { id_course: number }) =>
    axiosClient.post(`/donvi/course/loads-danh-sach-giang-vien-viet-de-cuong`, data, {
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
    axiosClient.post(
      `/donvi/course/export-danh-sach-mon-hoc-thuoc-don-vi`,
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
      axiosClient.post(
        `/donvi/course/export-danh-sach-mon-hoc-chua-co-de-cuong`,
        data,
        {
          responseType: "blob",
          withCredentials: true,
        }
      ),
};
