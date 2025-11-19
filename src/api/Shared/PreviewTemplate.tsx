import axios from "axios";
import { URL_PREVIEW } from "../../URL_Config";

export const PreviewTemplateAPI = {
    PreviewTemplate: (data: {
        id_syllabus: number,
    }) =>
        axios.post(`${URL_PREVIEW}/preview-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ListPLOCourse: (data: { id_syllabus: number }) =>
        axios.post(`${URL_PREVIEW}/loads-plo-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewLevelContribution: (data: { id_syllabus: number }) =>
        axios.post(`${URL_PREVIEW}/preview-level-contribution`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewMapPLObySyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_PREVIEW}/load-mapping-clo-by-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetMappingCLOPI: (data: { id_syllabus: number }) =>
        axios.post(`${URL_PREVIEW}/get-mapping-clo-pi`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

}