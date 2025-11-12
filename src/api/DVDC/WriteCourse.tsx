import axios from "axios";
import { URL_API_DVDC } from "../../URL_Config";

export const WriteCourseAPI = {
    GetListCourse: () =>
        axios.get(`${URL_API_DVDC}/write-course/loads-danh-sach-de-cuong-can-soan`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
    .then((res) => res.data),
}