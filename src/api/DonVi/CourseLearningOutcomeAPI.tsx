import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const CourseLearningOutcomeAPI = {
    GetListCourseLearningOutcome: (data: { Page: number; PageSize: number }) =>
        axios.post(`${URL_API_DONVI}/course-learning-outcome/load-du-lieu-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddCourseLearningOutcome: (data: { name_CLO: string, describe_CLO: string, bloom_level: string }) =>
        axios.post(`${URL_API_DONVI}/course-learning-outcome/them-moi-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoCourseLearningOutcome: (data: { id: number }) =>
        axios.post(`${URL_API_DONVI}/course-learning-outcome/info-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateCourseLearningOutcome: (data: { id: number, name_CLO: string, describe_CLO: string, bloom_level: string }) =>
        axios.post(`${URL_API_DONVI}/course-learning-outcome/cap-nhat-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteCourseLearningOutcome: (data: { id: number }) =>
        axios.post(`${URL_API_DONVI}/course-learning-outcome/xoa-du-lieu-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}