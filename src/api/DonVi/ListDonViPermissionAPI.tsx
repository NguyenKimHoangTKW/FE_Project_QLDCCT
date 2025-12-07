import axiosClient from "../axiosClient";
export const ListDonViPermissionAPI = {
    GetListDonViPermission: () =>
      axiosClient
        .get(`/donvi/permission/loads-donvi-by-permission`, {   
          withCredentials: true, 
        }).then((res) => res.data),
  };