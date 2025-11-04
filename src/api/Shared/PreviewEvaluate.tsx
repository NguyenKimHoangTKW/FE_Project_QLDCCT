import axios from "axios";
import { URL_API_SHARED } from "../../URL_Config";

export const PreviewEvaluateAPI = {
    PreviewCourseObjectives: () =>
        axios.get(`${URL_API_SHARED}/preview-course-objectives`, {
            withCredentials: true,
        }).then((res) => res.data),
    PreviewCourseLearningOutcome: () =>
        axios.get(`${URL_API_SHARED}/preview-course-learning-outcomes`, {
            withCredentials: true,
        }).then((res) => res.data),
    PreviewProgramLearningOutcome: (data: { id_program: number }) =>
        axios.post(`${URL_API_SHARED}/preview-program-learning-outcome`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}