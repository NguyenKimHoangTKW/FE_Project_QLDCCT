import axios from "axios";
import { URL_API_ADMIN } from "../../URL_Config";

export const FacultyApi = {
  loadNambyDonvi: () =>
    axios
      .get(`${URL_API_ADMIN}/faculty/loadsnambydonvi`)
      .then((res) => res.data),

  getAll: async (yearId: number, { page, pageSize, searchText }: any) => {
    const res = await axios.post(
      `${URL_API_ADMIN}/faculty/loadsdonvibynam/${yearId}`,
      { page, pageSize, searchText }
    );
    return res.data;
  },

  Add: (data: {
    code_faciulty: string;
    name_faculty: string;
    id_year: number;
  }) =>
    axios
      .post(`${URL_API_ADMIN}/faculty/them-moi-don-vi`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  info: (data: { id_faculty: number }) =>
    axios
      .post(`${URL_API_ADMIN}/faculty/info-don-vi`, data)
      .then((res) => res.data),

  update: (data: {
    id_faculty: number;
    code_faciulty: string;
    name_faculty: string;
  }) =>
    axios
      .post(`${URL_API_ADMIN}/faculty/update-don-vi`, data)
      .then((res) => res.data),

  delete: (id: number) =>
    axios
      .delete(`${URL_API_ADMIN}/faculty/xoa-thong-tin-don-vi/${id}`)
      .then((res) => res.data),
  uploadExcelKhoaVienTruong: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await axios.post(
      `${URL_API_ADMIN}/faculty/upload-excel-khoa-vien-truong`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};
