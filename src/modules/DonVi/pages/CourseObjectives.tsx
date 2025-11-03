import { useEffect, useState } from "react";
import { CourseObjectivesAPI } from "../../../api/DonVi/CourseObjectivesAPI";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";

function CourseObjectivesInterfaceDonVi() {
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [allData, setAllData] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const headers = [
        { label: "STT", key: "" },
        { label: "Tên mục tiêu học phần", key: "name_CO" },
        { label: "Mô tả mục tiêu học phần", key: "describe_CO" },
        { label: "Loại mục tiêu học phần", key: "typeOfCapacity" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];
    interface FormData {
        id: number | null;
        name_CO: string;
        describe_CO: string;
        typeOfCapacity: string;
    }
    const [formData, setFormData] = useState<FormData>({
        id: null,
        name_CO: "",
        describe_CO: "",
        typeOfCapacity: "",
    });
    const resetFormData = () => {
        setFormData({
            id: null,
            name_CO: "",
            describe_CO: "",
            typeOfCapacity: "",
        });
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleAddNewCourseObjectives = () => {
        setModalOpen(true);
        setModalMode("create");
        resetFormData();

        setFormData((prev) => ({ ...prev, 
            typeOfCapacity: "Kiến thức",
         }));
    }
    const handleDeleteCourseObjectives = async (id_CO: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Mục tiêu học phần này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirm) {
            const res = await CourseObjectivesAPI.DeleteCourseObjectives({
                id: Number(id_CO),
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
    const ShowData = async () => {
        const res = await CourseObjectivesAPI.GetListCourseObjectives({
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
    const handleEditCourseObjectives = async (id_CO: number) => {
        const res = await CourseObjectivesAPI.InfoCourseObjectives({
            id: id_CO,
        });
        setFormData({
            id: Number(res.id),
            name_CO: res.name_CO,
            describe_CO: res.describe_CO,
            typeOfCapacity: res.typeOfCapacity,
        });
        setModalOpen(true);
        setModalMode("edit");
    }
    const handleSave = async () => {
        if (modalMode === "create") {
            const res = await CourseObjectivesAPI.AddCourseObjectives({
                name_CO: formData.name_CO,
                describe_CO: formData.describe_CO,
                typeOfCapacity: formData.typeOfCapacity,
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
            const res = await CourseObjectivesAPI.UpdateCourseObjectives({
                id: Number(formData.id ?? 0),
                name_CO: formData.name_CO,
                describe_CO: formData.describe_CO,
                typeOfCapacity: formData.typeOfCapacity,
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
                            Quản lý Danh sách Mục tiêu học phần
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">

                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success" onClick={handleAddNewCourseObjectives} >
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
                                            <td className="formatSo">{item.name_CO}</td>
                                            <td>{item.describe_CO}</td>
                                            <td>{item.typeOfCapacity}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleEditCourseObjectives(item.id)}
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleDeleteCourseObjectives(item.id)}
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
                title={modalMode === "create" ? "Thêm mới Mục tiêu học phần" : "Chỉnh sửa Mục tiêu học phần"}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên mục tiêu học phần</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="name_CO" value={formData.name_CO ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Mô tả mục tiêu học phần</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="describe_CO" value={formData.describe_CO ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Loại khả năng</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="typeOfCapacity" value={formData.typeOfCapacity ?? ""} onChange={handleInputChange} >
                                <option value="Kiến thức">Kiến thức</option>
                                <option value="Kỹ năng">Kỹ năng</option >
                                <option value="Thái độ">Thái độ</option >
                                <option value="Khả năng tư duy">Khả năng tư duy</option >
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
export default CourseObjectivesInterfaceDonVi;