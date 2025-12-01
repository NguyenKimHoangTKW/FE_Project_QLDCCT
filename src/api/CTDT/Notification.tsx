import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const NotificationCTDTAPI = {
    GetNotificationCount: () =>
        axios.get(`${URL_API_CTDT}/notification/count`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetNotificationList: () =>
        axios.get(`${URL_API_CTDT}/notification/list`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    ReadNotificationTrue: (data: { id_notification: number }) =>
        axios.post(`${URL_API_CTDT}/notification/update-is-read-true`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    ReadNotificationFalse: (data: { id_notification: number }) =>
        axios.post(`${URL_API_CTDT}/notification/update-is-read-false`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteNotification: (data: { id_notification: number }) =>
        axios.post(`${URL_API_CTDT}/notification/delete`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UpdateAllNotificationFalse: () =>
        axios.post(`${URL_API_CTDT}/notification/update-all-is-read-false`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UpdateAllNotificationTrue: () =>
        axios.post(`${URL_API_CTDT}/notification/update-all-is-read-true`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteAllNotification: () =>
        axios.post(`${URL_API_CTDT}/notification/delete-all`, null, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    GetAllNotification: (data:{Page:number, PageSize:number}) =>
        axios.post(`${URL_API_CTDT}/notification/view-all-notification`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
} 