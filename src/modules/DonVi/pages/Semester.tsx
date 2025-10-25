import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { SemesterAPIDonVi } from "../../../api/DonVi/SemesterAPI";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import { ListDonViPermissionAPI } from "../../../api/DonVi/ListDonViPermissionAPI";

function SemesterInterfaceCtdt() {
    const [allData, setAllData] = useState<any[]>([]);
     const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const didFetch = useRef(false);
    const [listFaculty, setListFaculty] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    interface Semester {
        id_semester: number | null;
        name_semester: string;
        code_semester: string;
        id_faculty: number | null;
    };
    const [formData, setFormData] = useState<Semester>({
        id_semester: null,
        name_semester: "",
        code_semester: "",
        id_faculty: null,
    });
    const resetFormData = (id_faculty: number | null) => {
        setFormData({
            id_semester: null,
            name_semester: "",
            code_semester: "",
            id_faculty: id_faculty,
        });
    }
    const headers = [
        { label: "STT", key: "" },
        { label: "Mã học kỳ", key: "code_semester" },
        { label: "Tên học kỳ", key: "name_semester" },
        { label: "Ngày tạo", key: "tim_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" }
    ];

    const GetListSemester = async () => {
        const res = await SemesterAPIDonVi.GetListSemester({
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
    };

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
    useEffect(() => {
        if (formData.id_faculty == null) return;
        GetListSemester();
    }, [formData.id_faculty, page, pageSize]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "id_program") {
            setFormData((prev) => ({ ...prev, id_program: Number(value) }));
            setPage(1);
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const HandleAddNewSemester = () => {
        setShowModal(true);
        setModalMode("create");
    }
    const handleInfo = async (id: number) => {
        const res = await SemesterAPIDonVi.InfoSemester({ id_semester: id });
        if (res.success) {
            setShowModal(true);
            setModalMode("edit");
            setFormData({
                id_semester: res.data.id_semester,
                name_semester: res.data.name_semester,
                id_faculty: res.data.id_faculty,
                code_semester: res.data.code_semester,
            });
        }
    }
    const handleDelete = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Học kỳ này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirm) {
            const res = await SemesterAPIDonVi.DeleteSemester({ id_semester: id });
            if (res.success) {
                SweetAlert("success", res.message);
                GetListSemester();
            }
            else {
                SweetAlert("error", res.message);
            }
        }
    }
    const handleSave = async () => {
        if (modalMode === "create") {
            const res = await SemesterAPIDonVi.AddNewSemester({
                name_semester: formData.name_semester,
                code_semester: formData.code_semester,
                id_faculty: Number(formData.id_faculty),
            });
            if (res.success) {
                SweetAlert("success", res.message);
                setShowModal(false);
                GetListSemester();
            } else {
                SweetAlert("error", res.message);
            }
        }
        else {
            const res = await SemesterAPIDonVi.UpdateSemester({
                id_semester: Number(formData.id_semester),
                name_semester: formData.name_semester,
                code_semester: formData.code_semester,
            });
            if (res.success) {
                SweetAlert("success", res.message);
                setShowModal(false);
                GetListSemester();
            }
            else {
                SweetAlert("error", res.message);
            }
        }
    }
    const dataToShow = allData;
    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Học kỳ thuộc Đơn vị
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo Đơn vị được phân công</label>
                                    <select className="form-control" name="id_faculty" value={formData.id_faculty ?? ""} onChange={handleInputChange}>
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
                                    <button className="btn btn-success" onClick={HandleAddNewSemester}>
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
                                {dataToShow.length > 0 ? (
                                    dataToShow.map((item, index) => (
                                        <tr key={item.id_semester}>
                                            <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td className="formatSo">{item.code_semester}</td>
                                            <td className="formatSo">{item.name_semester}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.tim_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleInfo(item.id_semester)}
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleDelete(item.id_semester)}
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
                        <label className="col-sm-2 col-form-label">Mã học kỳ</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="code_semester" value={formData.code_semester} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên học kỳ</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="name_semester" value={formData.name_semester} onChange={handleInputChange} />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
export default SemesterInterfaceCtdt;