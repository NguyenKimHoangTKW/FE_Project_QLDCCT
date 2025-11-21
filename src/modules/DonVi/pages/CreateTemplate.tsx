import { useEffect, useState } from "react";
import { CreateTemplateAPI } from "../../../api/DonVi/CreateTemplateAPI";
import Select from "react-select";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Modal from "../../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
export default function CreateTemplateInterfaceDonVi() {
    const navigate = useNavigate();
    const [listTemplate, setListTemplate] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [checkTemplate, setCheckTemplate] = useState(0);
    const [listContentType, setListContentType] = useState<any[]>([]);
    const [listDataBinding, setListDataBinding] = useState<any[]>([]);
    const [listData, setListData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    interface FormData {
        id_template_section: number | null;
        id_template: number | null;
        section_name: string;
        section_code: string;
        allow_input: number | null;
        order_index: number | null;
        id_contentType: number | null;
        id_dataBinding: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id_template: null,
        id_template_section: null,
        section_name: "",
        section_code: "",
        allow_input: null,
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
        if (name === "id_template") {
            console.log(value);
        }
        if (name === "id_contentType") {
            setFormData((prev) => ({ ...prev, id_contentType: Number(value) }));
        }
        if (name === "id_dataBinding") {
            setFormData((prev) => ({ ...prev, id_dataBinding: Number(value) }));
        }
    }
    const LoadOptionSection = async () => {
        const res = await CreateTemplateAPI.GetListOptionContentType();
        setListContentType(res.contentType);
        setListDataBinding(res.dataBinding);
        setFormData((prev) => ({ ...prev, id_contentType: Number(res.contentType[0].id), id_dataBinding: Number(res.dataBinding[0].id), is_required: 1 }));
    }
    const InfoTemplateSection = async (id: number) => {
        const res = await CreateTemplateAPI.InfoTemplateSection({ id_template_section: Number(id) });
        if (res.success) {
            setFormData({
                id_template_section: Number(res.data.id_template_section),
                id_template: Number(res.data.id_template),
                section_name: res.data.section_name,
                section_code: res.data.section_code,
                allow_input: res.data.allow_input,
                order_index: res.data.order_index,
                id_contentType: res.data.id_contentType,
                id_dataBinding: res.data.id_dataBinding,
            });
            setModalMode("edit");
            setModalOpen(true);
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleAddNewTemplateSection = () => {
        if (checkTemplate > 0) {
            setModalMode("create");
            setModalOpen(true);
        }
        else {
            SweetAlert("error", "Vui lòng chọn mẫu đề cương");
            return;
        }
    }
    const handleUpdateTemplateSection = async () => {
        if (modalMode === "create") {
            setLoading(true);
            try {
                const res = await CreateTemplateAPI.CreateTemplate({
                    id_template: checkTemplate,
                    section_name: formData.section_name,
                    section_code: formData.section_code,
                    allow_input: Number(formData.allow_input),
                    order_index: Number(formData.order_index),
                    id_contentType: Number(formData.id_contentType),
                    id_dataBinding: Number(formData.id_dataBinding),
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataTemplate();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }

        }
        else {
            setLoading(true);
            try {
                const res = await CreateTemplateAPI.UpdateTemplateSection({
                    id_template_section: Number(formData.id_template_section),
                    section_name: formData.section_name,
                    section_code: formData.section_code,
                    allow_input: Number(formData.allow_input),
                    order_index: Number(formData.order_index),
                    id_contentType: Number(formData.id_contentType),
                    id_dataBinding: Number(formData.id_dataBinding),
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataTemplate();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }
        }
    }
    const loadDataTemplate = async () => {
        setLoading(true);
        try {
            const res = await CreateTemplateAPI.GetListData({ id_template: checkTemplate });
            if (res.success) {
                setListData(res.data);
                SweetAlert("success", res.message);
            }
            else {
                SweetAlert("error", res.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleDeleteTemplateSection = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa mục tiêu đề này và các dữ liệu liên quan khác, bạn muốn xóa?");
        if (confirm) {
            setLoading(true);
            try {
                const res = await CreateTemplateAPI.DeleteTemplateSection({ id_template_section: id });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataTemplate();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }
        }
    }
    const handleSaveTemplate = async () => {
        setLoading(true);
        try {
            const res = await CreateTemplateAPI.SaveTemplateSection({
                id_template: checkTemplate,
                template_json: JSON.stringify(listData),
            });
            if (res.success) {
                SweetAlert("success", res.message);
            }
            else {
                SweetAlert("error", res.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        LoadOptionSection();
        LoadSelectTemplate();
    }, []);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách dạng câu hỏi cho đề cương học phần
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
                                            id_template: Number(option.value),
                                        }))}
                                        onBlur={() => setCheckTemplate(Number(formData.id_template))}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-primary" onClick={loadDataTemplate}>
                                        <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSaveTemplate}>
                                        <i className="fas fa-save mr-1" /> Lưu dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="card mt-3">
                        <div className="card-body">
                            {listData.map((item) => (
                                <div
                                    key={item.id_template_section}
                                    className="card mb-4 border-0 shadow-sm"
                                >
                                    <div className="card-body bg-light rounded-3">
                                        <p className="text-muted mb-3">
                                            <i className="fas fa-list-ol me-3"></i>
                                            <span className="ms-1"> Thứ tự hiển thị: </span>
                                            <strong className="ms-2">{item.order_index}</strong>
                                        </p>

                                        <hr />
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="fw-bold text-dark mb-0">
                                                {item.section_code}. {item.section_name}
                                            </h5>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => InfoTemplateSection(item.id_template_section)}>
                                                    <i className="fas fa-edit me-1"></i> Sửa
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteTemplateSection(item.id_template_section)}>
                                                    <i className="fas fa-trash me-1"></i> Xóa
                                                </button>
                                            </div>
                                        </div>
                                        <hr />

                                        <div className="ps-2">
                                            <p className="text-primary mb-2">
                                                <strong className="text-dark">Dạng câu hỏi:</strong> {item.contentType}
                                            </p>
                                            <p className="text-primary mb-2">
                                                <strong className="text-dark">Cho phép nhập liệu:</strong> {item.allow_input}
                                            </p>
                                            <p className="text-primary mb-0">
                                                <strong className="text-dark">Liên kết dữ liệu:</strong> {item.dataBinding}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center border-top pt-3 d-flex justify-content-center gap-3 flex-wrap sticky-toolbar">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddNewTemplateSection}
                            >
                                <i className="fas fa-plus-circle me-1"></i> Tạo mới tiêu đề
                            </button>

                            <button
                                type="button"
                                id="btnPreviewTemplateCreated"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    window.open(
                                        `/donvi/xem-truc-tuyen-mau-de-cuong/${formData.id_template}`,
                                        "_blank"
                                    )
                                }
                            >
                                <i className="fas fa-eye me-1"></i> Xem trước mẫu đề cương
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                title={modalMode === "create" ? "Tạo mới tiêu đề" : "Chỉnh sửa tiêu đề"}
                onClose={() => setModalOpen(false)}
                onSave={handleUpdateTemplateSection}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Thứ tự hiển thị</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" name="order_index" value={formData.order_index ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Số thứ tự mục tiêu đề</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="section_code" value={formData.section_code ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên mục tiêu đề</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="section_name" value={formData.section_name ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Yêu cầu</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="allow_input" value={formData.allow_input ?? ""} onChange={handleInputChange} >
                                <option value="1">Cho phép nhập liệu</option>
                                <option value="0">Không cho phép nhập liệu</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Loại nội dung</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="id_contentType" value={formData.id_contentType ?? ""} onChange={handleInputChange} >
                                {listContentType.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Liên kết dữ liệu</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="id_dataBinding" value={formData.id_dataBinding ?? ""} onChange={handleInputChange} >
                                <option value="null">Bỏ qua</option>
                                {listDataBinding.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}