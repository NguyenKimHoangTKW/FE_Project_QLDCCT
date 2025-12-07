import axiosClient from "../axiosClient";

export const SyllabusTemplateAPI = {
    GetListSyllabusTemplate: (data: { page: number; pageSize: number }) =>
        axiosClient.post(`/donvi/syllabustemplate/load-mau-de-cuong`, data, {
            withCredentials: true,
        })
            .then((res) => res.data),
    AddSyllabusTemplate: (data: { template_name: string, is_default: number }) =>
        axiosClient.post(`/donvi/syllabustemplate/them-moi-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    InfoSyllabusTemplate: (data: { id_template: number }) =>
        axiosClient.post(`/donvi/syllabustemplate/info-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    UpdateSyllabusTemplate: (data: { id_template: number, template_name: string, is_default: number }) =>
        axiosClient.post(`/donvi/syllabustemplate/cap-nhat-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    DeleteSyllabusTemplate: (data: { id_template: number }) =>
        axiosClient.post(`/donvi/syllabustemplate/xoa-du-lieu-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
}
