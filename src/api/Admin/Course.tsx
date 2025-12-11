import axiosClient from "../axiosClient";

export const CourseAdminAPI = {
    GetListDonVi: () =>
        axiosClient
            .get(`/admin/course/loads-don-vi`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCTDTByDonVi: (data: { id_faculty: number }) =>
        axiosClient
            .post(`/admin/course/loads-ctdt-by-dv`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),

    GetListOptionCourse: (data: { id_faculty: number }) =>
        axiosClient
            .post(`/admin/course/load-select-chuc-nang-course`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCourseByKeyYear: (data: { id_key_year_semester: number, id_program: number }) =>
        axiosClient
            .post(`/admin/course/loads-mon-hoc-dang-hoc-ky`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCourse: (data: { id_faculty: number, id_gr_course: number, id_key_year_semester: number, id_semester: number, id_program: number, id_isCourse: number, Page: number; PageSize: number, searchTerm: string }) =>
        axiosClient
            .post(`/admin/course/loads-danh-sach-mon-hoc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),

    ExportExcel: (data: {
        id_gr_course: number,
        id_key_year_semester: number,
        id_semester: number,
        id_program: number,
        id_isCourse: number
    }) =>
        axiosClient.post(
            `/admin/course/export-danh-sach-mon-hoc`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
    ExportExcelIsStatus: (data: {
        id_gr_course: number,
        id_key_year_semester: number,
        id_semester: number,
        id_program: number,
        id_isCourse: number,
        id_faculty: number
    }) =>
        axiosClient.post(
            `/admin/course/export-danh-sach-mon-hoc-chua-co-de-cuong`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
};
