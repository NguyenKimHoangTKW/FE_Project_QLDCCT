import axiosClient from "../axiosClient";

export const StatisticalCLOAdminAPI = {
    GetListDonVi: () =>
        axiosClient
            .get(`/admin/statistical-clo/loads-don-vi`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCTDTByDonVi: (data: { id_faculty: number }) =>
        axiosClient
            .post(`/admin/statistical-clo/loads-ctdt-by-dv`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListOption: (data: { id_faculty: number }) =>
        axiosClient.post(`/admin/statistical-clo/loads-option`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    LoadSelectProgramLearningOutcome: (data: { id_faculty: number }) =>
        axiosClient.post(`/admin/statistical-clo/load-option-thong-ke-nhap-lieu`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetListStatisticalCLO: (data: { id_faculty: number, id_program: number, id_key_semester: number }) =>
        axiosClient.post(`/admin/statistical-clo/thong-ke-nhap-lieu-clo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}