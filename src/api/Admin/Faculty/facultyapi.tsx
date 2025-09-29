import axios from "axios"
import { URL_API_ADMIN } from "../../../URL_Config"


export const FacultyApi = {
    loadNambyDonvi: () =>
        axios.get(`${URL_API_ADMIN}/faculty/loadsnambydonvi`).then((res) => res.data),

    getAll: (id: number, data: { page: number; pageSize: number }) =>
        axios.post(`${URL_API_ADMIN}/faculty/loadsdonvibynam/${id}`, data).then((res) => res.data),

    Add: (data: { code_faciulty: string, name_faculty: string, id_year: number }) =>
        axios.post(`${URL_API_ADMIN}/faculty`, data).then((res) => res.data),

    info: (data: { id_faculty: number }) =>
        axios.post(`${URL_API_ADMIN}/faculty/info-don-vi`, data).then((res) => res.data),

    update: (data: { id_faculty: number, code_faciulty: string, name_faculty: string }) =>
        axios.post(`${URL_API_ADMIN}/faculty/update-don-vi`, data).then((res) => res.data),

    delete: (id: number) =>
        axios.delete(`${URL_API_ADMIN}/faculty/xoa-thong-tin-don-vi/${id}`).then((res) => res.data)
}