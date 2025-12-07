import axiosClient from "../axiosClient";

export const BrowseOutlineAPI = {
    BrowseOutline: (data: { id_program: number, id_status: number, is_open_edit_final: number,PageSize: number, searchTerm: string  }) =>
        axiosClient.post(`/ctdt/browse-outline/loads-de-cuong-can-duyet`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    RefundSyllabus: (data: { id_syllabus: number, returned_content: string }) =>
        axiosClient.post(`/ctdt/browse-outline/refund-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ApproveSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/ctdt/browse-outline/approve-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),


    LoadLogSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/ctdt/browse-outline/log-hoat-dong-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    PreviewRequestEditSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/ctdt/browse-outline/preview-request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
        AcceptRequestEditSyllabus: (data: { id_syllabus: number }) =>
        axiosClient.post(`/ctdt/browse-outline/accept-request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CancelRequestEditSyllabus: (data: { id_syllabus: number, returned_content: string }) =>
        axiosClient.post(`/ctdt/browse-outline/cancer-request-edit-syllabus`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}