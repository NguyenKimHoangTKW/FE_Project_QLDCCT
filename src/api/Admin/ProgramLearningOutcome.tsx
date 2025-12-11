import axiosClient from "../axiosClient";

export const ProgramLearningOutcomeAdminAPI = {
    GetListDonVi: () =>
        axiosClient
            .get(`/admin/program-learning-outcome/loads-don-vi`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCTDTByDonVi: (data: { id_faculty: number }) =>
        axiosClient
            .post(`/admin/program-learning-outcome/loads-ctdt-by-dv`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    LoadSelectProgramLearningOutcome: (data: { id_faculty: number }) =>
        axiosClient.post(`/admin/program-learning-outcome/load-option-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListProgramLearningOutcome: (data: { Id_Program: number, id_key_semester: number, Page: number; PageSize: number, searchTerm: string }) =>
        axiosClient.post(`/admin/program-learning-outcome/load-danh-sach-chuan-dau-ra-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    // Performance Indicators

    LoadListPerformanceIndicators: (data: { id_Plo: number }) =>
        axiosClient.post(`/admin/program-learning-outcome/load-pi-thuoc-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}