
import axiosClient from "../axiosClient";

export const PreviewTemplateAPI = {
    PreviewTemplate: (data: {
        id_syllabus: number,
    }) =>
        axiosClient.post(`/preview/preview-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ListPLOCourse: (data: { id_syllabus: number }) =>
        axiosClient.post(`/preview/loads-plo-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewLevelContribution: (data: { id_syllabus: number }) =>
        axiosClient.post(`/preview/preview-level-contribution`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewMapPLObySyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/preview/load-mapping-clo-by-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetMappingCLOPI: (data: { id_syllabus: number }) =>
        axiosClient.post(`/preview/get-mapping-clo-pi`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

}