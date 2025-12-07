import axiosClient from "../axiosClient";

export const NotificationCTDTAPI = {
    GetNotificationCount: () =>
        axiosClient.get(`/ctdt/notification/count`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetNotificationList: () =>
        axiosClient.get(`/ctdt/notification/list`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ReadNotificationTrue: (data: { id_notification: number }) =>
        axiosClient.post(`/ctdt/notification/update-is-read-true`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    ReadNotificationFalse: (data: { id_notification: number }) =>
        axiosClient.post(`/ctdt/notification/update-is-read-false`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteNotification: (data: { id_notification: number }) =>
        axiosClient.post(`/ctdt/notification/delete`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UpdateAllNotificationFalse: () =>
        axiosClient.post(`/ctdt/notification/update-all-is-read-false`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UpdateAllNotificationTrue: () =>
        axiosClient.post(`/ctdt/notification/update-all-is-read-true`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteAllNotification: () =>
        axiosClient.post(`/ctdt/notification/delete-all`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetAllNotification: (data:{Page:number, PageSize:number}) =>
        axiosClient.post(`/ctdt/notification/view-all-notification`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
} 