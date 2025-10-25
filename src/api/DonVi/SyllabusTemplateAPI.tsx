import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const SyllabusTemplateAPI = {
    GetListSyllabusTemplate: (data: { page: number; pageSize: number }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/load-mau-de-cuong`, data, {
            withCredentials: true,
        })
            .then((res) => res.data),
    AddSyllabusTemplate: (data: { template_name: string, is_default: number }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/them-moi-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    InfoSyllabusTemplate: (data: { id_template: number }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/info-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    UpdateSyllabusTemplate: (data: { id_template: number, template_name: string, is_default: number }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/cap-nhat-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
    DeleteSyllabusTemplate: (data: { id_template: number }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/xoa-du-lieu-mau-de-cuong`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
            .then((res) => res.data),
}
