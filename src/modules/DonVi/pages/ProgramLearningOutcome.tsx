import { useEffect, useState } from "react";
import { ProgramLearningOutcomeAPI } from "../../../api/DonVi/ProgramLearningOutcome";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import Select from "react-select";
import Loading from "../../../components/ui/Loading";

export default function ProgramLearningOutcomeInterfaceDonVi() {
    // Program Learning Outcome
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [allData, setAllData] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectProgram, setSelectProgram] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const headers = [
        { label: "STT", key: "" },
        { label: "Tên chuẩn đầu ra chương trình đào tạo", key: "code" },
        { label: "Nội dung chuẩn đầu ra chương trình đào tạo", key: "description" },
        { label: "Thứ tự", key: "order_index" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "Số lượng chỉ số PI trong PLO", key: "*" },
        { label: "*", key: "*" },
    ];
    interface FormData {
        id: number | null;
        code: string;
        Description: string;
        Id_Program: number | null;
        order_index: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id: null,
        code: "",
        Description: "",
        Id_Program: null,
        order_index: null,
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "Id_Program") {
            setFormData((prev) => ({ ...prev, Id_Program: Number(value) }));
        }
    };

    const handleAddNewProgramLearningOutcome = () => {
        setModalOpen(true);
        setModalMode("create");
    }
    const LoadSelectProgramLearningOutcome = async () => {
        setLoading(true);
        const res = await ProgramLearningOutcomeAPI.LoadSelectProgramLearningOutcome();
        const formattedData = res.map((item: any) => ({
            value: item.id_program,
            label: item.name_program,
        }));
        setSelectProgram(formattedData);
        setLoading(false);
    }
    const handleEditProgramLearningOutcome = async (id: number) => {
        setLoading(true);
        const res = await ProgramLearningOutcomeAPI.InfoProgramLearningOutcome({ Id_Plo: id });
        if (res.success) {
            setFormData({
                id: Number(res.data.id_Plo),
                code: res.data.code,
                Description: res.data.description,
                Id_Program: Number(res.data.id_Program),
                order_index: Number(res.data.order_index),
            });
            setModalOpen(true);
            setModalMode("edit");
            setLoading(false);
        }
        else {
            SweetAlert("error", res.message);
            setLoading(false);
        }
    }
    const handleDeleteProgramLearningOutcome = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Chuẩn đầu ra chương trình đào tạo này và các dữ liệu liên quan, bạn muốn xóa?");
        if (confirm) {
            setLoading(true);
            try {
                const res = await ProgramLearningOutcomeAPI.DeleteProgramLearningOutcome({ Id_Plo: id });
                if (res.success) {
                    SweetAlert("success", res.message);
                    LoadData();
                } else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }
        }

    }
    const handleSaveProgramLearningOutcome = async () => {
        if (modalMode === "create") {
            setLoading(true);
            const res = await ProgramLearningOutcomeAPI.AddProgramLearningOutcome(
                { code: formData.code, Description: formData.Description, Id_Program: Number(formData.Id_Program), order_index: Number(formData.order_index) });
            if (res.success) {
                SweetAlert("success", res.message);
                LoadData();
                setModalOpen(false);
                setLoading(false);
            }
            else {
                SweetAlert("error", res.message);
                setLoading(false);
            }
        }
        else {
            setLoading(true);
            const res = await ProgramLearningOutcomeAPI.UpdateProgramLearningOutcome(
                { Id_Plo: Number(formData.id), Code: formData.code, Description: formData.Description, Id_Program: Number(formData.Id_Program), order_index: Number(formData.order_index) });
            if (res.success) {
                SweetAlert("success", res.message);
                LoadData();
                setModalOpen(false);
                setLoading(false);
            }
            else {
                SweetAlert("error", res.message);
                setLoading(false);
            }
        }
    }
    const LoadData = async () => {
        setLoading(true);
        try {
            const res = await ProgramLearningOutcomeAPI.GetListProgramLearningOutcome({ Id_Program: Number(formData.Id_Program), Page: page, PageSize: pageSize });
            if (res.success) {
                setAllData(res.data);
                setPage(Number(res.currentPage) || 1);
                setTotalPages(Number(res.totalPages) || 1);
                setTotalRecords(Number(res.totalRecords) || 0);
                setPageSize(Number(res.pageSize) || 10);
                setLoading(false);
            }
            else {
                SweetAlert("error", res.message);
                setAllData([]);
                setPage(1);
                setPageSize(10);
                setTotalPages(1);
                setTotalRecords(0);
                setLoading(false);
            }
        }
        finally {
            setLoading(false);
        }

    }
    const filteredData = allData.filter((item) => {
        const keyword = searchText.toLowerCase().trim();

        return (
            item.code?.toLowerCase().includes(keyword) ||
            item.description?.toLowerCase().includes(keyword) ||
            unixTimestampToDate(item.time_cre)?.toLowerCase().includes(keyword) ||
            unixTimestampToDate(item.time_up)?.toLowerCase().includes(keyword)
        );
    });
    const handleResetProgramLearningOutcomeFormData = () => {
        setModalOpen(false);
        setModalMode("create");
        setFormData((prev) =>
            ({ ...prev, code: "", Description: "" }));
    }
    useEffect(() => {
        LoadSelectProgramLearningOutcome();
    }, []);
    useEffect(() => {
        LoadData();
    }, [page]);
    useEffect(() => {
        LoadData();
    }, [pageSize]);
    // Performance Indicators
    const [performanceIndicatorsData, setPerformanceIndicatorsData] = useState<any[]>([]);
    const [performanceIndicatorsTotalRecords, setPerformanceIndicatorsTotalRecords] = useState(0);
    const [performanceIndicatorsTotalPages, setPerformanceIndicatorsTotalPages] = useState(1);
    const [performanceIndicatorsPage, setPerformanceIndicatorsPage] = useState(1);
    const [performanceIndicatorsPageSize, setPerformanceIndicatorsPageSize] = useState(10);
    const [performanceIndicatorsModalOpen, setPerformanceIndicatorsModalOpen] = useState(false);
    const [performanceIndicatorsModalMode, setPerformanceIndicatorsModalMode] = useState<"create" | "edit">("create");

    interface PerformanceIndicatorsFormData {
        id_Plo: number | null;
        code_pi: string;
        description_pi: string;
        id_PI: number | null;
        order_index_pi: number | null;
    }
    const [performanceIndicatorsFormData, setPerformanceIndicatorsFormData] = useState<PerformanceIndicatorsFormData>({
        id_Plo: null,
        id_PI: null,
        order_index_pi: null,
        code_pi: "",
        description_pi: "",
    });
    const headersPerformanceIndicators = [
        { label: "STT", key: "" },
        { label: "Tên chỉ tiêu hiệu quả học tập", key: "code" },
        { label: "Mô tả chỉ tiêu hiệu quả học tập", key: "description" },
        { label: "Thứ tự", key: "order_index" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];
    const handleViewPerformanceIndicators = async (id_Plo: number, code: string) => {
        setLoading(true);
        try {
            setPerformanceIndicatorsFormData((prev) => ({ ...prev, id_Plo: id_Plo, code: code }));
            setFormData((prev) => ({ ...prev, code: code }));
            setModalOpen(false);
            setModalMode("create");
            setPerformanceIndicatorsModalOpen(true);
            const res = await ProgramLearningOutcomeAPI.LoadListPerformanceIndicators({ id_Plo: id_Plo });
            if (res.success) {
                setPerformanceIndicatorsData(res.data);
                setPerformanceIndicatorsTotalRecords(res.totalRecords);
                setPerformanceIndicatorsTotalPages(res.totalPages);
                setPerformanceIndicatorsPage(Number(res.currentPage) || 1);
                setPerformanceIndicatorsPageSize(Number(res.pageSize) || 10);
            }
            else {
                SweetAlert("error", res.message);
                setPerformanceIndicatorsData([]);
                setPerformanceIndicatorsTotalRecords(0);
                setPerformanceIndicatorsTotalPages(1);
                setPerformanceIndicatorsPage(1);
                setPerformanceIndicatorsPageSize(10);
            }
        }
        finally {
            setLoading(false);
        }

    }
    const handleInputChangePerformanceIndicators = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPerformanceIndicatorsFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "id_PI") {
            setPerformanceIndicatorsFormData((prev) => ({ ...prev, id_PI: Number(value) }));
        }
    }
    const handleAddNewPerformanceIndicators = async () => {
        setLoading(true);
        try {
            const res = await ProgramLearningOutcomeAPI.AddPerformanceIndicators({
                id_Plo: Number(performanceIndicatorsFormData.id_Plo),
                code_pi: performanceIndicatorsFormData.code_pi,
                description_pi: performanceIndicatorsFormData.description_pi,
                order_index_pi: Number(performanceIndicatorsFormData.order_index_pi)
            });
            if (res.success) {
                SweetAlert("success", res.message);
                handleViewPerformanceIndicators(Number(performanceIndicatorsFormData.id_Plo), performanceIndicatorsFormData.code_pi);
            }
            else {
                SweetAlert("error", res.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleEditPerformanceIndicators = async (id_PI: number) => {
        const res = await ProgramLearningOutcomeAPI.InfoPerformanceIndicators({ id_PI: id_PI });
        if (res.success) {
            setPerformanceIndicatorsFormData((prev) => ({ ...prev, id_PI: id_PI, code_pi: res.data.code, description_pi: res.data.description, order_index: Number(res.data.order_index) }));
            setPerformanceIndicatorsModalOpen(true);
            setPerformanceIndicatorsModalMode("edit");
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleUpdatePerformanceIndicators = async () => {
        setLoading(true);
        try {
            const res = await ProgramLearningOutcomeAPI.UpdatePerformanceIndicators({ id_PI: Number(performanceIndicatorsFormData.id_PI), code_pi: performanceIndicatorsFormData.code_pi, description_pi: performanceIndicatorsFormData.description_pi, order_index_pi: Number(performanceIndicatorsFormData.order_index_pi) });
            if (res.success) {
                SweetAlert("success", res.message);
                handleViewPerformanceIndicators(Number(performanceIndicatorsFormData.id_Plo), performanceIndicatorsFormData.code_pi);
            }
            else {
                SweetAlert("error", res.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleDeletePerformanceIndicators = async (id_PI: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Chỉ tiêu hiệu quả học tập này, bạn muốn xóa?");
        if (confirm) {
            setLoading(true);
            try {
                const res = await ProgramLearningOutcomeAPI.DeletePerformanceIndicators({ id_PI: id_PI });
                if (res.success) {
                    SweetAlert("success", res.message);
                    handleViewPerformanceIndicators(Number(performanceIndicatorsFormData.id_Plo), performanceIndicatorsFormData.code_pi);
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
    const handleResetFormData = () => {
        setPerformanceIndicatorsFormData((prev) =>
            ({ ...prev, order_index_pi: null, code_pi: "", description_pi: "" }));
    }
    const handleResetPerformanceIndicatorsFormData = () => {
        setPerformanceIndicatorsModalMode("create");
        handleResetFormData();
    }

    const closePerformanceIndicatorsModal = () => {
        setPerformanceIndicatorsModalOpen(false);
        setPerformanceIndicatorsModalMode("create");
        setPerformanceIndicatorsFormData({
            id_Plo: null,
            id_PI: null,
            order_index_pi: null,
            code_pi: "",
            description_pi: "",
        });
    }
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Chuẩn đầu ra chương trình đào tạo
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3 align-items-end">
                                <div className="col-md-8 mb-3 mb-md-0">
                                    <label className="ceo-label">Chương trình đào tạo</label>
                                    <Select
                                        options={selectProgram}
                                        value={selectProgram.find((item) => item.value === formData.Id_Program)}
                                        onChange={(option: any) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                Id_Program: option ? option.value : null,
                                            }))
                                        }
                                        placeholder="Chọn chương trình đào tạo"
                                        isClearable
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label className="ceo-label">Tìm kiếm</label>
                                    <input
                                        type="text"
                                        className="form-control ceo-input"
                                        placeholder="🔍 Nhập từ khóa bất kỳ để tìm..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                            </div>
                            <hr />

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-butterfly" onClick={handleAddNewProgramLearningOutcome} >
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button className="btn btn-ceo-blue" onClick={LoadData} disabled={loading} >
                                        <i className="fas fa-filter mr-1" /> Lọc dữ liệu
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
                                {formData.Id_Program == null ? <tr>
                                    <td colSpan={headers.length} className="text-center text-danger">
                                        Vui lòng chọn chương trình đào tạo để xem danh sách chuẩn đầu ra chương trình đào tạo
                                    </td>
                                </tr> : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id_Plo}>
                                            <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td data-label="Tên chuẩn đầu ra chương trình đào tạo" className="formatSo">{item.code}</td>
                                            <td data-label="Nội dung chuẩn đầu ra chương trình đào tạo">{item.description}</td>
                                            <td data-label="Thứ tự" className="formatSo">{item.order_index}</td>
                                            <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td data-label="Tổng PI" className="formatSo">{item.total_pi}</td>
                                            <td data-label="*" className="formatSo">
                                                <div className="d-flex justify-content-center flex-wrap gap-3">
                                                    <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleEditProgramLearningOutcome(item.id_Plo)}>
                                                        <i className="anticon anticon-edit me-1" /> Sửa
                                                    </button>
                                                    <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteProgramLearningOutcome(item.id_Plo)}>
                                                        <i className="anticon anticon-delete me-1" /> Xóa
                                                    </button>
                                                    <button className="btn btn-sm btn-ceo-green" onClick={() => handleViewPerformanceIndicators(item.id_Plo, item.code)}>
                                                        <i className="anticon anticon-eye me-1" /> Xem chi tiết PI
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
                title={modalMode === "create" ? "Thêm mới Chuẩn đầu ra chương trình đào tạo" : "Chỉnh sửa Chuẩn đầu ra chương trình đào tạo"}
                onClose={() => {
                    handleResetProgramLearningOutcomeFormData();
                }}
                onSave={handleSaveProgramLearningOutcome}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label ceo-label">Tên chuẩn đầu ra chương trình đào tạo</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control ceo-input" name="code" value={formData.code ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Nội dung chuẩn đầu ra chương trình đào tạo</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control ceo-input" name="Description" value={formData.Description ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="ceo-label col-sm-2 col-form-label">Thứ tự</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control ceo-input" name="order_index" value={formData.order_index ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal
                isOpen={performanceIndicatorsModalOpen}
                title={`Danh sách Chỉ tiêu hiệu quả học tập của ${formData.code}`}
                onClose={closePerformanceIndicatorsModal}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="ceo-label col-sm-2 col-form-label">Tên chỉ tiêu hiệu quả học tập</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control ceo-input" name="code_pi" value={performanceIndicatorsFormData.code_pi ?? ""} onChange={handleInputChangePerformanceIndicators} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="ceo-label col-sm-2 col-form-label">Mô tả chỉ tiêu hiệu quả học tập</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control ceo-input" name="description_pi" value={performanceIndicatorsFormData.description_pi ?? ""} onChange={handleInputChangePerformanceIndicators} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="ceo-label col-sm-2 col-form-label">Thứ tự</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control ceo-input" name="order_index_pi" value={performanceIndicatorsFormData.order_index_pi ?? ""} onChange={handleInputChangePerformanceIndicators} />
                        </div>
                    </div>
                </form>
                <div className="d-flex justify-content-end flex-wrap gap-3">
                    {performanceIndicatorsModalMode === "create" && (
                        <button className="btn btn-ceo-butterfly" onClick={handleAddNewPerformanceIndicators}>
                            <i className="fas fa-plus-circle mr-1" /> Thêm mới
                        </button>
                    )}
                    {performanceIndicatorsModalMode === "edit" && (
                        <button className="btn btn-ceo-butterfly" onClick={handleUpdatePerformanceIndicators}>
                            <i className="fas fa-save mr-1" /> Cập nhật
                        </button>
                    )}
                    <button className="btn btn-ceo-yell ow" onClick={handleResetPerformanceIndicatorsFormData}>
                        <i className="fas fa-undo mr-1" /> Reset form
                    </button>
                </div>

                <hr />
                <h5 className="text-center text-uppercase">Danh sách Chỉ tiêu hiệu quả học tập</h5>
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                {headersPerformanceIndicators.map((h, idx) => (
                                    <th key={idx}>{h.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {performanceIndicatorsData.map((item, index) => (
                                <tr key={item.id_PI}>
                                    <td data-label="STT" className="formatSo">{(performanceIndicatorsPage - 1) * performanceIndicatorsPageSize + index + 1}</td>
                                    <td data-label="Tên chỉ tiêu hiệu quả học tập" className="formatSo">{item.code}</td>
                                    <td data-label="Mô tả chỉ tiêu hiệu quả học tập">{item.description}</td>
                                    <td data-label="Thứ tự" className="formatSo">{item.order_index}</td>
                                    <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                    <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                    <td data-label="*" className="formatSo">
                                        <button
                                            className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                            onClick={() => handleEditPerformanceIndicators(item.id_PI)}
                                        >
                                            <i className="anticon anticon-edit" />
                                        </button>
                                        <button
                                            className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                                            onClick={() => handleDeletePerformanceIndicators(item.id_PI)}
                                        >
                                            <i className="anticon anticon-delete" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {performanceIndicatorsData.length === 0 && (
                                <tr>
                                    <td colSpan={headersPerformanceIndicators.length} className="text-center text-danger">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span>
                        Tổng số: {performanceIndicatorsTotalRecords} bản ghi | Trang {performanceIndicatorsPage}/{performanceIndicatorsTotalPages}
                    </span>
                    <div>
                        <button
                            className="btn btn-secondary btn-sm mr-2"
                            disabled={performanceIndicatorsPage <= 1}
                            onClick={() => setPerformanceIndicatorsPage(performanceIndicatorsPage - 1)}
                        >
                            Trang trước
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={performanceIndicatorsPage >= performanceIndicatorsTotalPages}
                            onClick={() => setPerformanceIndicatorsPage(performanceIndicatorsPage + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}