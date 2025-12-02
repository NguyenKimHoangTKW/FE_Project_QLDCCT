import axios from "axios";
import { URL_API_ADMIN, URL_API_DONVI } from "../../URL_Config";

export const CivilServantsAPI = {

  GetListDonVi: () =>
    axios.get(`${URL_API_ADMIN}/civilservants/load-don-vi-by-civiservants`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  GetListCTDT: (data: { id_faculty: number }) =>
    axios.post(`${URL_API_ADMIN}/civilservants/load-ctdt-by-don-vi-civilservants`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),
  getAll: (data: { id_program: number, id_faculty: number, Page: number; PageSize: number }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants/loads-danh-sach-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }).then((res) => res.data),

  CreateNewCivilServant: (data: { id_faculty: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants/them-moi-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  InfoCivilServant: (data: { id_civilSer: number }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants/info-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  UpdateCivilServant: (data: { id_civilSer: number, code_civilSer: string, fullname_civilSer: string, email: string, birthday: string, id_program: number }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants/update-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  DeleteCivilServant: (data: { id_civilSer: number }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants/xoa-du-lieu-can-bo-vien-chuc`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
  
  UploadExcelCourse: async (file: File, idProgram: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id_program", idProgram.toString());
    return await axios.post(`${URL_API_ADMIN}/civilservants/upload-excel-danh-sach-giang-vien`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((res) => res.data);
  },
  ExportExcel: (data: {
    id_program: number,
    id_faculty: number,
  }) =>
    axios.post(
      `${URL_API_ADMIN}/civilservants/export-danh-sach-giang-vien-thuoc-don-vi`,
      data,
      {
        responseType: "blob",
        withCredentials: true,
      }
    ),
};
