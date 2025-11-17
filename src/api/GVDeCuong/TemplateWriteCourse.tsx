import axios from "axios";
import { URL_API_DVDC } from "../../URL_Config";

export const TemplateWriteCourseAPI = {
    PreviewTemplate: (data: {
        id_syllabus: number,
    }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/preview-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ListPLOCourse: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/loads-plo-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    PreviewCourseObjectives: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/preview-course-objectives`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewCourseLearningOutcome: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/preview-course-learning-outcomes`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewProgramLearningOutcome: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/preview-program-learning-outcome`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    PreviewLevelContribution: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/preview-level-contribution`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    PreviewMapPLObySyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/load-mapping-clo-by-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    AddNewMappingCLO: (data: { id: number, id_syllabus: number, map_clo: string, description: string }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/save-mapping-clo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteMappingCLO: (data: { id: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/delete-mapping-clo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    SaveMappingCLOPI: (data: any[]) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/save-mapping-clo-pi`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then(res => res.data),
    GetMappingCLOPI: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/get-mapping-clo-pi`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    SaveFinalSyllabus: (data: { id_syllabus: number, data: any[] }) =>
        axios.post(`${URL_API_DVDC}/write-template-syllabus/save-final`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

}