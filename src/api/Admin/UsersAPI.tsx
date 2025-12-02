import axios from "axios";
import { URL_API_ADMIN } from "../../URL_Config";

export const UsersAPI = {
  getListTypeUsers: () =>
    axios
      .get(`${URL_API_ADMIN}/users/loads-select-type-users`, {
        withCredentials: true,
      })
      .then((res) => res.data),
  getLoadDanhSachUser: ( data: { id_type_users: number, Page: number; PageSize: number }) =>
    axios
      .post(`${URL_API_ADMIN}/users/loads-danh-sach-users`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  AddNew: (data: { email: string }) =>
    axios
      .post(`${URL_API_ADMIN}/users/them-moi-thu-cong-user`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  Delete: (id: number) =>
    axios
      .delete(`${URL_API_ADMIN}/users/xoa-users/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data),
  GetInfo: (data: { id_users: number }) =>
    axios
      .post(`${URL_API_ADMIN}/users/info-user`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListYear: () =>
    axios
      .get(`${URL_API_ADMIN}/year/loads-selected-year`, {
        withCredentials: true,
      })
      .then((res) => res.data),

  GetListDonVi: (data: { id_users: number }) =>
    axios
      .post(`${URL_API_ADMIN}/users/loads-danh-sach-don-vi`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListCTDT: (data: { id_users: number }) =>
    axios
      .post(`${URL_API_ADMIN}/users/loads-danh-sach-ctdt`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
  SavePermission: (data: {
    id_user: number | null;
    id_FacPro: number[] | null;
    name_permission: string;
    id_type_users: number
  }) =>
    axios
      .post(`${URL_API_ADMIN}/users/save-quyen-users`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
};
