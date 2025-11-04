import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const CreateTemplateAPI = {
    GetListData: (data: { id_template: number }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/loads-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    GetListCreateTemplate: () =>
        axios.get(`${URL_API_DONVI}/syllabustemplate/load-selected-template`, {
            withCredentials: true,
        }).then((res) => res.data),
    GetListOptionContentType: () =>
        axios.get(`${URL_API_DONVI}/syllabustemplate/load-option-template-section`, {
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
        axios.post(`${URL_API_DONVI}/syllabustemplate/create-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
    InfoTemplateSection: (data: {
        id_template_section: number,
    }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/info-template-section`, data, {
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
        axios.post(`${URL_API_DONVI}/syllabustemplate/update-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    DeleteTemplateSection: (data: {
        id_template_section: number,
    }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/delete-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    SaveTemplateSection: (data: {
        id_template: number,
        template_json: string,
    }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/save-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),


    PreviewTemplate: (data: {
        id_template: number,
    }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/preview-template`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),

    LoadSelectedProgram: () =>
        axios.get(`${URL_API_DONVI}/syllabustemplate/loads-selected-program`, {
            withCredentials: true,
        }).then((res) => res.data),
}