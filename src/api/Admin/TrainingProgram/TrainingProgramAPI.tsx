import axios from "axios";
import { URL_API_ADMIN } from "../../../URL_Config";

export const TrainingProgramAPI = {
    getSelectYear: () =>
        axios.get(`${URL_API_ADMIN}/program/loads-select-nam`).then((res) => res.data),

    getSelectFacultyByYear: (value_year: number) =>
        axios.get(`${URL_API_ADMIN}/program/loads-select-don-vi-by-year/${value_year}`).then((res) => res.data),

    getAllProgramCtdt: (idDonVi: number, data: { page: number, pageSize: number }) =>
        axios.post(`${URL_API_ADMIN}/program/loads-ctdt-thuoc-don-vi/${idDonVi}`, data).then((res) => res.data),

    AddNewProgram: (data: { id_faculty: number, code_program: string, name_program: string }) =>
        axios.post(`${URL_API_ADMIN}/program/them-moi-ctdt-thuoc-nam`, data).then((res) => res.data),

    GetInfoProgram: (data: { id_program: number }) =>
        axios.post(`${URL_API_ADMIN}/program/get-thong-tin-ctdt`, data).then((res) => res.data),

    UpdateInfoProgram: (data: { id_program: number, id_faculty: number, code_program: string, name_program: string }) =>
        axios.post(`${URL_API_ADMIN}/program/cap-nhat-thong-tin-ctdt`, data).then((res) => res.data),

    DeleteProgram: (id: number) =>
        axios.delete(`${URL_API_ADMIN}/program/xoa-du-lieu-ctdt/${id}`).then((res) => res.data)
}