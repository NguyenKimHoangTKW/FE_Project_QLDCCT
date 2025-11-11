import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const CivilServantsCTDTAPI = {
    GetListCivilServantsCTDT: (data: { id_program: number, Page: number, PageSize: number }) =>
        axios.post(`${URL_API_CTDT}/civil-servants/loads-danh-sach-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CreateNewCivilServant: (data: { code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
        axios.post(`${URL_API_CTDT}/civil-servants/them-moi-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoCivilServant: (data: { id_civilSer: number }) =>
        axios.post(`${URL_API_CTDT}/civil-servants/info-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateCivilServant: (data: { id_civilSer: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
        axios.post(`${URL_API_CTDT}/civil-servants/update-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteCivilServant: (data: { id_civilSer: number }) =>
        axios.post(`${URL_API_CTDT}/civil-servants/xoa-du-lieu-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    LoadListCourseByCivilServant: (data: { id_civilSer: number }) =>
        axios.post(`${URL_API_CTDT}/civil-servants/loads-list-de-cuong-by-gv`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}