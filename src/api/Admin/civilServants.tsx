import axiosClient from "../axiosClient";

export const CivilServantsAPI = {

  GetListDonVi: () =>
    axiosClient.get(`/admin/civilservants/load-don-vi-by-civiservants`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  GetListCTDT: (data: { id_faculty: number }) =>
    axiosClient.post(`/admin/civilservants/load-ctdt-by-don-vi-civilservants`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),
  getAll: (data: { id_program: number, id_faculty: number, Page: number; PageSize: number }) =>
    axiosClient.post(`/admin/civilservants/loads-danh-sach-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((res) => res.data),

  CreateNewCivilServant: (data: { id_faculty: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
    axiosClient.post(`/admin/civilservants/them-moi-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  InfoCivilServant: (data: { id_civilSer: number }) =>
    axiosClient.post(`/admin/civilservants/info-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  UpdateCivilServant: (data: { id_civilSer: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
    axiosClient.post(`/admin/civilservants/update-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  DeleteCivilServant: (data: { id_civilSer: number }) =>
    axiosClient.post(`/admin/civilservants/xoa-du-lieu-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  
  UploadExcelCourse: async (file: File, idProgram: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_program", idProgram.toString());
    return await axiosClient.post(`/admin/civilservants/upload-excel-danh-sach-giang-vien`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((res) => res.data);
  },
  ExportExcel: (data: {
    id_program: number,
    id_faculty: number,
  }) =>
    axiosClient.post(
      `/admin/civilservants/export-danh-sach-giang-vien-thuoc-don-vi`,
      data,
      {
        responseType: "blob",
        withCredentials: true,
      }
    ),
};
