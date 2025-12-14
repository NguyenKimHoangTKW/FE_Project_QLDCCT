import axiosClient from "../axiosClient";

export const ViewSyllabusAPI = {
    GetListSyllabus: (data: { mssv: string }) =>
        axiosClient.post(`/de-cuong-chi-tiet`, data, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => res.data),
    GetPreviewSyllabus: (data: { id_course: number }) =>
        axiosClient.post(`/preview-de-cuong`, data, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => res.data),
}