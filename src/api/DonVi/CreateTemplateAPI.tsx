import axiosClient from "../axiosClient";

export const CreateTemplateAPI = {
    GetListData: (data: { id_template: number }) =>
        axiosClient.post(`/donvi/syllabustemplate/loads-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListCreateTemplate: () =>
        axiosClient.get(`/donvi/syllabustemplate/load-selected-template`, {
            withCredentials: true,
        }).then((res) => res.data),
    GetListOptionContentType: () =>
        axiosClient.get(`/donvi/syllabustemplate/load-option-template-section`, {
            withCredentials: true,
        }).then((res) => res.data),

    CreateTemplate: (data: {
        id_template: number,
        section_name: string,
        section_code: string,
        allow_input: number,
        order_index: number,
        id_contentType: number,
        id_dataBinding: number,
    }) =>
        axiosClient.post(`/donvi/syllabustemplate/create-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoTemplateSection: (data: {
        id_template_section: number,
    }) =>
        axiosClient.post(`/donvi/syllabustemplate/info-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    UpdateTemplateSection: (data: {
        id_template_section: number,
        section_name: string,
        section_code: string,
        allow_input: number,
        order_index: number,
        id_contentType: number,
        id_dataBinding: number,
    }) =>
        axiosClient.post(`/donvi/syllabustemplate/update-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteTemplateSection: (data: {
        id_template_section: number,
    }) =>
        axiosClient.post(`/donvi/syllabustemplate/delete-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    SaveTemplateSection: (data: {
        id_template: number,
        template_json: string,
    }) =>
        axiosClient.post(`/donvi/syllabustemplate/save-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),


    PreviewTemplate: (data: {
        id_template: number,
    }) =>
        axiosClient.post(`/donvi/syllabustemplate/preview-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    LoadSelectedProgram: () =>
        axiosClient.get(`/donvi/syllabustemplate/loads-selected-program`, {
            withCredentials: true,
        }).then((res) => res.data),
    ListPLOCourse: () =>
        axiosClient.get(`/donvi/syllabustemplate/loads-plo-hoc-phan`, {
            withCredentials: true,
        }).then((res) => res.data),
}