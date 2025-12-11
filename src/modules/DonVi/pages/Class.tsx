import { useEffect, useState } from "react";
import Loading from "../../../components/ui/Loading";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import { unixTimestampToDate } from "../../../URL_Config";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Swal from "sweetalert2";
import Modal from "../../../components/ui/Modal";
import { ClassDVAPI } from "../../../api/DonVi/Class";
export default function ClassInterfaceDonVi() {
    const [loading, setLoading] = useState(false);
    const [listClass, setListClass] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [rawSearchText, setRawSearchText] = useState("");
    const [formData, setFormData] = useState<any>({
        id_class: null,
        name_class: "",
    });
    interface OptionData {
        id_program: number | null;
    }
    const [optionData, setOptionData] = useState<OptionData>({
        id_program: null,
    });
    const headers = [
        { label: "STT", key: "" },
        { label: "Tên lớp", key: "name_class" },
        { label: "Ngày tạo", key: "tim_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOptionData((prev) => ({ ...prev, [name]: value }));
    }
    const LoadListCTDTByDonVi = async () => {
        const res = await ClassDVAPI.GetListCTDTByDonVi();
        setListCTDT(res);
        setOptionData((prev) => ({ ...prev, id_program: res[0].id_program }));
    }
    const loadDataClass = async () => {
        setLoading(true);
        try {
            const res = await ClassDVAPI.GetListClass({ id_program: Number(optionData.id_program), Page: page, PageSize: pageSize, searchTerm: searchText });
            if (res.success) {
                setListClass(res.loadClass);
                setPage(Number(res.currentPage) || 1);
                setTotalPages(Number(res.totalPages) || 1);
                setTotalRecords(Number(res.totalRecords) || 0);
                setPageSize(Number(res.pageSize) || 10);
            } else {
                setListClass([]);
                setPage(1);
                setPageSize(10);
                setTotalPages(1);
                setTotalRecords(0);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleAddNewClass = async () => {
        setModalOpen(true);
        setModalMode("create");
    }
    const handleEditClass = async (id: number) => {
        setModalOpen(true);
        setModalMode("edit");
        const res = await ClassDVAPI.InfoClass({ id_class: id });
        if (res.success) {
            setFormData({
                id_class: res.data.id_class,
                name_class: res.data.name_class,
            });
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleDeleteClass = async (id: number) => {
        const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Lớp này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirmDel) {
            const res = await ClassDVAPI.DeleteClass({ id_class: id });
            if (res.success) {
                SweetAlert("success", res.message);
                loadDataClass();
            }
            else {
                SweetAlert("error", res.message);
            }
        }
    }
    const handleSaveClass = async () => {
        setLoading(true);
        try {
            if (modalMode === "create") {
                const res = await ClassDVAPI.AddNewClass({ name_class: formData.name_class, id_program: Number(optionData.id_program) });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataClass();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            else {
                const res = await ClassDVAPI.UpdateClass({ id_class: formData.id_class, name_class: formData.name_class });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataClass();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        try {
            e.preventDefault();
            if (!selectedFile) {
                Swal.fire("Thông báo", "Vui lòng chọn file Excel!", "warning");
                return;
            }
            setLoading(true);
            const res = await ClassDVAPI.UploadExcel(selectedFile, Number(optionData.id_program));

            setLoading(false);
            if (res.success) {
                SweetAlert("success", res.message);
                loadDataClass();
                setLoading(false);
            } else {
                SweetAlert("error", res.message);
                setLoading(false);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleExportExcel = async () => {
        setLoading(true);

        try {
            const res = await ClassDVAPI.ExportExcel({ id_program: Number(optionData.id_program) });
            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Exports.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
            SweetAlert("success", "Xuất file Excel thành công!");
        } finally {
            setLoading(false);
        }
    };
    const handleDownloadTemplate = () => {
        setLoading(true);
        try {
            const link = document.createElement("a");
            link.href = "/file-import/ImportClass.xlsx";
            link.download = "TemplateImport.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        LoadListCTDTByDonVi();
    }, []);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchText(rawSearchText);
            setPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [rawSearchText]);
    useEffect(() => {
        loadDataClass();
    }, [searchText, page, pageSize]);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách lớp học thuộc đơn vị
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <CeoSelect2
                                        label="Lọc theo CTĐT"
                                        name="id_program"
                                        value={optionData.id_program}
                                        onChange={handleInputChange}
                                        options={listCTDT.map(item => ({
                                            value: item.id_program,
                                            text: item.name_program
                                        }))}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-butterfly" onClick={handleAddNewClass}>
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button
                                        className="btn btn-ceo-green"
                                        id="exportExcel"
                                        data-toggle="modal"
                                        data-target="#importExcelModal"
                                    >
                                        <i className="fas fa-file-excel mr-1" /> Import danh sách từ file Excel
                                    </button>
                                    <button className="btn btn-ceo-green" onClick={handleExportExcel}>
                                        <i className="fas fa-file-excel mr-1" /> Xuất dữ liệu ra file Excel
                                    </button>
                                    <button className="btn btn-ceo-blue" onClick={() => loadDataClass()}>
                                        <i className="fas fa-filter mr-1" /> Lọc dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    {/*Modal Import*/}
                    <div
                        className="modal fade"
                        id="importExcelModal"
                        tabIndex={-1}
                        aria-labelledby="importExcelModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Import danh sách lớp từ Excel</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form id="importExcelForm" autoComplete="off">
                                        <div className="form-group row">
                                            <label className="col-sm-2 col-form-label">File Excel</label>
                                            <div className="col-sm-10">
                                                <input type="file" className="form-control" name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedFile(e.target.files?.[0] || null)} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <hr />
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-ceo-green" onClick={handleDownloadTemplate}>Tải file mẫu</button>
                                    <button type="button" className="btn btn-ceo-blue" onClick={handleSubmit}>Import</button>
                                    <button type="button" className="btn btn-ceo-red" data-dismiss="modal">Đóng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*Modal Import*/}
                    <div className="card mt-3">
                        <div className="card-body">
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
                                        {listClass.length > 0 ? (
                                            listClass.map((item, index) => (
                                                <tr key={item.id_class}>
                                                    <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                                    <td data-label="Tên lớp" className="formatSo">{item.name_class}</td>
                                                    <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.tim_cre)}</td>
                                                    <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                                    <td data-label="*" className="formatSo">
                                                        <div className="d-flex justify-content-center flex-wrap gap-3">
                                                            <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleEditClass(item.id_class)}>
                                                                <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                                                            </button>
                                                            <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteClass(item.id_class)}>
                                                                <i className="anticon anticon-delete me-1" /> Xóa bỏ
                                                            </button>
                                                        </div>
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
                        </div>
                    </div>
                    <div className="ceo-pagination mt-3">
                        <div className="ceo-pagination-info">
                            Tổng số: {totalRecords} bản ghi | Trang {page}/{totalPages}
                        </div>

                        <div className="ceo-pagination-actions">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                ← Trang trước
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Trang sau →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                title={modalMode === "create" ? "Thêm mới lớp" : "Chỉnh sửa lớp"}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveClass}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên lớp</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="name_class" value={formData.name_class} onChange={(e) => setFormData({ ...formData, name_class: e.target.value })} />
                        </div>
                    </div>
                </form>
            </Modal>
            <div
                className="shadow-lg d-flex flex-wrap justify-content-center align-items-center gap-3 p-3 mt-4"
                style={{
                    position: "sticky",
                    bottom: 0,
                    background: "rgba(245, 247, 250, 0.92)",
                    backdropFilter: "blur(8px)",
                    borderTop: "1px solid #e5e7eb",
                    zIndex: 100,
                }}
            >
                {/* Ô tìm kiếm */}
                <div className="col-md-4">
                    <label className="ceo-label" style={{ fontWeight: 600, opacity: 0.8 }}>
                        Tìm kiếm
                    </label>

                    <div className="input-group">
                        <span
                            className="input-group-text"
                            style={{
                                background: "#fff",
                                borderRight: "none",
                                borderRadius: "10px 0 0 10px",
                            }}
                        >
                            🔍
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập từ khóa để tìm kiếm..."
                            value={rawSearchText}
                            onChange={(e) => setRawSearchText(e.target.value)}
                            style={{
                                borderLeft: "none",
                                borderRadius: "0 10px 10px 0",
                                padding: "10px 12px",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}