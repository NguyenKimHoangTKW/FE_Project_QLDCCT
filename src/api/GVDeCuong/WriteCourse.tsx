import axios from "axios";
import { URL_API_DVDC } from "../../URL_Config";
import axiosClient from "../axiosClient";

export const WriteCourseAPI = {
    GetListCourse: (data: { Page: number, PageSize: number, searchTerm: string }) =>
        axiosClient.post(`/gvdc/write-course/loads-danh-sach-de-cuong-can-soan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    GetListTeacherbyWriteCourse: (data: { id_course: number }) =>
        axiosClient.post(`/gvdc/write-course/danh-sach-giang-vien-viet-de-cuong-trong-mon-hoc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),

    CreateTemplateWriteCourse: (data: { id_teacherbysubject: number }) =>
        axiosClient.post(`/gvdc/write-course/tao-moi-mau-de-cuong-cho-mon-hoc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    InheritSyllabusTemplate: (data: { id_syllabus1: number, id_syllabus2: number, id_course: number }) =>
        axiosClient.post(`/gvdc/write-course/inherit-template-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RefundSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/preview-content-refund-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/delete-syllabus-1`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    RollbackSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/rollback-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RequestEditSyllabus: (data: { id_syllabus: number, edit_content: string }) =>
        axiosClient.post(`/gvdc/write-course/request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    CancelRequestEditSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/cancer-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    RequestWriteCourse: (data: { id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/request-write-course-by-user`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    ListRequestWriteCourse: (data: { id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/loads-list-join-write-course`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    AcceptJoinWriteCourse: (data: { id_ApproveUserSyllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/accept-join-write-course`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    RejectJoinWriteCourse: (data: { id_ApproveUserSyllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/reject-join-write-course`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RemoveJoinWriteCourse: (data: { id_ApproveUserSyllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/remove-join-write-course`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CloneSyllabus: (data: { id_teacherbysubject: number, id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/clone-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    SearchRequestWriteCourse: (data: { code_civilSer: string, id_syllabus: number }) =>
        axiosClient.post(`/gvdc/write-course/phan-quyen-gv-vao-phu-viet-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}