import axiosClient from "../axiosClient";

export const NotificationGVDCAPI = {
    GetNotificationCount: () =>
        axiosClient.get(`/gvdc/notification/count`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetNotificationList: () =>
        axiosClient.get(`/gvdc/notification/list`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ReadNotificationTrue: (data: { id_notification: number }) =>
        axiosClient.post(`/gvdc/notification/update-is-read-true`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    ReadNotificationFalse: (data: { id_notification: number }) =>
        axiosClient.post(`/gvdc/notification/update-is-read-false`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteNotification: (data: { id_notification: number }) =>
        axiosClient.post(`/gvdc/notification/delete`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UpdateAllNotificationFalse: () =>
        axiosClient.post(`/gvdc/notification/update-all-is-read-false`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UpdateAllNotificationTrue: () =>
        axiosClient.post(`/gvdc/notification/update-all-is-read-true`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteAllNotification: () =>
        axiosClient.post(`/gvdc/notification/delete-all`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetAllNotification: (data:{Page:number, PageSize:number}) =>
        axiosClient.post(`/gvdc/notification/view-all-notification`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
} 