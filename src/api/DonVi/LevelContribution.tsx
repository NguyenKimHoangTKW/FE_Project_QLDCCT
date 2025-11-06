import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const LevelContributionAPI = {
    GetListLevelContribution: () =>
        axios.get(`${URL_API_DONVI}/level-contribution/loads-muc-do-dong-gop`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CreateLevelContribution: (data: { code: string, description: string }) =>
        axios.post(`${URL_API_DONVI}/level-contribution/them-moi-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoLevelContribution: (data: { id: number }) =>
        axios.post(`${URL_API_DONVI}/level-contribution/info-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateLevelContribution: (data: { id: number, code: string, description: string }) =>
        axios.post(`${URL_API_DONVI}/level-contribution/update-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteLevelContribution: (data: { id: number }) =>
        axios.post(`${URL_API_DONVI}/level-contribution/delete-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}