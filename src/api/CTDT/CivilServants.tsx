import axiosClient from "../axiosClient";

export const CivilServantsCTDTAPI = {
    GetListCivilServantsCTDT: (data: { id_program: number, Page: number, PageSize: number, searchTerm: string }) =>
        axiosClient.post(`/ctdt/civil-servants/loads-danh-sach-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    CreateNewCivilServant: (data: { code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
        axiosClient.post(`/ctdt/civil-servants/them-moi-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoCivilServant: (data: { id_civilSer: number }) =>
        axiosClient.post(`/ctdt/civil-servants/info-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateCivilServant: (data: { id_civilSer: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
        axiosClient.post(`/ctdt/civil-servants/update-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteCivilServant: (data: { id_civilSer: number }) =>
        axiosClient.post(`/ctdt/civil-servants/xoa-du-lieu-can-bo-vien-chuc`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    LoadListCourseByCivilServant: (data: { id_civilSer: number }) =>
        axiosClient.post(`/ctdt/civil-servants/loads-list-de-cuong-by-gv`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}