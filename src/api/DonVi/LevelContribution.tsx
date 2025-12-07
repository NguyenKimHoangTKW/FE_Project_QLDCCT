import axiosClient from "../axiosClient";

export const LevelContributionAPI = {
    GetListLevelContribution: () =>
        axiosClient.get(`/donvi/level-contribution/loads-muc-do-dong-gop`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CreateLevelContribution: (data: { code: string, description: string }) =>
        axiosClient.post(`/donvi/level-contribution/them-moi-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoLevelContribution: (data: { id: number }) =>
        axiosClient.post(`/donvi/level-contribution/info-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateLevelContribution: (data: { id: number, code: string, description: string }) =>
        axiosClient.post(`/donvi/level-contribution/update-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteLevelContribution: (data: { id: number }) =>
        axiosClient.post(`/donvi/level-contribution/delete-muc-do-dong-gop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}