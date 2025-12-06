import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";

export const ClassCTDTAPI = {
    GetListClass: (data: { id_program: number, Page: number, PageSize: number ,searchTerm: string }) =>
        axios.post(`${URL_API_CTDT}/class/list-class`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddNewClass: (data: { name_class: string ,id_program :number}) =>
        axios.post(`${URL_API_CTDT}/class/them-moi-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateClass: (data: { id_class: number, name_class: string }) =>
        axios.post(`${URL_API_CTDT}/class/update-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoClass: (data: { id_class: number }) =>
        axios.post(`${URL_API_CTDT}/class/info-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteClass: (data: { id_class: number }) =>
        axios.post(`${URL_API_CTDT}/class/delete-lop`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File, idProgram: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_program", idProgram.toString());
        return await axios.post(`${URL_API_CTDT}/class/upload-excel-danh-sach-lop`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_program: number
    }) =>
        axios.post(
            `${URL_API_CTDT}/class/export-danh-sach-lop`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}