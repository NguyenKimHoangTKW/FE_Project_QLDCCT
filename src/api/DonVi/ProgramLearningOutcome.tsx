import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const ProgramLearningOutcomeAPI = {
    // Program Learning Outcome
    LoadSelectProgramLearningOutcome: () =>
        axios.get(`${URL_API_DONVI}/program-learning-outcome/load-option-plo`, {
            withCredentials: true,
        }).then((res) => res.data),
    GetListProgramLearningOutcome: (data: { Id_Program: number, id_key_semester: number,Page: number; PageSize: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/load-danh-sach-chuan-dau-ra-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddProgramLearningOutcome: (data: { code: string, Description: string, Id_Program: number , order_index: number, id_key_semester: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/them-moi-chuan-dau-ra-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoProgramLearningOutcome: (data: { Id_Plo: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/info-chuan-dau-ra-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateProgramLearningOutcome: (data: { Id_Plo: number, Code: string, Description: string, Id_Program: number ,order_index: number}) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/update-chuan-dau-ra-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteProgramLearningOutcome: (data: { Id_Plo: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/xoa-du-lieu-chuan-dau-ra-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    // Performance Indicators

    LoadListPerformanceIndicators: (data: { id_Plo: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/load-pi-thuoc-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddPerformanceIndicators: (data: { id_Plo: number, code_pi: string, description_pi: string, order_index_pi: number }) => {
        const formatFormData = {
            id_Plo: Number(data.id_Plo),
            code: data.code_pi,
            description: data.description_pi,
            order_index: Number(data.order_index_pi),
        }
        return axios.post(`${URL_API_DONVI}/program-learning-outcome/them-moi-pi-thuoc-plo`, formatFormData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data);
    },  
    InfoPerformanceIndicators: (data: { id_PI: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/thong-tin-pi-thuoc-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdatePerformanceIndicators: (data: { id_PI: number, code_pi: string, description_pi: string, order_index_pi: number }) => {
        const formatFormData = {
            id_PI: Number(data.id_PI),
            code: data.code_pi,
            description: data.description_pi,
            order_index: Number(data.order_index_pi),
        }
        return axios.post(`${URL_API_DONVI}/program-learning-outcome/cap-nhat-pi-thuoc-plo`, formatFormData, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data);
    },
    DeletePerformanceIndicators: (data: { id_PI: number }) =>
        axios.post(`${URL_API_DONVI}/program-learning-outcome/xoa-du-lieu-pi-thuoc-plo`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}