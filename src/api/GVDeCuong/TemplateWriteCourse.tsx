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
}