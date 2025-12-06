import Modal from "../../../components/ui/Modal";
import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import KeySemesterAPI from "../../../api/DonVi/KeySemesterAPI";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { ListDonViPermissionAPI } from "../../../api/DonVi/ListDonViPermissionAPI";
import Loading from "../../../components/ui/Loading";
import Swal from "sweetalert2";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
function KeySemesterInterfaceCtdt() {
    const [listFaculty, setListFaculty] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const didFetch = useRef(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [allData, setAllData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [rawSearchText, setRawSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    interface KeySemester {
        id_key_year_semester: number;
        name_key_year_semester: string;
        code_key_year_semester: string;
        id_faculty: number;
    }
    const [formData, setFormData] = useState<KeySemester>({
        id_key_year_semester: 0,
        name_key_year_semester: "",
        code_key_year_semester: "",
        id_faculty: 0,
    });

    const headers = [
        { label: "STT", key: "" },
        { label: "Mã khóa học", key: "code_key_year_semester" },
        { label: "Tên khóa học", key: "name_key_year_semester" },
        { label: "Ngày tạo", key: "tim_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "id_faculty") {
            setFormData((prev) => ({ ...prev, id_faculty: Number(value) }));
            setPage(1);
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const ShowData = async () => {
        setLoading(true);
        try {
            const res = await KeySemesterAPI.GetListKeySemester({
                id_faculty: Number(formData.id_faculty),
                Page: page,
                PageSize: pageSize,
                searchTerm: searchText,
            });
            if (res.success) {
                setAllData(res.data);
                setPage(Number(res.currentPage) || 1);
                setTotalPages(Number(res.totalPages) || 1);
                setTotalRecords(Number(res.totalRecords) || 0);
                setPageSize(Number(res.pageSize) || 10);
            } else {
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

    const handleAddNewKeySemester = () => {
        setShowModal(true);
        setModalMode("create");
    }
    const handleEditKeySemester = async (id: number) => {
        const res = await KeySemesterAPI.InfoKeySemester({ id_key_year_semester: id });

        if (res.success) {
            setShowModal(true);
            setModalMode("edit");

            setFormData((prev) => ({
                ...prev,
                id_key_year_semester: res.data.id_key_year_semester,
                name_key_year_semester: res.data.name_key_year_semester,
                code_key_year_semester: res.data.code_key_year_semester,
            }));
        } else {
            SweetAlert("error", res.message);
        }
    };

    const handleSave = async () => {
        if (modalMode === "create") {
            setLoading(true);
            try {
                const res = await KeySemesterAPI.AddNewKeySemester({
                    name_key_year_semester: formData.name_key_year_semester,
                    code_key_year_semester: formData.code_key_year_semester,
                    id_faculty: Number(formData.id_faculty),
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    ShowData();
                } else {
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
                const res = await KeySemesterAPI.UpdateKeySemester({
                    id_key_year_semester: Number(formData.id_key_year_semester),
                    name_key_year_semester: formData.name_key_year_semester,
                    code_key_year_semester: formData.code_key_year_semester,
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    ShowData();
                } else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }
        }
    }
    const handleDeleteKeySemester = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Khóa học này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirm) {
            setLoading(true);
            try {
                const res = await KeySemesterAPI.DeleteKeySemester({ id_key_year_semester: id });
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
    const GetListFaculty = async () => {
        const res = await ListDonViPermissionAPI.GetListDonViPermission();
        setFormData((prev) => ({
            ...prev,
            id_faculty: Number(res[0].value),
        }));
        setListFaculty(res);
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
            const res = await KeySemesterAPI.UploadExcel(selectedFile, Number(formData.id_faculty));

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
            const res = await KeySemesterAPI.ExportExcel({
                id_faculty: Number(formData.id_faculty)
            });

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
            link.href = "/file-import/ImportKeySemester.xlsx";
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
        if (!didFetch.current) {
            GetListFaculty();
            didFetch.current = true;
        }
    }, []);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchText(rawSearchText);
            setPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [rawSearchText]);
    useEffect(() => {
        if (formData.id_faculty == null) return;
        ShowData();
    }, [searchText,formData.id_faculty, page, pageSize]);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
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
                                <div className="col-md-6">
                                    <CeoSelect2
                                        label="Lọc theo Đơn vị được phân công"
                                        name="id_faculty"
                                        value={formData.id_faculty}
                                        onChange={handleInputChange}
                                        options={listFaculty.map(item => ({
                                            value: item.value,
                                            text: item.text
                                        }))}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-butterfly" onClick={handleAddNewKeySemester}>
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button className="btn btn-ceo-green" onClick={handleExportExcel} >
                                        <i className="fas fa-file-excel mr-1" /> Xuất dữ liệu ra file Excel
                                    </button>
                                    <button
                                        className="btn btn-ceo-green"
                                        id="exportExcel"
                                        data-toggle="modal"
                                        data-target="#importExcelModal"
                                    >
                                        <i className="fas fa-file-excel mr-1" /> Import danh sách khóa học file từ Excel
                                    </button>
                                    <button className="btn btn-ceo-blue" onClick={() => ShowData()}>
                                        <i className="fas fa-filter mr-1" /> Lọc dữ liệu
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
                                        <h5 className="modal-title">Import danh sách khóa học từ Excel</h5>
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
                                    allData.map((item: any, index: number) => (
                                        <tr key={item.id_key_year_semester}>
                                            <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td data-label="Mã khóa học" className="formatSo">{item.code_key_year_semester}</td>
                                            <td data-label="Tên khóa học">{item.name_key_year_semester}</td>
                                            <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td data-label="*" className="formatSo">
                                                <div className="d-flex justify-content-center flex-wrap gap-3">
                                                    <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleEditKeySemester(item.id_key_year_semester)}>
                                                        <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                                                    </button>
                                                    <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteKeySemester(item.id_key_year_semester)}>
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
                isOpen={showModal}
                title={modalMode === "create" ? "Thêm mới Học kỳ" : "Chỉnh sửa Học kỳ"}
                onClose={() => {
                    setShowModal(false);
                }}
                onSave={handleSave}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Mã khóa học</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="code_key_year_semester" value={formData.code_key_year_semester} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên khóa học</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="name_key_year_semester" value={formData.name_key_year_semester} onChange={handleInputChange} />
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

export default KeySemesterInterfaceCtdt;