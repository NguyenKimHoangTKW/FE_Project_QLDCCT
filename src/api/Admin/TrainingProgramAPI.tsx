import axiosClient from "../axiosClient";

export const TrainingProgramAPI = {
  GetListFaculty: () =>
    axiosClient.get(`/admin/program/loads-select-don-vi`, {
      withCredentials: true,
    }).then((res) => res.data),
  GetListProgram: (data: { id_faculty: number, Page: number, PageSize: number ,searchTerm: string}) =>
    axiosClient.post(`/admin/program/loads-ctdt-thuoc-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),
  AddNewProgram: (data: { id_faculty: number, code_program: string, name_program: string }) =>
    axiosClient.post(`/admin/program/them-moi-ctdt`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),
  InfoProgram: (data: { id_program: number }) =>
    axiosClient.post(`/admin/program/get-thong-tin-ctdt`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),
  UpdateProgram: (data: { id_program: number, id_faculty: number, code_program: string, name_program: string }) =>
    axiosClient.post(`/admin/program/cap-nhat-thong-tin-ctdt`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),
  DeleteProgram: (data: { id_program: number }) =>
    axiosClient.post(`/admin/program/xoa-du-lieu-ctdt`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  UploadExcel: async (file: File, idProgram: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_program", idProgram.toString());
    return await axiosClient.post(`/admin/program/upload-excel-chuong-trinh-dao-tao`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((res) => res.data);
  },
  ExportExcel: (data: {
    id_faculty: number
  }) =>
    axiosClient.post(
      `/admin/program/export-danh-sach-ctdt-thuoc-don-vi`,
      data,
      {
        responseType: "blob",
        withCredentials: true,
      }
    ),
};
