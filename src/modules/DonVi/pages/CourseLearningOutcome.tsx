import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { CourseLearningOutcomeAPI } from "../../../api/DonVi/CourseLearningOutcomeAPI";
import { unixTimestampToDate } from "../../../URL_Config";

export default function CourseLearningOutcomeInterfaceDonVi() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [allData, setAllData] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
        else {
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
                            Quản lý Danh sách Chuẩn đầu ra học phần
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">

                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success" onClick={handleAddNewCourseLearningOutcome} >
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
                                        <tr key={item.id}>
                                            <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td className="formatSo">{item.name_CLO}</td>
                                            <td>{item.describe_CLO}</td>
                                            <td>{item.bloom_level}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleEditCourseLearningOutcome(item.id)}
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleDeleteCourseLearningOutcome(item.id)}
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