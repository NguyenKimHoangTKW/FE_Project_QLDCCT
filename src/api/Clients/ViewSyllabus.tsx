import axios from "axios";
import { URL_USER } from "../../URL_Config";

export const ViewSyllabusAPI = {
    GetListSyllabus: (data: { mssv: string }) =>
        axios.post(`${URL_USER}/de-cuong-chi-tiet`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetPreviewSyllabus: (data: { id_course: number }) =>
        axios.post(`${URL_USER}/preview-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}