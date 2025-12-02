import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const StatisticalCLODonViAPI = {
    GetListCTDTByDonVi: () =>
        axios.get(`${URL_API_DONVI}/statistical-clo/loads-ctdt-by-dv`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    LoadSelectProgramLearningOutcome: (data: { Id_Program: number }) =>
        axios.post(`${URL_API_DONVI}/statistical-clo/load-option-thong-ke-nhap-lieu`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetListStatisticalCLO: (data: { Id_Program: number, id_key_semester: number }) =>
        axios.post(`${URL_API_DONVI}/statistical-clo/thong-ke-nhap-lieu-clo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}