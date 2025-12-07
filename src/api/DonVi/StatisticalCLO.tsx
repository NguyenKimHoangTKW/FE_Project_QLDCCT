import axiosClient from "../axiosClient";

export const StatisticalCLODonViAPI = {
    GetListCTDTByDonVi: () =>
        axiosClient.get(`/donvi/statistical-clo/loads-ctdt-by-dv`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    LoadSelectProgramLearningOutcome: (data: { Id_Program: number }) =>
        axiosClient.post(`/donvi/statistical-clo/load-option-thong-ke-nhap-lieu`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetListStatisticalCLO: (data: { Id_Program: number, id_key_semester: number }) =>
        axiosClient.post(`/donvi/statistical-clo/thong-ke-nhap-lieu-clo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}