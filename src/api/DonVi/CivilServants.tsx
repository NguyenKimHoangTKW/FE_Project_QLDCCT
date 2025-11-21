import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const CivilServantsDonViAPI = {
    GetListCivilServants: (data: { id_program: number, Page: number, PageSize: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/loads-danh-sach-can-bo-vien-chuc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    GetListCTDTByDonVi: () =>
        axios
            .get(`${URL_API_DONVI}/civil-servants/loads-ctdt-by-don-vi`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    CreateNewCivilServant: (data: { code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/them-moi-can-bo-vien-chuc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    InfoCivilServant: (data: { id_civilSer: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/info-can-bo-vien-chuc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    UpdateCivilServant: (data: { id_civilSer: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/update-can-bo-vien-chuc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    DeleteCivilServant: (data: { id_civilSer: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/xoa-du-lieu-can-bo-vien-chuc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),

    ListTypePermission: () =>
        axios
            .get(`${URL_API_DONVI}/civil-servants/loads-type-permission`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),

    LoadInfoPermission: (data: { id_civilSer: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/get-permission-cbvc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    SavePermission: (data: { id_civilSer: number, id_type_users: number, status: number }) =>
        axios
            .post(`${URL_API_DONVI}/civil-servants/save-permission-cbvc`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    UploadExcelCourse: async (file: File, idProgram: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_program", idProgram.toString());
        return await axios.post(`${URL_API_DONVI}/civil-servants/upload-excel-danh-sach-giang-vien`, formData, {
            headers: { "Content-Type": "multipart/form-data" }, 
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_program: number,
    }) =>
        axios.post(
            `${URL_API_DONVI}/civil-servants/export-danh-sach-giang-vien-thuoc-don-vi`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}