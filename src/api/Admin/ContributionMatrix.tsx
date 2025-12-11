import axiosClient from "../axiosClient";

export const ContributionMatrixAdminAPI = {
    GetListDonVi: () =>
        axiosClient
            .get(`/admin/contribution-matrix/loads-don-vi`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCTDTByDonVi: (data: { id_faculty: number }) =>
        axiosClient
            .post(`/admin/contribution-matrix/loads-ctdt-by-dv`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    LoadPLoPi: (data: { Id_Program: number, id_key_semester: number }) =>
        axiosClient.post(`/admin/contribution-matrix/loads-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListCourse: (data: { id_key_year_semester: number, id_program: number }) =>
        axiosClient.post(`/admin/contribution-matrix/loads-ma-tran-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetOptionContributionMatrix: (data: { id_faculty: number }) =>
        axiosClient.post(`/admin/contribution-matrix/loads-option-cm`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetListMatrixContribution: (data: {id_faculty: number, id_key_year_semester: number, id_program: number }) =>
        axiosClient.post(`/admin/contribution-matrix/get-matrix`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}