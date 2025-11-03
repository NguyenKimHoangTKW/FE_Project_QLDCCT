import { useEffect, useState } from "react";
import { CreateTemplateAPI } from "../../../api/DonVi/CreateTemplateAPI";
import Select from "react-select";
import { SweetAlert } from "../../../components/ui/SweetAlert";

export default function CreateTemplateInterfaceDonVi() {
    const [listTemplate, setListTemplate] = useState<any[]>([]);
    interface FormData {
        id_template: number | null;
        section_name: string;
        section_code: string;
        is_required: string;
        order_index: number | null;
        id_contentType: number | null;
        id_dataBinding: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id_template: null,
        section_name: "",
        section_code: "",
        is_required: "",
        order_index: null,
        id_contentType: null,
        id_dataBinding: null,
    });
    const LoadSelectTemplate = async () => {
        const res = await CreateTemplateAPI.GetListCreateTemplate();
        const formatData = res.map((item: any) => ({
            value: item.id_template,
            label: item.template_name,
        })).filter((item: any) => item.value !== null);
        setListTemplate(formatData);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const CreateTemplateSection = async () => {
        const res = await CreateTemplateAPI.CreateTemplate({
            id_template: Number(formData.id_template),
            section_name: formData.section_name,
            section_code: formData.section_code,
            is_required: formData.is_required,
            order_index: Number(formData.order_index),
            id_contentType: Number(formData.id_contentType),
            id_dataBinding: Number(formData.id_dataBinding),
        });
        if (res.success) {
            SweetAlert("success", res.message);
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    useEffect(() => {
        LoadSelectTemplate();
    }, []);
    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Chuẩn đầu ra học phần
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <Select
                                        options={listTemplate}
                                        placeholder="Chọn mẫu đề cương"
                                        isClearable
                                        onChange={(option: any) => setFormData((prev) => ({
                                            ...prev,
                                            id_template: Number(option ? option.value : null),
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-primary">
                                        <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                </div>
            </div>
            <div id="smallBanner" className="small-banner fixed-footer">
                <button type="button" id="btnAddTitle" className="btn btn-primary m-r-5">
                    Tạo mới tiêu đề cha
                </button>
                <button type="button" id="btnAddChilTitle" className="btn btn-warning m-r-5">
                    Tạo mới tiêu đề con
                </button>
                <button type="button" id="btnSortTitle" className="btn btn-secondary m-r-5">
                    Sắp xếp lại thứ tự câu hỏi
                </button>
                <button
                    type="button"
                    id="btnXemTruocPhieuDaTao"
                    className="btn btn-info m-r-5"
                >
                    Xem trước Form phiếu khảo sát
                </button>
                <button type="button" id="btnXuatBanPhieu" className="btn btn-success m-r-5">
                    Xuất bản phiếu
                </button>
            </div>

        </div>
    )
}