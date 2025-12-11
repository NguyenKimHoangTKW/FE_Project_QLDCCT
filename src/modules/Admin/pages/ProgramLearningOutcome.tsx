import { useEffect, useState } from "react";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import Loading from "../../../components/ui/Loading";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import { CourseAdminAPI } from "../../../api/Admin/Course";
import { ProgramLearningOutcomeAdminAPI } from "../../../api/Admin/ProgramLearningOutcome";

export default function ProgramLearningOutcomeInterfaceAdmin() {
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
    const [selectedKeyYear, setSelectedKeyYear] = useState<any[]>([]);
    const [listDonVi, setListDonVi] = useState<any[]>([]);
    const [listCTDT, setListCTDT] = useState<any[]>([]);
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
    interface OptionFilter {
        id_faculty: number;
        id_program: number;
        id_key_year_semester: number;
    }
    const [optionFilter, setOptionFilter] = useState<OptionFilter>({
        id_faculty: 0,
        id_program: 0,
        id_key_year_semester: 0,
    });
    const GetListDonVi = async () => {
        const res = await CourseAdminAPI.GetListDonVi();
        if (res.success) {
            setListDonVi(res.data);
        }
        else {
            setListDonVi([]);
        }
    }
    const GetListCTDTByDonVi = async () => {
        const res = await CourseAdminAPI.GetListCTDTByDonVi({ id_faculty: Number(optionFilter.id_faculty) });
        if (res.success) {
            setListCTDT(res.data);
        }
        else {
            setListCTDT([]);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "id_faculty_filter") {
            setOptionFilter((prev) => ({ ...prev, id_faculty: Number(value) }));
        }
        if (name === "id_program_filter") {
            setOptionFilter((prev) => ({ ...prev, id_program: Number(value) }));
        }
        if (name === "id_key_year_semester_filter") {
            setOptionFilter((prev) => ({ ...prev, id_key_year_semester: Number(value) }));
        }
    }
    const LoadSelectProgramLearningOutcome = async () => {
        setLoading(true);
        const res = await ProgramLearningOutcomeAdminAPI.LoadSelectProgramLearningOutcome({ id_faculty: optionFilter.id_faculty });
        const formattedKeyYear = res.keySemester.map((item: any) => ({
            value: item.id_key_year_semester,
            label: item.name_key_year_semester,
        }));
        setSelectedKeyYear(formattedKeyYear);
        setOptionFilter((prev) => ({ ...prev, id_key_year_semester: Number(formattedKeyYear[0].value) }));
        setLoading(false);
    }
    const LoadData = async () => {
        setLoading(true);
        try {
            const res = await ProgramLearningOutcomeAdminAPI.GetListProgramLearningOutcome({ Id_Program: Number(optionFilter.id_program), id_key_semester: Number(optionFilter.id_key_year_semester), Page: page, PageSize: pageSize, searchTerm: searchText });
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

    useEffect(() => {
        GetListDonVi();
    }, []);
    useEffect(() => {
        if (optionFilter.id_faculty) {
            GetListCTDTByDonVi();
            LoadSelectProgramLearningOutcome();
        }
    }, [optionFilter.id_faculty]);
    useEffect(() => {
        if (optionFilter.id_program && optionFilter.id_key_year_semester) {
            LoadData();
        }
    }, [optionFilter.id_program, optionFilter.id_key_year_semester, page, pageSize, searchText]);
    // Performance Indicators
    const [performanceIndicatorsData, setPerformanceIndicatorsData] = useState<any[]>([]);
    const [performanceIndicatorsTotalRecords, setPerformanceIndicatorsTotalRecords] = useState(0);
    const [performanceIndicatorsTotalPages, setPerformanceIndicatorsTotalPages] = useState(1);
    const [performanceIndicatorsPage, setPerformanceIndicatorsPage] = useState(1);
    const [performanceIndicatorsPageSize, setPerformanceIndicatorsPageSize] = useState(10);
    const [performanceIndicatorsModalOpen, setPerformanceIndicatorsModalOpen] = useState(false);

    const headersPerformanceIndicators = [
        { label: "STT", key: "" },
        { label: "Tên chỉ tiêu hiệu quả học tập", key: "code" },
        { label: "Mô tả chỉ tiêu hiệu quả học tập", key: "description" },
        { label: "Thứ tự", key: "order_index" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
    ];
    const handleViewPerformanceIndicators = async (id_Plo: number, code: string) => {
        setLoading(true);
        try {
            setModalOpen(false);
            setModalMode("create");
            setPerformanceIndicatorsModalOpen(true);
            const res = await ProgramLearningOutcomeAdminAPI.LoadListPerformanceIndicators({ id_Plo: id_Plo });
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
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Chuẩn đầu ra chương trình đào tạo toàn trường
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3 align-items-end">
                            <div className="col-md-4">
                                    <CeoSelect2
                                        label="Đơn vị"
                                        name="id_faculty_filter"
                                        value={optionFilter.id_faculty}
                                        onChange={handleInputChange}
                                        options={listDonVi.map((item: any) => ({
                                            value: item.id_faculty,
                                            text: item.name_faculty
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Chương trình đào tạo"
                                        name="id_program_filter"
                                        value={optionFilter.id_program}
                                        onChange={handleInputChange}
                                        options={listCTDT.map(item => ({
                                            value: item.id_program,
                                            text: item.name_program
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Khóa học"
                                        name="id_key_year_semester_filter"
                                        value={optionFilter.id_key_year_semester}
                                        onChange={handleInputChange}
                                        options={selectedKeyYear.map((item: any) => ({
                                            value: item.value,
                                            text: item.label
                                        }))}
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
                                {optionFilter.id_program == 0 ? <tr>
                                    <td colSpan={headers.length} className="text-center text-danger">
                                        Vui lòng chọn đơn vị và chương trình đào tạo để xem danh sách chuẩn đầu ra chương trình đào tạo
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
                                            Không có dữ liệu chuẩn đầu ra chương trình đào tạo trong chương trình này
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
                isOpen={performanceIndicatorsModalOpen}
                title={`Danh sách Chỉ tiêu hiệu quả học tập của`}
                onClose={() => setPerformanceIndicatorsModalOpen(false)}
            >

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