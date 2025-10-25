import axios from "axios";
import { URL_API_CTDT } from "../../URL_Config";
export const ListCTDTPermissionAPI = {
    GetListCTDTPermission: () =>
      axios
        .get(`${URL_API_CTDT}/permission/loads-ctdt-by-permission`, {   
          withCredentials: true, 
        }).then((res) => res.data),
  };