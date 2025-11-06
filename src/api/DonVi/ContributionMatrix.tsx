import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const ContributionMatrixAPI = {
    GetOptionContributionMatrix: () =>
        axios.get(`${URL_API_DONVI}/contribution-matrix/loads-option-cm`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    LoadPLoPi: (data: { Id_Program: number }) =>
        axios.post(`${URL_API_DONVI}/contribution-matrix/loads-chuan-dau-ra-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListCourse: (data: { id_key_year_semester: number, id_program: number }) =>
        axios.post(`${URL_API_DONVI}/contribution-matrix/loads-ma-tran-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListMatrixContribution: (data: { id_key_year_semester: number, id_program: number }) =>
        axios.post(`${URL_API_DONVI}/contribution-matrix/get-matrix`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    SaveMatrix: (data: { id_course: number, Id_PI: number, id_levelcontributon: number }) =>
        axios.post(`${URL_API_DONVI}/contribution-matrix/save-matrix`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data)
}