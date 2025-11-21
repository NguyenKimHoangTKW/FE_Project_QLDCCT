import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const KeySemesterAPI = {
    GetListKeySemester: (data: { id_faculty: number, Page: number, PageSize: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/loads-danh-sach-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    AddNewKeySemester: (data: { name_key_year_semester: string, code_key_year_semester: string, id_faculty: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/them-moi-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    InfoKeySemester: (data: { id_key_year_semester: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/info-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    UpdateKeySemester: (data: { id_key_year_semester: number, name_key_year_semester: string, code_key_year_semester: string }) =>
        axios.post(`${URL_API_DONVI}/key-semester/cap-nhat-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),
    DeleteKeySemester: (data: { id_key_year_semester: number }) =>
        axios.post(`${URL_API_DONVI}/key-semester/xoa-du-lieu-khoa-hoc`, data, {
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.data),

    UploadExcel: async (file: File, idFaculty: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_faculty", idFaculty.toString());
        return await axios.post(`${URL_API_DONVI}/key-semester/upload-excel-danh-sach-khoa-hoc`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_faculty: number
    }) =>
        axios.post(
            `${URL_API_DONVI}/key-semester/export-danh-sach-khoa-hoc-thuoc-don-vi`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}
export default KeySemesterAPI;