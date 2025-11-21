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
    InheritSyllabusTemplate: (data: { id_syllabus1: number, id_syllabus2: number, id_course: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/inherit-template-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RefundSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/preview-content-refund-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/delete-syllabus-1`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    RollbackSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/rollback-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RequestEditSyllabus: (data: { id_syllabus: number, edit_content: string }) =>
        axios.post(`${URL_API_DVDC}/write-course/request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    CancelRequestEditSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-course/cancer-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}