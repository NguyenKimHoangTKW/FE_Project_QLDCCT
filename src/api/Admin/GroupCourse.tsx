import axiosClient from "../axiosClient";

export const GroupCourseAPI = {
  GetListGroupCourse: (data: { page: number; pageSize: number }) =>
    axiosClient.post(`/admin/group_course/danh-sach-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  AddGroupCourse: (data: { name_gr_course: string }) =>
    axiosClient.post(`/admin/group_course/them-moi-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  InfoGroupCourse: (data: { id_gr_course: number }) =>
    axiosClient.post(`/admin/group_course/info-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  UpdateGroupCourse: (data: { id_gr_course: number; name_gr_course: string }) =>
    axiosClient.post(`/admin/group_course/update-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),

  DeleteGroupCourse: (data: { id_gr_course: number }) =>
    axiosClient.post(`/admin/group_course/delete-nhom-hoc-phan`, data, {
        withCredentials: true,
      })
      .then((res) => res.data),
};
