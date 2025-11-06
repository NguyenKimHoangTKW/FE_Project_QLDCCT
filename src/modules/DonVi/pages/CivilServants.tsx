import { useEffect, useState } from "react";
import { CivilServantsDonViAPI } from "../../../api/DonVi/CivilServants";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
export default function CivilServantsInterfaceDonVi() {
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [listPermission, setListPermission] = useState<Permission[]>([]);
    const [selectedPrograms, setSelectedPrograms] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [permissionOpen, setPermissionOpen] = useState(false);
    interface FormData {
        id_civilSer: number | null;
        code_civilSer: string;
        fullname_civilSer: string;
        email: string;
        birthday: string;
        id_program: number | null;
    }
    interface OptionFilter {
        id_program: number | null;
    }
    interface Permission {
        id_civilSer: number | null;
        id_type_users: number | null;
        status: number | null;
        id_program: number | null;
    }
    const [permissionData, setPermissionData] = useState<Permission>({
        id_civilSer: null,
        id_type_users: null,
        status: null,
        id_program: null,
    });
    const [optionFilter, setOptionFilter] = useState<OptionFilter>({
        id_program: null,
    });
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
        if (name === "id_program_filter") {
            setOptionFilter((prev) => ({ ...prev, id_program: Number(value) }));
        }

        if (name === "id_type_users") {
            setPermissionData((prev) => ({ ...prev, id_type_users: Number(value) }));
        }
        if (name === "status") {
            setPermissionData((prev) => ({ ...prev, status: Number(value) }));
        }
    }
    const LoadInfoPermission = async (id_civilSer: number) => {
        setPermissionOpen(true);
        const res = await CivilServantsDonViAPI.LoadInfoPermission({ id_civilSer });
        if (res.success) {
            setPermissionData({
                id_civilSer,
                id_type_users: Number(res.data.id_type_users),
                status: Number(res.data.status),
                id_program: null,
            });

            if (res.data.list_programs) {
                const existing = res.data.list_programs.map((p: any) => p.id_program);
                setSelectedPrograms(existing);
            }

            ListTypePermission();
        } else {
            SweetAlert("error", res.message);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPrograms([]);
            setSelectAll(false);
        } else {
            const allIds = listCTDT.map((item: any) => item.id_program);
            console.log("✅ Chọn tất cả CTĐT:", allIds);
            setSelectedPrograms(allIds);
            setSelectAll(true);
        }
    };


    const handleSelectProgram = (id_program: number) => {
        setSelectedPrograms((prevSelected) => {
            let updated;
            if (prevSelected.includes(id_program)) {
                updated = prevSelected.filter((id) => id !== id_program);
            } else {
                updated = [...prevSelected, id_program];
            }
            return updated;
        });
    };


    const LoadListCTDTByDonVi = async () => {
        const res = await CivilServantsDonViAPI.GetListCTDTByDonVi();
        setListCTDT(res);
        setFormData((prev) => ({ ...prev, id_program: res[0].id_program }));
    }
    const ListTypePermission = async () => {
        const res = await CivilServantsDonViAPI.ListTypePermission();
        setListPermission(res);
    }
    const HandleSavePermission = async () => {
        const payload = {
            id_civilSer: Number(permissionData.id_civilSer),
            id_type_users: Number(permissionData.id_type_users),
            status: Number(permissionData.status),
            ctdt_per: selectedPrograms,
        };

        const res = await CivilServantsDonViAPI.SavePermission(payload);
        if (res.success) {
            SweetAlert("success", res.message);
            setPermissionOpen(false);
        } else {
            SweetAlert("error", res.message);
        }
    };

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
        const res = await CivilServantsDonViAPI.GetListCivilServants({ id_program: Number(optionFilter.id_program || 0), Page: page, PageSize: pageSize });
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
        const res = await CivilServantsDonViAPI.InfoCivilServant({ id_civilSer: id_civilSer });
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
            const res = await CivilServantsDonViAPI.DeleteCivilServant({ id_civilSer: id_civilSer });
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
            const res = await CivilServantsDonViAPI.CreateNewCivilServant({
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
            const res = await CivilServantsDonViAPI.UpdateCivilServant({
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
                                    <select className="form-control" name="id_program_filter" value={optionFilter.id_program ?? ""} onChange={handleInputChange} >
                                        <option value="0">Tất cả</option>
                                        {listCTDT.map((item, index) => (
                                            <option key={index} value={item.id_program}>{item.name_program}</option>
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
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                    onClick={() => LoadInfoPermission(item.id_civilSer)}
                                                >
                                                    <i className="anticon anticon-save" />
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
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Thuộc CTĐT</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="id_program" value={formData.id_program ?? ""} onChange={handleInputChange} >
                                {listCTDT.map((item, index) => (
                                    <option key={index} value={item.id_program}>{item.name_program}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={permissionOpen}
                title="Quản lý quyền hạn"
                onClose={() => setPermissionOpen(false)}
                onSave={HandleSavePermission}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Cán bộ viên chức</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="fullname_civilSer" value={formData.fullname_civilSer ?? ""} onChange={handleInputChange} />
                            <input type="hidden" className="form-control" name="id_civilSer" value={permissionData.id_civilSer ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Trạng thái</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="status" value={permissionData.status ?? ""} onChange={handleInputChange} >
                                <option value="1">Kích hoạt</option>
                                <option value="0">Vô hiệu hóa</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Quyền hạn</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="id_type_users" value={permissionData.id_type_users ?? ""} onChange={handleInputChange} >
                                {listPermission.map((item, index) => (
                                    <option key={index} value={item.id_type_users ?? ""}>{item.name_type_users}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </form>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: "50px", textAlign: "center" }}>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th style={{ width: "60px", textAlign: "center" }}>STT</th>
                            <th>Chương trình đào tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listCTDT.map((item, index) => (
                            <tr key={item.id_program}>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPrograms.includes(item.id_program)}
                                        onChange={() => handleSelectProgram(item.id_program)}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                <td>{item.name_program}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </div>
    );
}