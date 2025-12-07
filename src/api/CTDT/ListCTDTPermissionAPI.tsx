import axiosClient from "../axiosClient";
export const ListCTDTPermissionAPI = {
    GetListCTDTPermission: () =>
      axiosClient.get(`/ctdt/permission/loads-ctdt-by-permission`, {   
          withCredentials: true, 
        }).then((res) => res.data),
  };