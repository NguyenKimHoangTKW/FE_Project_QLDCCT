
import axiosClient from "../axiosClient";

export const PreviewEvaluateAPI = {
    PreviewCourseObjectives: () =>
        axiosClient.get(`/evaluate/preview-course-objectives`, {
            withCredentials: true,
        }).then((res) => res.data),
    PreviewCourseLearningOutcome: () =>
        axiosClient.get(`/evaluate/preview-course-learning-outcomes`, {
            withCredentials: true,
        }).then((res) => res.data),
    PreviewProgramLearningOutcome: (data: { id_program: number }) =>
        axiosClient.post(`/evaluate/preview-program-learning-outcome`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}