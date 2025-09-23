import axios from "axios";
import { URL_API_ADMIN } from "../../../URL_Config";

export default async function LoadDanhSachNam(){
    const res = await axios.get(`${URL_API_ADMIN}/load-danh-sach-nam`);
    const response = res.data;

    if (response.success) {
      return response.data; 
    } else {
      return response.message;
    }
}