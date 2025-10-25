import { useEffect, useState } from "react";
import { SyllabusTemplateAPI } from "../../../api/DonVi/SyllabusTemplateAPI";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";

function SyllabusTempalteInterfaceDonVi() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [allData, setAllData] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");

    interface SyllabusTemplate {
        id_template: number | null;
        template_name: string;
        is_default: number | null;
    }
    const [formData, setFormData] = useState<SyllabusTemplate>({
        id_template: null,
        template_name: "",
        is_default: null,
    });
    const resetFormData = () => {
        setFormData({
            id_template: null,
            template_name: "",
            is_default: null,
        });
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const headers = [
        { label: "STT", key: "" },
        { label: "Tên mẫu đề cương", key: "template_name" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "Trạng thái", key: "is_default" },
        { label: "*", key: "*" }
    ];
    const ShowData = async () => {
        const res = await SyllabusTemplateAPI.GetListSyllabusTemplate({
            page: page,
            pageSize: pageSize,
        });
        if (res.success) {
            setAllData(res.data);
            setPage(Number(res.currentPage) || 1);
            setTotalPages(Number(res.totalPages) || 1);
            setTotalRecords(Number(res.totalRecords) || 0);
            setPageSize(Number(res.pageSize) || 10);
        }
        else {
            SweetAlert("error", res.message);
            setAllData([]);
            setPage(1);
            setPageSize(10);
            setTotalPages(1);
            setTotalRecords(0);
        }
    }
    const handleAddNewSyllabusTemplate = () => {
        setModalMode("create");
        setModalOpen(true);
    }
    const handleEditSyllabusTemplate = async (id: number) => {
        setModalMode("edit");
        setModalOpen(true);
        const res = await SyllabusTemplateAPI.InfoSyllabusTemplate({ id_template: id });
        if (res.success) {
            setFormData({
                id_template: res.data.id_template,
                template_name: res.data.template_name,
                is_default: res.data.is_default,
            });
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleDeleteSyllabusTemplate = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Mẫu đề cương này và các dữ liệu liên quan khác, bạn muốn xóa?");
        if (confirm) {
            const res = await SyllabusTemplateAPI.DeleteSyllabusTemplate({ id_template: id });
            if (res.success) {
                SweetAlert("success", res.message);
                ShowData();
            }
            else {
                SweetAlert("error", res.message);
            }
        }
    }
    const handleSave = async () => {
        if (modalMode === "create") {
            const res = await SyllabusTemplateAPI.AddSyllabusTemplate({
                template_name: formData.template_name,
                is_default: Number(formData.is_default),
            });
            if (res.success) {
                SweetAlert("success", res.message);
                setModalOpen(false);
                ShowData();
            }
            else {
                SweetAlert("error", res.message);
            }
        }
        else {
            const res = await SyllabusTemplateAPI.UpdateSyllabusTemplate({
                id_template: Number(formData.id_template),
                template_name: formData.template_name,
                is_default: Number(formData.is_default),
            });
            if (res.success) {
                SweetAlert("success", res.message);
                setModalOpen(false);
                ShowData();
            }
            else {
                SweetAlert("error", res.message);
            }
        }
    }
    useEffect(() => {
        ShowData();
    }, []);
    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Khóa học thuộc Đơn vị
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">

                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success" onClick={handleAddNewSyllabusTemplate} >
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button className="btn btn-primary">
                                        <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {headers.map((h, idx) => (
                                        <th key={idx}>{h.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allData.length > 0 ? (
                                    allData.map((item, index) => (
                                        <tr key={item.id_template}>
                                            <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td className="formatSo">{item.template_name}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td className="formatSo">{item.is_default}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleEditSyllabusTemplate(item.id_template)}
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleDeleteSyllabusTemplate(item.id_template)}
                                                >
                                                    <i className="anticon anticon-delete" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={headers.length}
                                            className="text-center text-danger">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Tổng số: {totalRecords} bản ghi | Trang {page}/{totalPages}
                        </span>
                        <div>
                            <button
                                className="btn btn-secondary btn-sm mr-2"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Trang trước
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                title={modalMode === "create" ? "Thêm mới Mẫu đề cương" : "Chỉnh sửa Mẫu đề cương"}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên mẫu đề cương</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="template_name" value={formData.template_name ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên mẫu đề cương</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="is_default" value={formData.is_default ?? ""} onChange={handleInputChange} >
                                <option value="1">Mở mẫu đề cương</option>
                                <option value="0">Đóng mẫu đề cương</option >
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default SyllabusTempalteInterfaceDonVi;