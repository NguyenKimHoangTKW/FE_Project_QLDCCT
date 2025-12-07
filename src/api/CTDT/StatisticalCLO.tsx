import axiosClient from "../axiosClient";

export const StatisticalCLOCTDTAPI = {
    LoadSelectProgramLearningOutcome: (data: { Id_Program: number }) =>
        axiosClient.post(`/ctdt/statistical-plo/load-option-thong-ke-nhap-lieu`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetListStatisticalCLO: (data: { Id_Program: number, id_key_semester: number ,searchTerm: string}) =>
        axiosClient.post(`/ctdt/statistical-plo/thong-ke-nhap-lieu-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}