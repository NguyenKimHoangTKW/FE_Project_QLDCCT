import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const CourseObjectivesAPI = {
    GetListCourseObjectives: (data: { Page: number; PageSize: number }) =>
        axios.post(`${URL_API_DONVI}/course-objectives/load-du-lieu-muc-tieu-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    AddCourseObjectives: (data: { name_CO: string, describe_CO: string, typeOfCapacity: string }) =>
        axios.post(`${URL_API_DONVI}/course-objectives/them-moi-muc-tieu-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoCourseObjectives: (data: { id: number }) =>
        axios.post(`${URL_API_DONVI}/course-objectives/info-muc-tieu-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateCourseObjectives: (data: { id: number, name_CO: string, describe_CO: string, typeOfCapacity: string }) =>
        axios.post(`${URL_API_DONVI}/course-objectives/update-muc-tieu-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteCourseObjectives: (data: { id: number }) =>
        axios.post(`${URL_API_DONVI}/course-objectives/xoa-du-lieu-muc-tieu-hoc-phan`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return await axios.post(`${URL_API_DONVI}/course-objectives/upload-excel-danh-sach-muc-tieu-hoc-phan`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: () =>
        axios.post(
            `${URL_API_DONVI}/course-objectives/export-danh-sach-muc-tieu-hoc-phan`,
            {},                   
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),

}