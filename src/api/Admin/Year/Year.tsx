import axios from "axios";
import { URL_API_ADMIN } from "../../../URL_Config";

export const YearAPI = {
  getAll: () =>
    axios
      .get(`${URL_API_ADMIN}/year/load-danh-sach-nam`)
      .then((res) => res.data),

  getInfo: (data: { value_year: number }) =>
    axios
      .post(`${URL_API_ADMIN}/year/load-thong-tin-nam-hoc`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  AddNew: (data: { name_year: string }) =>
    axios
      .post(`${URL_API_ADMIN}/year/them-moi-nam-hoc`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  update: (data: { value_year: number; name_year: string }) =>
    axios
      .post(`${URL_API_ADMIN}/year/cap-nhat-nam-hoc`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),
};
