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
    LoadListUserWriteCourse: (data: { id_course: number }) =>
        axios.post(`${URL_API_CTDT}/course/loads-danh-sach-giang-vien-viet-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    GetListCourse: (data: { id_gr_course: number, id_key_year_semester: number, id_semester: number, id_program: number, id_isCourse: number, Page: number; PageSize: number,searchTerm: string }) =>
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

    SetUpTimeCourse: (data: { id_keyYearSemester: number, open_time: number, close_time: number }) =>
        axios.post(`${URL_API_CTDT}/course/set-up-time-open-course-by-key`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ListSyllabusByCourseFinal: (data: { id_course: number }) =>
        axios.post(`${URL_API_CTDT}/course/load-list-de-cuong-da-hoan-thien`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    LoadLogSyllabus: (data: { id_course: number }) =>
        axios.post(`${URL_API_CTDT}/course/log-hoat-dong-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File, idProgram: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_program", idProgram.toString());
        return await axios.post(`${URL_API_CTDT}/course/upload-excel-danh-sach-mon-hoc`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_gr_course: number,
        id_key_year_semester: number,
        id_semester: number,
        id_program: number,
        id_isCourse: number
    }) =>
        axios.post(
            `${URL_API_CTDT}/course/export-danh-sach-mon-hoc-thuoc-don-vi`,
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
        id_isCourse: number
    }) =>
        axios.post(
            `${URL_API_CTDT}/course/export-danh-sach-mon-hoc-chua-co-de-cuong`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
    ExportMultipleWord: (data: { id_key_year_semester: number }) =>
        axios.post(
            `${URL_API_CTDT}/course/export-multi-word`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),

}