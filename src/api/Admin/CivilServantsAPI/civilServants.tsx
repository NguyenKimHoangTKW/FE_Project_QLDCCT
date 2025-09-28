import axios from "axios";
import { URL_API_ADMIN } from "../../../URL_Config";

export const CivilServantsAPI = {
  getAll: (data: { page: number; pageSize: number }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  create: (data: {
    code_civilSer: string;
    fullname_civilSer: string;
    email: string;
    birthday: string | null;
    value_year: number;
  }) =>
    axios
      .post(`${URL_API_ADMIN}/civilservants/add-new`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  getInfo: (id: number) =>
    axios
      .get(`${URL_API_ADMIN}/civilservants/load-thong-tin/${id}`)
      .then((res) => res.data),

  update: (
    id: number,
    data: {
      code_civilSer: string;
      fullname_civilSer: string;
      email: string;
      birthday: Date;
      value_year: number;
    }
  ) =>
    axios
      .put(`${URL_API_ADMIN}/civilservants/update/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),
  loadYearOption: () =>
    axios
      .get(`${URL_API_ADMIN}/civilservants/load-option-civilservants`)
      .then((res) => res.data),
};
