import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const TrainingProgramDonViAPI = {
    GetListFaculty: () =>
        axios.get(`${URL_API_DONVI}/program/loads-select-don-vi`, {
            withCredentials: true,
        }).then((res) => res.data),
    GetListProgram: (data: { id_faculty: number }) =>
        axios.post(`${URL_API_DONVI}/program/loads-ctdt-thuoc-don-vi`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddNewProgram: (data: { id_faculty: number, code_program: string, name_program: string }) =>
        axios.post(`${URL_API_DONVI}/program/them-moi-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoProgram: (data: { id_program: number }) =>
        axios.post(`${URL_API_DONVI}/program/get-thong-tin-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateProgram: (data: { id_program: number, id_faculty: number, code_program: string, name_program: string }) =>
        axios.post(`${URL_API_DONVI}/program/cap-nhat-thong-tin-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteProgram: (data: { id_program: number }) =>
        axios.post(`${URL_API_DONVI}/program/xoa-du-lieu-ctdt`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    UploadExcel: async (file: File, idProgram: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_program", idProgram.toString());
        return await axios.post(`${URL_API_DONVI}/program/upload-excel-chuong-trinh-dao-tao`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_faculty: number
    }) =>
        axios.post(
            `${URL_API_DONVI}/program/export-danh-sach-ctdt-thuoc-don-vi`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}