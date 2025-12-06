import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const SemesterAPIDonVi = {
    GetListSemester: (data: { id_faculty: number, Page: number, PageSize: number, searchTerm: string }) =>
        axios
            .post(`${URL_API_DONVI}/semester/loads-danh-sach-hoc-ky`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    AddNewSemester: (data: { name_semester: string, code_semester: string, id_faculty: number }) =>
        axios.post(`${URL_API_DONVI}/semester/them-moi-hoc-kyf`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoSemester: (data: { id_semester: number }) =>
        axios.post(`${URL_API_DONVI}/semester/info-hoc-ky`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateSemester: (data: { id_semester: number, name_semester: string, code_semester: string }) =>
        axios.post(`${URL_API_DONVI}/semester/update-hoc-kys`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteSemester: (data: { id_semester: number }) =>
        axios.post(`${URL_API_DONVI}/semester/delete-hoc-kys`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File, idFaculty: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_faculty", idFaculty.toString());
        return await axios.post(`${URL_API_DONVI}/semester/upload-excel-danh-sach-hoc-ky`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_faculty: number
    }) =>
        axios.post(
            `${URL_API_DONVI}/semester/export-danh-sach-hoc-ky-thuoc-don-vi`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}