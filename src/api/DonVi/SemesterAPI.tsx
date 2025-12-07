import axiosClient from "../axiosClient";

export const SemesterAPIDonVi = {
    GetListSemester: (data: { id_faculty: number, Page: number, PageSize: number, searchTerm: string }) =>
        axiosClient.post(`/donvi/semester/loads-danh-sach-hoc-ky`, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            .then((res) => res.data),
    AddNewSemester: (data: { name_semester: string, code_semester: string, id_faculty: number }) =>
        axiosClient.post(`/donvi/semester/them-moi-hoc-kyf`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoSemester: (data: { id_semester: number }) =>
        axiosClient.post(`/donvi/semester/info-hoc-ky`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateSemester: (data: { id_semester: number, name_semester: string, code_semester: string }) =>
        axiosClient.post(`/donvi/semester/update-hoc-kys`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    DeleteSemester: (data: { id_semester: number }) =>
        axiosClient.post(`/donvi/semester/delete-hoc-kys`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UploadExcel: async (file: File, idFaculty: number) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id_faculty", idFaculty.toString());
        return await axiosClient.post(`/donvi/semester/upload-excel-danh-sach-hoc-ky`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        })
            .then((res) => res.data);
    },
    ExportExcel: (data: {
        id_faculty: number
    }) =>
            axiosClient.post(
                `/donvi/semester/export-danh-sach-hoc-ky-thuoc-don-vi`,
            data,
            {
                responseType: "blob",
                withCredentials: true,
            }
        ),
}