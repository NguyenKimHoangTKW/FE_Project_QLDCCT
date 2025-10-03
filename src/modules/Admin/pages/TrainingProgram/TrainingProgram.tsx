import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../../URL_Config";
import { TrainingProgramAPI } from "../../../../api/Admin/TrainingProgram/TrainingProgramAPI";
import Modal from "../../../../components/ui/Modal";
import { SweetAlert } from "../../../../components/ui/SweetAlert";

function TrainingProgramInterface() {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [showModal, setShowModal] = useState(false);
    const didFetch = useRef(false);
    const [listYear, setListYear] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [listDonVi, setListDonVi] = useState<any[]>([]);
    const [listDonViValue, setListDonViValue] = useState<any[]>([]);
    const [idSelectedDonVi, setIdSelectedDonVi] = useState(Number);
    interface TrainingProgramInput {
        id_program: number | null,
        id_faculty: number | null,
        code_program: string,
        name_program: string,
        value_year: number | null
    }
    const [fromData, setFormData] = useState<TrainingProgramInput>({
        code_program: "",
        id_faculty: null,
        id_program: null,
        name_program: "",
        value_year: null
    });
    const headers = [
        { label: "STT", key: "" },
        { label: "ID CTĐT", key: "id_program" },
        { label: "Mã CTĐT", key: "code_program" },
        { label: "Tên CTĐT", key: "name_program" },
        { label: "Thuộc đơn vị", key: "name_faculty" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];

    const handleInputChange = async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "value_year") {
            const yearValue = Number(value);
            setFormData((prev) => ({ ...prev, value_year: yearValue }));
            await LoadSelectDonViByYear(yearValue);
        }
        else if (name === "value_year_value") {
            const yearValue = Number(value);
            setFormData((prev) => ({ ...prev, value_year: yearValue }));
            await LoadSelectDonViByYearValue(yearValue);
        }
        else if (name === "selected-year") {
            setIdSelectedDonVi(Number(value))
        }
        else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const ShowData = async () => {
        const res = await TrainingProgramAPI.getAllProgramCtdt(idSelectedDonVi, { page, pageSize })
        if (res.success) {
            setFilteredData(res.data);
        }
        else {
            setFilteredData([]);
        }
    }
    const handleAdd = async () => {
        setShowModal(true);
        setModalMode("create");
        await LoadSelectDonViByYearValue(Number(fromData.value_year));
    }

    const handleSave = async () => {
        if (modalMode === 'create') {
            const res = await TrainingProgramAPI.AddNewProgram({
                id_faculty: fromData.id_faculty,
                code_program: fromData.code_program,
                name_program: fromData.name_program
            });
            if (res.success) {
                SweetAlert("success", res.message);
                setShowModal(false);
            } else {
                SweetAlert("error", res.message);
            }
        }
    }
    const LoadSelectedYear = async () => {
        const res = await TrainingProgramAPI.getSelectYear();
        setListYear(res);
    };
    const LoadSelectDonViByYear = async (idYear: number) => {
        const res = await TrainingProgramAPI.getSelectFacultyByYear(idYear);
        if (idYear === 0) {
            setIdSelectedDonVi(0)
            setListDonVi([]);
        }
        else {
            setIdSelectedDonVi(res[0].value)
            setListDonVi(res);
        }
    }
    const LoadSelectDonViByYearValue = async (idYear: number) => {
        const res = await TrainingProgramAPI.getSelectFacultyByYear(idYear);
        const idFaculty = res[0].value;
        setFormData((prev) => ({
            ...prev,
            id_faculty: idFaculty
        }));
        setListDonViValue(res);
    }

    useEffect(() => {
        if (!didFetch.current) {
            LoadSelectedYear();
            ShowData();
            didFetch.current = true
        }
    }, [])
    const totalRecords = filteredData.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const dataToShow = filteredData.slice((page - 1) * pageSize, page * pageSize);
    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">Quản lý Danh sách Đơn vị</h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo năm</label>
                                    <select className="form-control" name="value_year" onChange={handleInputChange}>
                                        <option value="0">TẤT CẢ</option>
                                        {listYear.map((items, index) => (
                                            <option key={index} value={items.value_year}>
                                                {items.name_year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo đơn vị</label>
                                    <select className="form-control" name="selected-year">
                                        {listDonVi.length > 0 || fromData.value_year != 0 ? (
                                            listDonVi.map((items, index) => (
                                                <option key={index} value={items.value}>
                                                    {items.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="0">TẤT CẢ</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success" onClick={handleAdd}>
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button className="btn btn-primary" onClick={ShowData}>
                                        <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {/* Table */}
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
                                    dataToShow.map((item: any, index: number) => (
                                        <tr key={item.id_program}>
                                            <td className="formatSo">
                                                {(page - 1) * pageSize + index + 1}
                                            </td>
                                            <td className="formatSo">{item.id_program}</td>
                                            <td className="formatSo">{item.code_program}</td>
                                            <td>{item.name_program}</td>
                                            <td>{item.name_faculty}</td>
                                            <td className="formatSo">
                                                {unixTimestampToDate(item.time_cre)}
                                            </td>
                                            <td className="formatSo">
                                                {unixTimestampToDate(item.time_up)}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
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
                                            className="text-center text-danger"
                                        >
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
                <Modal
                    isOpen={showModal}
                    title={modalMode === "create" ? "Thêm mới Chương trình đào tạo" : "Chỉnh sửa chương trình đào tạo"}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                >
                    <form id="modal-body">
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Chọn năm</label>
                            <div className="col-sm-10">
                                <select className="form-control" name="value_year_value" onChange={handleInputChange}>
                                    {listYear.map((items, index) => (
                                        <option key={index} value={items.value_year}>
                                            {items.name_year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Chọn Đơn vị</label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="id_faculty"
                                    onChange={handleInputChange}
                                    value={fromData.id_faculty ?? ""}
                                >
                                    {listDonViValue.map((items, index) => (
                                        <option key={index} value={items.value}>
                                            {items.name}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nhập mã CTĐT</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="code_program"
                                    className="form-control"
                                    value={fromData.code_program ?? ""}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nhập tên CTĐT</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="name_program"
                                    className="form-control"
                                    value={fromData.name_program ?? ""}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    )
}
export default TrainingProgramInterface;