import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const CourseCTDTAPI = {
    GetListOptionCourse: (data: { id_program: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/load-select-chuc-nang-course`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),

    GetListCourse: (data: { id_gr_course: number, id_key_year_semester: number, id_semester: number, id_program: number, id_isCourse: number, Page: number; PageSize: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/loads-danh-sach-mon-hoc-thuoc-ctdt`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCourseByKeyYear: (data: { id_key_year_semester: number, id_program: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/loads-mon-hoc-dang-hoc-ky`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    AddNewCourse: (data: { code_course: string, id_key_year_semester: number, id_semester: number, id_program: number, name_course: string, id_gr_course: number, credits: number, id_isCourse: number, totalPractice: number, totalTheory: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/them-moi-mon-hoc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    InfoCourse: (data: { id_course: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/info-mon-hoc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    UpdateCourse: (data: { id_course: number, code_course: string, name_course: string, id_gr_course: number, id_key_year_semester: number, id_semester: number, credits: number, id_isCourse: number, totalPractice: number, totalTheory: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/cap-nhat-mon-hoc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    DeleteCourse: (data: { id_course: number }) =>
        axios
            .post(`${URL_API_CTDT}/course/xoa-du-lieu-mon-hoc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    LoadInfoPermissionCourse: (data: { id_course: number }) =>
        axios.post(`${URL_API_CTDT}/course/loads-giang-vien-de-cuong-by-mon-hoc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    SavePermissionCourse: (data: { id_program: number, code_civilSer: string, id_course: number }) =>
        axios.post(`${URL_API_CTDT}/course/save-phan-quyen-viet-de-cuong-cbvc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeletePermissionCourse: (data: { id_teacherbysubject: number }) =>
        axios.post(`${URL_API_CTDT}/course/delete-permission-gv-ra-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}