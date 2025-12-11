import axiosClient from "../axiosClient";

export const UsersAPI = {
  getListTypeUsers: () =>
    axiosClient.get(`/admin/users/loads-select-type-users`, {
        withCredentials: true,
      })
      .then((res) => res.data),
  getLoadDanhSachUser: ( data: { id_type_users: number, Page: number; PageSize: number, searchTerm: string }) =>
    axiosClient.post(`/admin/users/loads-danh-sach-users`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  AddNew: (data: { email: string }) =>
    axiosClient.post(`/admin/users/them-moi-thu-cong-user`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),

  Delete: (id: number) =>
    axiosClient.delete(`/admin/users/xoa-users/${id}`, {
        withCredentials: true,
      })
      .then((res) => res.data),
  GetInfo: (data: { id_users: number }) =>
    axiosClient.post(`/admin/users/info-user`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListYear: () =>
    axiosClient.get(`/admin/year/loads-selected-year`, {
        withCredentials: true,
      })
      .then((res) => res.data),

  GetListDonVi: (data: { id_users: number }) =>
    axiosClient.post(`/admin/users/loads-danh-sach-don-vi`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
  GetListCTDT: (data: { id_users: number }) =>
    axiosClient.post(`/admin/users/loads-danh-sach-ctdt`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
  SavePermission: (data: {
    id_user: number | null;
    id_FacPro: number[] | null;
    name_permission: string;
    id_type_users: number
  }) =>
    axiosClient.post(`/admin/users/save-quyen-users`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => res.data),
};
