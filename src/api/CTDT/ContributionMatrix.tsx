import axiosClient from "../axiosClient";
export const ContributionMatrixCTDTAPI = {
    GetOptionContributionMatrix: (data: { id_program: number }) =>
        axiosClient.post(`/ctdt/contribution-matrix/loads-option-cm`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    LoadPLoPi: (data: { Id_Program: number, id_key_semester: number }) =>
        axiosClient.post(`/ctdt/contribution-matrix/loads-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListCourse: (data: { id_key_year_semester: number, id_program: number }) =>
        axiosClient.post(`/ctdt/contribution-matrix/loads-ma-tran-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListMatrixContribution: (data: { id_key_year_semester: number, id_program: number }) =>
        axiosClient.post(`/ctdt/contribution-matrix/get-matrix`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    SaveMatrix: (data: { id_course: number, Id_PI: number, id_levelcontributon: number }) =>
        axiosClient.post(`/ctdt/contribution-matrix/save-matrix`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data)
}