import axiosClient from "../axiosClient";

export const FacultyApi = {
  GetListFaculty: (data: { Page: number, PageSize: number }) =>
    axiosClient.post(`/admin/faculty/loads-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  AddNewFaculty: (data: { name_faculty: string, code_faculty: string }) =>
    axiosClient.post(`/admin/faculty/them-moi-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  UpdateFaculty: (data: { id_faculty: number, name_faculty: string, code_faculty: string }) =>
    axiosClient.post(`/admin/faculty/update-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  DeleteFaculty: (data: { id_faculty: number }) =>
    axiosClient.post(`/admin/faculty/xoa-thong-tin-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  InfoFaculty: (data: { id_faculty: number }) =>
    axiosClient.post(`/admin/faculty/info-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

    UploadExcelCourse: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await axiosClient.post(`/admin/faculty/upload-excel-khoa-vien-truong`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
        .then((res) => res.data);
    },
    ExportExcel: () =>
      axiosClient.post(
        `/admin/faculty/export-khoa-vien-truong`,
        {},
        {
          responseType: "blob",
          withCredentials: true,
        }
      ),

};
