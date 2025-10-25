import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const KeySemesterAPI = {
    GetListKeySemester: (data: { id_faculty: number, Page: number, PageSize: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/loads-danh-sach-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    AddNewKeySemester: (data: { name_key_year_semester: string, code_key_year_semester: string, id_faculty: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/them-moi-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    InfoKeySemester: (data: { id_key_year_semester: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/info-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    UpdateKeySemester: (data: { id_key_year_semester: number, name_key_year_semester: string, code_key_year_semester: string }) =>
        axios.post(`${URL_API_DONVI}/key-semester/cap-nhat-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    DeleteKeySemester: (data: { id_key_year_semester: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/xoa-du-lieu-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
}
export default KeySemesterAPI;