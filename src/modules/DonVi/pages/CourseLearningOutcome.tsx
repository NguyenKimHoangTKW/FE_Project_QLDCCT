import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { CourseLearningOutcomeAPI } from "../../../api/DonVi/CourseLearningOutcomeAPI";
import { unixTimestampToDate } from "../../../URL_Config";
import Swal from "sweetalert2";
import Loading from "../../../components/ui/Loading";
export default function CourseLearningOutcomeInterfaceDonVi() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [allData, setAllData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    interface FormData {
        id: number | null;
        name_CLO: string;
        describe_CLO: string;
        bloom_level: string;
    }
    const [formData, setFormData] = useState<FormData>({
        id: null,
        name_CLO: "",
        describe_CLO: "",
        bloom_level: "",
    });
    const resetFormData = () => {
        setFormData({
            id: null,
            name_CLO: "",
            describe_CLO: "",
            bloom_level: "",
        });
    }
    const headers = [
        { label: "STT", key: "" },
        { label: "Tên chuẩn đầu ra học phần", key: "name_CLO" },
        { label: "Mô tả chuẩn đầu ra học phần", key: "describe_CLO" },
        { label: "Mức độ Bloom", key: "bloom_level" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];
    const ShowData = async () => {
        setLoading(true);
        try {
            const res = await CourseLearningOutcomeAPI.GetListCourseLearningOutcome({
                Page: page,
                PageSize: pageSize,
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
        finally {
            setLoading(false);
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleAddNewCourseLearningOutcome = () => {
        setModalOpen(true);
        setModalMode("create");
        resetFormData();
    }
    const handleDeleteCourseLearningOutcome = async (id_CLO: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Chỉnh sửa học phần này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirm) {
            setLoading(true);
            try {
                const res = await CourseLearningOutcomeAPI.DeleteCourseLearningOutcome({
                    id: Number(id_CLO),
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    ShowData();
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
    const handleEditCourseLearningOutcome = async (id_CLO: number) => {
        const res = await CourseLearningOutcomeAPI.InfoCourseLearningOutcome({
            id: Number(id_CLO),
        });
        setModalOpen(true);
        setModalMode("edit");
        setFormData({
            id: Number(res.id),
            name_CLO: res.name_CLO,
            describe_CLO: res.describe_CLO,
            bloom_level: res.bloom_level,
        });
    }
    const handleSave = async () => {
        if (modalMode === "create") {
            setLoading(true);
            try {
                const res = await CourseLearningOutcomeAPI.AddCourseLearningOutcome({
                    name_CLO: formData.name_CLO,
                    describe_CLO: formData.describe_CLO,
                    bloom_level: formData.bloom_level,
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    ShowData();
                    resetFormData();
                    setModalOpen(false);
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
                const res = await CourseLearningOutcomeAPI.UpdateCourseLearningOutcome({
                    id: Number(formData.id ?? 0),
                    name_CLO: formData.name_CLO,
                    describe_CLO: formData.describe_CLO,
                    bloom_level: formData.bloom_level,
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                }
                else {
                    SweetAlert("error", res.message);
                }
                setModalOpen(false);
                ShowData();
                resetFormData();
                setModalOpen(false);
                ShowData();
                resetFormData();
            }
            finally {
                setLoading(false);
            }
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
            const res = await CourseLearningOutcomeAPI.UploadExcel(selectedFile);

            setLoading(false);
            if (res.success) {
                SweetAlert("success", res.message);
                ShowData();
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
            const res = await CourseLearningOutcomeAPI.ExportExcel();
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
            link.href = "/file-import/ImportCourseLearningOutcome.xlsx";
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
        ShowData();
    }, []);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
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

                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-butterfly" onClick={handleAddNewCourseLearningOutcome} >
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
                                </div>
                            </div>
                        </fieldset>
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
                                        <h5 className="modal-title">Import danh sách chuẩn đầu ra học phần từ Excel</h5>
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
                                        <tr key={item.id}>
                                            <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td data-label="Tên chuẩn đầu ra học phần" className="formatSo">{item.name_CLO}</td>
                                            <td data-label="Mô tả chuẩn đầu ra học phần">{item.describe_CLO}</td>
                                            <td data-label="Mức độ Bloom">{item.bloom_level}</td>
                                            <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td data-label="*" className="formatSo">
                                                <div className="d-flex justify-content-center flex-wrap gap-3">
                                                    <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleEditCourseLearningOutcome(item.id)}>
                                                        <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                                                    </button>
                                                    <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteCourseLearningOutcome(item.id)}>
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
                title={modalMode === "create" ? "Thêm mới Chuẩn đầu ra học phần" : "Chỉnh sửa Chuẩn đầu ra học phần"}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên chuẩn đầu ra học phần</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="name_CLO" value={formData.name_CLO ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Mô tả chuẩn đầu ra học phần</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="describe_CLO" value={formData.describe_CLO ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Mức độ Bloom (BLOOM'S TAXONOMY)</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="bloom_level" value={formData.bloom_level ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}