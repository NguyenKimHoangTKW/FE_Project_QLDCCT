import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";
export const ListDonViPermissionAPI = {
    GetListDonViPermission: () =>
      axios
        .get(`${URL_API_DONVI}/permission/loads-donvi-by-permission`, {   
          withCredentials: true, 
        }).then((res) => res.data),
  };