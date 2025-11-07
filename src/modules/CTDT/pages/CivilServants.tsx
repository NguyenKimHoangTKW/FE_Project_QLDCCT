import { useEffect, useState } from "react";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { CivilServantsCTDTAPI } from "../../../api/CTDT/CivilServants";
import { ListCTDTPermissionAPI } from "../../../api/CTDT/ListCTDTPermissionAPI";
export default function CivilServantsInterfaceDonVi() {
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    interface FormData {
        id_civilSer: number | null;
        code_civilSer: string;
        fullname_civilSer: string;
        email: string;
        birthday: string;
        id_program: number | null;
    }

    const [formData, setFormData] = useState<FormData>({
        id_civilSer: null,
        code_civilSer: "",
        fullname_civilSer: "",
        email: "",
        birthday: "",
        id_program: null,
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "id_program") {
            setFormData((prev) => ({ ...prev, id_program: Number(value) }));
        }
    }

    const LoadListCTDTByDonVi = async () => {
        const res = await ListCTDTPermissionAPI.GetListCTDTPermission();
        setListCTDT(res);
        setFormData((prev) => ({ ...prev, id_program: res[0].value }));
    }
    const headers = [
        { label: "STT", key: "" },
        { label: "Mã viên chức", key: "code_civilSer" },
        { label: "Tên viên chức", key: "fullname_civilSer" },
        { label: "Email", key: "email" },
        { label: "Thuộc CTĐT", key: "name_program" },
        { label: "Ngày sinh", key: "birthday" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];
    const ShowData = async () => {
        const res = await CivilServantsCTDTAPI.GetListCivilServantsCTDT({ id_program: Number(formData.id_program || 0), Page: page, PageSize: pageSize });
        if (res.success) {
            setAllData(res.data);
            setTotalRecords(Number(res.totalRecords) || 0);
            setTotalPages(Number(res.totalPages) || 1);
            setPageSize(Number(res.pageSize) || 10);
        } else {
            SweetAlert("error", res.message);
            setAllData([]);
            setTotalRecords(0);
            setTotalPages(1);
            setPageSize(10);
        }
    }
    const handleEditCivilServant = async (id_civilSer: number) => {
        const res = await CivilServantsCTDTAPI.InfoCivilServant({ id_civilSer: id_civilSer });
        if (res.success) {
            setFormData((prev) => ({
                ...prev,
                id_civilSer: res.data.id_civilSer,
                code_civilSer: res.data.code_civilSer,
                fullname_civilSer: res.data.fullname_civilSer,
                email: res.data.email,
                birthday: res.data.birthday,
                id_program: Number(res.data.id_program)
            }));
            setModalOpen(true);
            setModalMode("edit");
            setFormData(res.data);
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleAddNewCivilServant = () => {
        setModalOpen(true);
        setModalMode("create");
    }
    const handleDeleteCivilServant = async (id_civilSer: number) => {
        const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóao toàn bộ dữ liệu của CBVC này và những dữ liệu liên quan, bạn muốn tiếp tục?");
        if (confirmDel) {
            const res = await CivilServantsCTDTAPI.DeleteCivilServant({ id_civilSer: id_civilSer });
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
            const res = await CivilServantsCTDTAPI.CreateNewCivilServant({
                code_civilSer: formData.code_civilSer,
                fullname_civilSer: formData.fullname_civilSer,
                email: formData.email,
                birthday: formData.birthday,
                id_program: Number(formData.id_program || 0),
            });
            if (res.success) {
                SweetAlert("success", res.message);
                setModalOpen(false);
                ShowData();
            } else {
                SweetAlert("error", res.message);
            }
        }
        else {
            const res = await CivilServantsCTDTAPI.UpdateCivilServant({
                id_civilSer: Number(formData.id_civilSer),
                code_civilSer: formData.code_civilSer,
                fullname_civilSer: formData.fullname_civilSer,
                email: formData.email,
                birthday: formData.birthday,
                id_program: Number(formData.id_program),
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
    }, [page, pageSize]);
    useEffect(() => {
        LoadListCTDTByDonVi();
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
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo CTĐT</label>
                                    <select className="form-control" name="id_program" value={formData.id_program ?? ""} onChange={handleInputChange} >
                                        {listCTDT.map((item, index) => (
                                            <option key={index} value={item.value}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success" onClick={handleAddNewCivilServant} >
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button className="btn btn-primary" onClick={() => ShowData()} >
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
                                        <tr key={item.id_civilSer}>
                                            <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td className="formatSo">{item.code_civilSer}</td>
                                            <td className="formatSo">{item.fullname_civilSer}</td>
                                            <td className="formatSo">{item.email}</td>
                                            <td className="formatSo">{item.name_program}</td>
                                            <td className="formatSo">{item.birthday}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleEditCivilServant(item.id_civilSer)}
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => handleDeleteCivilServant(item.id_civilSer)}
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
                title={modalMode === "create" ? "Thêm mới Cán bộ viên chức" : "Chỉnh sửa Cán bộ viên chức"}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Mã viên chức</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="code_civilSer" value={formData.code_civilSer ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Tên viên chức</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="fullname_civilSer" value={formData.fullname_civilSer ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="email" value={formData.email ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Ngày sinh</label>
                        <div className="col-sm-10">
                            <input type="date" className="form-control" name="birthday" value={formData.birthday ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>            
                </form>
            </Modal>
        </div>
    );
}