import axios from "axios";
import { URL_API_ADMIN } from "../../../URL_Config";

export const YearAPI = {
  getAll: (data: { page: number; pageSize: number }) =>
    axios
      .post(`${URL_API_ADMIN}/year/lay-du-lieu-nam-hoc`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  getById: (id: number) =>
    axios.get(`${URL_API_ADMIN}/year/${id}`).then((res) => res.data),

  create: (data: { name_year: string }) =>
    axios
      .post(`${URL_API_ADMIN}/year`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  update: (id: number, data: { name_year: string }) =>
    axios
      .put(`${URL_API_ADMIN}/year/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => res.data),

  delete: (id: number) =>
    axios.delete(`${URL_API_ADMIN}/year/${id}`).then((res) => res.data),
};
