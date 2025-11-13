import axios from "axios";
import { URL_API_DVDC } from "../../URL_Config";

export const WriteCourseAPI = {
    GetListCourse: () =>
        axios.get(`${URL_API_DVDC}/write-course/loads-danh-sach-de-cuong-can-soan`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
    .then((res) => res.data),
    GetListTeacherbyWriteCourse: (data: { id_course: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/danh-sach-giang-vien-viet-de-cuong-trong-mon-hoc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
    .then((res) => res.data),

    CreateTemplateWriteCourse: (data: { id_teacherbysubject: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/tao-moi-mau-de-cuong-cho-mon-hoc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
    .then((res) => res.data),
}