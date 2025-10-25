import Modal from "../../../components/ui/Modal";
import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import KeySemesterAPI from "../../../api/DonVi/KeySemesterAPI";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { ListDonViPermissionAPI } from "../../../api/DonVi/ListDonViPermissionAPI";
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
    const resetFormData = (id_faculty: number) => {
        setFormData({
            id_key_year_semester: 0,
            name_key_year_semester: "",
            code_key_year_semester: "",
            id_faculty: id_faculty,
        });
    }
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
        const res = await KeySemesterAPI.GetListKeySemester({
            id_faculty: Number(formData.id_faculty),
            Page: page,
            PageSize: pageSize,
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
    useEffect(() => {
        if (formData.id_faculty == null) return;
        ShowData();
    }, [formData.id_faculty, page, pageSize]);

    const handleAddNewKeySemester = () => {
        setShowModal(true);
        setModalMode("create");
    }
    const handleEditKeySemester = async (id: number) => {
        const res = await KeySemesterAPI.InfoKeySemester({ id_key_year_semester: id });
        if (res.success) {
            setShowModal(true);
            setModalMode("edit");
            setFormData({
                id_key_year_semester: res.data.id_year_semester,
                name_key_year_semester: res.data.name_key_year_semester,
                code_key_year_semester: res.data.code_key_year_semester,
                id_faculty: res.data.id_faculty,
            });
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleSave = async () => {
        if (modalMode === "create") {
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
    }
    const handleDeleteKeySemester = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Khóa học này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirm) {
            const res = await KeySemesterAPI.DeleteKeySemester({ id_key_year_semester: id });
            if (res.success) {
                SweetAlert("success", res.message);
                ShowData();
            }
            else {
                SweetAlert("error", res.message);
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
    useEffect(() => {
        if (!didFetch.current) {
            GetListFaculty();
            didFetch.current = true;
        }
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
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo Đơn vị được phân công</label>
                                    <select className="form-control" name="id_faculty" value={formData.id_faculty ?? ""} >
                                        {listFaculty.map((items, idx) => (
                                            <option key={idx} value={items.value}>
                                                {items.text}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success" onClick={handleAddNewKeySemester}>
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
                                        <tr key={item.id_year_semester}>
                                            <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td className="formatSo">{item.code_key_year_semester}</td>
                                            <td className="formatSo">{item.name_key_year_semester}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleEditKeySemester(item.id_key_year_semester)}
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleDeleteKeySemester(item.id_key_year_semester)}
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
                isOpen={showModal}
                title={modalMode === "create" ? "Thêm mới Học kỳ" : "Chỉnh sửa Học kỳ"}
                onClose={() => {
                    setShowModal(false);
                    resetFormData(formData.id_faculty);
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
        </div>
    )
}

export default KeySemesterInterfaceCtdt;