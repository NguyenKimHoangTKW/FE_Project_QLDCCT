import axios from "axios"
import { URL_API_CTDT } from "../../URL_Config"

export const GetListStudentCTDTAPI = {
    GetListClassByProgram: (data: { id_program: number }) =>
        axios.post(`${URL_API_CTDT}/student/get-list-class-by-program`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListStudent: (data: { id_program: number, id_class: number,Page: number, PageSize: number }) =>
        axios.post(`${URL_API_CTDT}/student/list-student`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddNewStudent: (data: { id_class: number, code_student: string, name_student: string }) =>
        axios.post(`${URL_API_CTDT}/student/them-moi-sinh-vien`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoStudent: (data: { id_student: number }) =>
        axios.post(`${URL_API_CTDT}/student/info-sinh-vien`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateStudent: (data: { id_student: number, id_class: number, code_student: string, name_student: string }) =>
        axios.post(`${URL_API_CTDT}/student/update-sinh-vien`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteStudent: (data: { id_student: number }) =>
        axios.post(`${URL_API_CTDT}/student/delete-sinh-vien`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File, idProgram: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_program", idProgram.toString());
        return await axios.post(`${URL_API_CTDT}/student/upload-excel-danh-sach-sinh-vien`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_program: number,
        id_class: number
    }) =>
        axios.post(
            `${URL_API_CTDT}/student/export-danh-sach-sinh-vien`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}