import axios from "axios";
import { URL_API_ADMIN } from "../../URL_Config";

export const GroupCourseAPI = {
  GetListGroupCourse: (data: { page: number; pageSize: number }) =>
    axios
      .post(`${URL_API_ADMIN}/group_course/danh-sach-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  AddGroupCourse: (data: { name_gr_course: string }) =>
    axios
      .post(`${URL_API_ADMIN}/group_course/them-moi-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  InfoGroupCourse: (data: { id_gr_course: number }) =>
    axios
      .post(`${URL_API_ADMIN}/group_course/info-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  UpdateGroupCourse: (data: { id_gr_course: number; name_gr_course: string }) =>
    axios
      .post(`${URL_API_ADMIN}/group_course/update-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  DeleteGroupCourse: (data: { id_gr_course: number }) =>
    axios
      .post(`${URL_API_ADMIN}/group_course/delete-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
};
