import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const StatisticalCLOCTDTAPI = {
    LoadSelectProgramLearningOutcome: (data: { Id_Program: number }) =>
        axios.post(`${URL_API_CTDT}/statistical-plo/load-option-thong-ke-nhap-lieu`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetListStatisticalCLO: (data: { Id_Program: number, id_key_semester: number ,searchTerm: string}) =>
        axios.post(`${URL_API_CTDT}/statistical-plo/thong-ke-nhap-lieu-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}