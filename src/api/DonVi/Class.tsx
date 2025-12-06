import { URL_API_DONVI } from "../../URL_Config";
import axios from "axios";

export const ClassDVAPI = {
    GetListCTDTByDonVi: () =>
        axios.get(`${URL_API_DONVI}/class/loads-ctdt-by-dv`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListClass: (data: { id_program: number, Page: number, PageSize: number, searchTerm: string }) =>
        axios.post(`${URL_API_DONVI}/class/list-class`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddNewClass: (data: { name_class: string ,id_program :number}) =>
        axios.post(`${URL_API_DONVI}/class/them-moi-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateClass: (data: { id_class: number, name_class: string }) =>
        axios.post(`${URL_API_DONVI}/class/update-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoClass: (data: { id_class: number }) =>
        axios.post(`${URL_API_DONVI}/class/info-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteClass: (data: { id_class: number }) =>
        axios.post(`${URL_API_DONVI}/class/delete-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File, idProgram: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_program", idProgram.toString());
        return await axios.post(`${URL_API_DONVI}/class/upload-excel-danh-sach-lop`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_program: number
    }) =>
        axios.post(
            `${URL_API_DONVI}/class/export-danh-sach-lop`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
};