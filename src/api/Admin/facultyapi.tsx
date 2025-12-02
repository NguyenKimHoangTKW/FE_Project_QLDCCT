import axios from "axios";
import { URL_API_ADMIN } from "../../URL_Config";

export const FacultyApi = {
  GetListFaculty: (data: { Page: number, PageSize: number }) =>
    axios.post(`${URL_API_ADMIN}/faculty/loads-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  AddNewFaculty: (data: { name_faculty: string, code_faculty: string }) =>
    axios.post(`${URL_API_ADMIN}/faculty/them-moi-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  UpdateFaculty: (data: { id_faculty: number, name_faculty: string, code_faculty: string }) =>
    axios.post(`${URL_API_ADMIN}/faculty/update-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  DeleteFaculty: (data: { id_faculty: number }) =>
    axios.post(`${URL_API_ADMIN}/faculty/xoa-thong-tin-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

  InfoFaculty: (data: { id_faculty: number }) =>
    axios.post(`${URL_API_ADMIN}/faculty/info-don-vi`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }).then((res) => res.data),

    UploadExcelCourse: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return await axios.post(`${URL_API_ADMIN}/faculty/upload-excel-khoa-vien-truong`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
        .then((res) => res.data);
    },
    ExportExcel: () =>
      axios.post(
        `${URL_API_ADMIN}/faculty/export-khoa-vien-truong`,
        {},
        {
          responseType: "blob",
          withCredentials: true,
        }
      ),

};
