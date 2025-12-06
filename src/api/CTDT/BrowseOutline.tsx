import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const BrowseOutlineAPI = {
    BrowseOutline: (data: { id_program: number, id_status: number, is_open_edit_final: number,PageSize: number, searchTerm: string  }) =>
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


    LoadLogSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/log-hoat-dong-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewRequestEditSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/preview-request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
        AcceptRequestEditSyllabus: (data: { id_syllabus: number }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/accept-request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CancelRequestEditSyllabus: (data: { id_syllabus: number, returned_content: string }) =>
        axios.post(`${URL_API_CTDT}/browse-outline/cancer-request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}