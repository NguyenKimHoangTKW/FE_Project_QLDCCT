import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const BrowseOutlineAPI = {
    BrowseOutline: (data: { id_program: number, id_status: number }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/loads-de-cuong-can-duyet`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RefundSyllabus: (data: { id_syllabus: number, returned_content: string }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/refund-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ApproveSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/approve-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}