import axios from "axios";
import { URL_API_DONVI } from "../../URL_Config";

export const CreateTemplateAPI = {
    GetListCreateTemplate: () =>
        axios.get(`${URL_API_DONVI}/syllabustemplate/load-selected-template`, {
            withCredentials: true,
        }).then((res) => res.data),

    CreateTemplate: (data: {
        id_template: number,
        section_name: string,
        section_code: string,
        is_required: string,
        order_index: number,
        id_contentType: number,
        id_dataBinding: number,
    }) =>
        axios.post(`${URL_API_DONVI}/syllabustemplate/create-template-section`, data, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        }).then((res) => res.data),
}