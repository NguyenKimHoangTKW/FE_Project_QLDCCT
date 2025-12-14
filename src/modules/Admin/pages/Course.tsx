import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate, URL_API_ADMIN } from "../../../URL_Config";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import Loading from "../../../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { CourseAdminAPI } from "../../../api/Admin/Course";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
function CourseInterfaceAdmin() {
    const didFetch = useRef(false);
    const navigate = useNavigate();
    const [listKiemTraHocPhanBatBuocFilter, setListKiemTraHocPhanBatBuocFilter] = useState<any[]>([]);
    const [lisNhomHocPhanFilter, setLisNhomHocPhanFilter] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [allData, setAllData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [listKeyYearSemesterFilter, setListKeyYearSemesterFilter] = useState<any[]>([]);
    const [listSemesterFilter, setListSemesterFilter] = useState<any[]>([]);
    const [listCourseByKeyYear, setListCourseByKeyYear] = useState<any[]>([]);
    const [checkClickKeyYear, setCheckClickKeyYear] = useState(false);
    const [checkClickFilter, setCheckClickFilter] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [rawSearchText, setRawSearchText] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [listDonVi, setListDonVi] = useState<any[]>([]);
    const [totalCountIsSyllabus, setTotalCountIsSyllabus] = useState(0);

    interface OptionFilter {
        id_program: number;
        id_gr_course: number;
        id_isCourse: number;
        id_key_year_semester: number;
        id_semester: number;
        id_faculty: number;
    }
    const [optionFilter, setOptionFilter] = useState<OptionFilter>({
        id_program: 0,
        id_gr_course: 0,
        id_isCourse: 0,
        id_key_year_semester: 0,
        id_semester: 0,
        id_faculty: 0,
    });

    const GetListDonVi = async () => {
        const res = await CourseAdminAPI.GetListDonVi();
        if (res.success) {
            setListDonVi(res.data);
            setOptionFilter((prev) => ({ ...prev, id_faculty: Number(res.data[0].id_faculty) }));
        }
        else {
            setListDonVi([]);
        }
    }
    const GetListCTDTByDonVi = async () => {
        const res = await CourseAdminAPI.GetListCTDTByDonVi({ id_faculty: Number(optionFilter.id_faculty) });
        if (res.success) {
            setListCTDT(res.data);
            setOptionFilter((prev) => ({ ...prev, id_program: 0 }));
        }
        else {
            setListCTDT([]);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOptionFilter((prev) => ({ ...prev, [name]: value }));
        if (name === "id_faculty_filter") {
            setOptionFilter((prev) => ({ ...prev, id_faculty: Number(value) }));
        }
        if (name === "id_program_filter") {
            setOptionFilter((prev) => ({ ...prev, id_program: Number(value) }));
        }
        if (name === "id_isCourse_filter") {
            setOptionFilter((prev) => ({ ...prev, id_isCourse: Number(value) }));
        }
        if (name === "id_gr_course_filter") {
            setOptionFilter((prev) => ({ ...prev, id_gr_course: Number(value) }));
        }
        if (name === "id_key_year_semester_filter") {
            setOptionFilter((prev) => ({ ...prev, id_key_year_semester: Number(value) }));
        }
        if (name === "id_semester_filter") {
            setOptionFilter((prev) => ({ ...prev, id_semester: Number(value) }));
        }
    }
    const GetDataListOptionCourse = async () => {
        const res = await CourseAdminAPI.GetListOptionCourse({ id_faculty: Number(optionFilter.id_faculty) });
        setListKiemTraHocPhanBatBuocFilter(res.is_hoc_phan);
        setLisNhomHocPhanFilter(res.nhom_hoc_phan);
        setListKeyYearSemesterFilter(res.keyYearSemester);
        setListSemesterFilter(res.semester);
    }

    const headers = [
        { label: "STT", key: "" },
        { label: "Thuộc khóa học", key: "name_key_year_semester" },
        { label: "Thuộc học kỳ", key: "name_semester" },
        { label: "Thuộc CTĐT", key: "name_program" },
        { label: "Mã học phần", key: "code_course" },
        { label: "Tên học phần", key: "name_course" },
        { label: "Kiểm tra học phần bắt buộc", key: "name" },
        { label: "Nhóm học phần", key: "name_gr_course" },
        { label: "Số giờ lý thuyết", key: "totalTheory" },
        { label: "Số giờ thực hành", key: "totalPractice" },
        { label: "Số tín chỉ", key: "credits" },
        { label: "Ngày tạo", key: "tim_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];

    const GetListCourseByKeyYear = async () => {
        setLoading(true);
        try {
            const res = await CourseAdminAPI.GetListCourseByKeyYear({ id_key_year_semester: Number(optionFilter.id_key_year_semester), id_program: Number(optionFilter.id_program) });
            if (res.success) {
                setListCourseByKeyYear(res.data);
                SweetAlert("success", res.message);
                setTotalCount(res.total_course);
                setTotalCountIsSyllabus(res.total_syllabus);
            }
            else {
                SweetAlert("error", res.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleClickKeyYearTrue = () => {
        if (Number(optionFilter.id_key_year_semester) === 0) {
            SweetAlert("error", "Vui lòng chọn khóa học trước để có thể lọc tính năng này");
            return;
        }
        else {
            setCheckClickKeyYear(true);
            GetListCourseByKeyYear();
        }
    }
    const handleClickKeyYearFalse = () => {
        setCheckClickKeyYear(false);
        ShowData();
        setListCourseByKeyYear([]);

    }
    const handleClickFilter = () => {
        if(listKeyYearSemesterFilter.length === 0){
            SweetAlert("warning", "Đơn vị này không có khóa học, không thể lọc dữ liệu");
            return;
        }
        if(listSemesterFilter.length === 0){
            SweetAlert("warning", "Đơn vị này không có học kỳ, không thể lọc dữ liệu");
            return;
        }
        setCheckClickFilter(true);
        ShowData();
    }
    const ShowData = async () => {
        setLoading(true);
        try {
            const res = await CourseAdminAPI.GetListCourse({
                id_gr_course: Number(optionFilter.id_gr_course || null),
                id_key_year_semester: Number(optionFilter.id_key_year_semester || null),
                id_semester: Number(optionFilter.id_semester || null),
                id_program: Number(optionFilter.id_program || null),
                id_isCourse: Number(optionFilter.id_isCourse || null),
                id_faculty: Number(optionFilter.id_faculty || null),
                Page: page,
                PageSize: pageSize,
                searchTerm: searchText,
            });
            if (res.success) {
                setAllData(res.data);
                setTotalRecords(Number(res.totalRecords) || 0);
                setTotalPages(Number(res.totalPages) || 1);
                setPageSize(Number(res.pageSize) || 10);
                setTotalCount(res.total_course);
                setTotalCountIsSyllabus(res.total_syllabus);
            } else {
                setAllData([]);
                setTotalRecords(0);
                setTotalPages(1);
                setPageSize(10);
                setTotalRecords(0);
                setTotalCount(res.total_course);
                setTotalCountIsSyllabus(res.total_syllabus);
            }
        }
        finally {
            setLoading(false);
        }
    }

    const handleExportExcel = async () => {
        setLoading(true);

        try {
            const res = await CourseAdminAPI.ExportExcel({
                id_gr_course: Number(optionFilter.id_gr_course || 0),
                id_key_year_semester: Number(optionFilter.id_key_year_semester || 0),
                id_semester: Number(optionFilter.id_semester || 0),
                id_program: Number(optionFilter.id_program || 0),
                id_isCourse: Number(optionFilter.id_isCourse || 0),
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
    const handleExportExcelIsStatus = async () => {
        setLoading(true);

        try {
            const res = await CourseAdminAPI.ExportExcelIsStatus({
                id_gr_course: Number(optionFilter.id_gr_course || 0),
                id_key_year_semester: Number(optionFilter.id_key_year_semester || 0),
                id_semester: Number(optionFilter.id_semester || 0),
                id_program: Number(optionFilter.id_program || 0),
                id_isCourse: Number(optionFilter.id_isCourse || 0),
                id_faculty: Number(optionFilter.id_faculty || 0),
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
    const handleExportMultipleWord = async () => {
        if (optionFilter.id_key_year_semester === 0) {
            SweetAlert("error", "Vui lòng chọn khóa học trong bộ lọc để sử dụng chức năng!");
            return;
        }

        const res = await fetch(`${URL_API_ADMIN}/course/export-multi-word`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                id_key_year_semester: Number(optionFilter.id_key_year_semester),
                id_program: Number(optionFilter.id_program)
            })
        });

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const jsonData = await res.json();
            if (!jsonData.success) {
                SweetAlert("error", jsonData.message || "Có lỗi xảy ra");
                return;
            }
        }

        const blob = await res.blob();
        saveAs(blob, `All_Syllabus.zip`);
        SweetAlert("success", "Xuất file thành công!");
    };


    useEffect(() => {
        if (!didFetch.current) {
            GetListDonVi();
            didFetch.current = true;
        }
    }, []);
    useEffect(() => {
        if (optionFilter.id_faculty) {
            setListCTDT([]);
            setListKeyYearSemesterFilter([]);
            setListSemesterFilter([]);
            GetListCTDTByDonVi();
            GetDataListOptionCourse();
        }
    }, [optionFilter.id_faculty]);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchText(rawSearchText);
            setPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [rawSearchText]);
    useEffect(() => {
        ShowData();
        setCheckClickFilter(true);
    }, [searchText, page, pageSize]);
    const palette = ['#ffc107', '#28a745'];
    const platforms = [
        { id: 0, value: totalCount, label: "Tống số học phần trong khóa học" },
        { id: 1, value: totalCountIsSyllabus, label: "Tống số học phần đã hoàn thành đề cương" },
    ];

    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Học phần toàn trường
                        </h2>
                        <hr />
                        <fieldset className="ceo-panel">
                            <legend className="ceo-title">Chức năng</legend>

                            {/* HÀNG 1: FILTER */}
                            <div className="row g-3 mb-2">
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Danh sách đơn vị"
                                        name="id_faculty_filter"
                                        value={optionFilter.id_faculty}
                                        onChange={handleInputChange}
                                        options={listDonVi.map(item => ({
                                            value: item.id_faculty,
                                            text: item.name_faculty
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Danh sách chương trình đào tạo"
                                        name="id_program_filter"
                                        value={optionFilter.id_program}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 0, text: "Tất cả" },
                                            ...listCTDT.map(item => ({
                                                value: item.id_program,
                                                text: item.name_program
                                            }))
                                        ]}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Kiểm tra học phần bắt buộc"
                                        name="id_isCourse_filter"
                                        value={optionFilter.id_isCourse}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 0, text: "Tất cả" },
                                            ...listKiemTraHocPhanBatBuocFilter.map(x => ({
                                                value: x.value,
                                                text: x.text
                                            }))
                                        ]}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Nhóm học phần"
                                        name="id_gr_course_filter"
                                        value={optionFilter.id_gr_course}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 0, text: "Tất cả" },
                                            ...lisNhomHocPhanFilter.map(x => ({
                                                value: x.value,
                                                text: x.text
                                            }))
                                        ]}
                                    />
                                </div>
                                <div className="col-md-4">
                                    {listKeyYearSemesterFilter.length === 0 ? (
                                        <div className="alert alert-warning mb-0" style={{marginTop: "27px"}}>
                                            ⚠️ Đơn vị này <strong>chưa tạo khóa học</strong>
                                        </div>
                                    ) : (
                                    <CeoSelect2
                                        label="Khóa học"
                                        name="id_key_year_semester_filter"
                                        value={optionFilter.id_key_year_semester}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 0, text: "Tất cả" },
                                            ...listKeyYearSemesterFilter.map(x => ({
                                                value: x.value,
                                                text: x.text
                                            }))
                                        ]}
                                    />
                                    )}
                                </div>

                                <div className="col-md-4">
                                    {listSemesterFilter.length === 0 ? (
                                        <div className="alert alert-warning mb-0" style={{marginTop: "27px"}}>
                                            ⚠️ Đơn vị này <strong>chưa tạo học kỳ</strong>
                                        </div>
                                    ) : (
                                    <CeoSelect2
                                        label="Học kỳ"
                                        name="id_semester_filter"
                                        value={optionFilter.id_semester}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 0, text: "Tất cả" },
                                            ...listSemesterFilter.map(x => ({
                                                value: x.value,
                                                text: x.text
                                            }))
                                        ]}
                                    />
                                    )}
                                </div>
                            </div>
                            {/* ACTION BUTTONS */}
                            <div className="row mt-4">
                                <div className="col-12 d-flex flex-wrap gap-3 justify-content-end">
                                    <button className="btn btn-ceo-butterfly" onClick={handleExportExcel}>
                                        <i className="fas fa-file-excel"></i> Xuất Excel dữ liệu đang hiển thị
                                    </button>
                                    <button className="btn btn-ceo-green" onClick={handleExportExcelIsStatus}>
                                        <i className="fas fa-file-excel"></i> Xuất Excel môn học chưa tồn tại đề cương
                                    </button>
                                    <button className="btn btn-ceo-green" onClick={handleExportMultipleWord}>
                                        <i className="fas fa-file-word"></i> Xuất Word tất cả đề cương
                                    </button>
                                    <button className="btn btn-ceo-blue" onClick={handleClickFilter}>
                                        <i className="fas fa-filter"></i> Lọc dữ liệu
                                    </button>

                                </div>
                            </div>


                            {/* KEY YEAR BUTTONS */}
                            {checkClickFilter && allData.length > 0 && (
                                <>
                                    <hr className="my-4" />

                                    <div className="d-flex justify-content-center flex-wrap gap-4">

                                        <button
                                            className="ceo-action-btn ceo-blue"
                                            onClick={handleClickKeyYearFalse}
                                        >
                                            <i className="fas fa-list-ul"></i>
                                            <span>Danh sách tổng hợp<br />theo CTĐT</span>
                                        </button>

                                        <button
                                            className="ceo-action-btn ceo-green"
                                            onClick={handleClickKeyYearTrue}
                                        >
                                            <i className="fas fa-calendar-alt"></i>
                                            <span>Danh sách theo học kỳ<br />theo CTĐT</span>
                                        </button>

                                    </div>
                                </>

                            )}
                            <hr />
                            {listCourseByKeyYear.length > 0 || allData.length > 0 && (
                                <>
                                    <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                                        <Box flexGrow={1}>
                                            <Typography fontWeight={600} mb={1}>Tỷ lệ tổng số học phần trong khóa học và tổng số học phần đã hoàn thành đề cương</Typography>

                                            <PieChart
                                                series={[
                                                    {
                                                        data: platforms,
                                                        arcLabel: (item) => `${item.value}`,
                                                        arcLabelMinAngle: 10,
                                                    },
                                                ]}
                                                colors={palette}
                                                {...pieParams}
                                            />
                                        </Box>
                                    </Stack>
                                    <p className="text-danger text-center">Tỷ lệ đề cương hoàn thành: {(totalCountIsSyllabus / totalCount * 100).toFixed(2)}%</p>
                                    <Stack direction="row" spacing={3} mt={2}>
                                        <Box sx={{
                                            flex: 1,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: "#f4f7ff",
                                            borderLeft: "5px solid #3f73ff"
                                        }}>
                                            <Typography variant="body2" color="text.secondary">Tổng số học phần</Typography>
                                            <Typography variant="h5" fontWeight={700}>{totalCount}</Typography>
                                        </Box>

                                        <Box sx={{
                                            flex: 1,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: "#f9fff4",
                                            borderLeft: "5px solid #2ecc71"
                                        }}>
                                            <Typography variant="body2" color="text.secondary">Đã hoàn thành đề cương</Typography>
                                            <Typography variant="h5" fontWeight={700}>{totalCountIsSyllabus}</Typography>
                                        </Box>
                                    </Stack>
                                </>
                            )}
                        </fieldset>

                    </div>

                    {checkClickKeyYear === true ? (
                        <div className="table-responsive mt-3">
                            <table className="table table-bordered table-rounded">
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ width: "8%" }}>Mã môn học</th>
                                        <th style={{ width: "25%" }}>Tên học phần</th>
                                        <th style={{ width: "15%" }}>Kiểm tra học phần bắt buộc</th>
                                        <th style={{ width: "15%" }}>Nhóm học phần</th>
                                        <th style={{ width: "10%" }}>Số giờ lý thuyết</th>
                                        <th style={{ width: "10%" }}>Số giờ thực hành</th>
                                        <th style={{ width: "8%" }}>Số tín chỉ</th>
                                        <th style={{ width: "10%" }}>Trạng thái đề cương</th>
                                    </tr>
                                </thead>

                                {Array.isArray(listCourseByKeyYear) && listCourseByKeyYear.length > 0 ? (
                                    listCourseByKeyYear.map((semester: any, sIdx: number) => (
                                        <tbody key={sIdx} style={{ color: "black" }}>
                                            <tr className="table-secondary" >
                                                <td colSpan={13} className="fw-bold text-start" style={{ backgroundColor: "#bfd1ec" }}>
                                                    {semester.name_se}
                                                </td>
                                            </tr>

                                            {semester.course.length > 0 ? (
                                                semester.course.map((course: any, cIdx: number) => (
                                                    <tr key={course.id_course} style={{ backgroundColor: "white" }}>
                                                        <td className="text-center">{course.code_course}</td>
                                                        <td>{course.name_course}</td>
                                                        <td >{course.name_isCourse}</td>
                                                        <td >{course.name_gr_course}</td>
                                                        <td className="text-center">{course.totalTheory}</td>
                                                        <td className="text-center">{course.totalPractice}</td>
                                                        <td className="text-center">{course.credits}</td>
                                                        <td>{course.is_syllabus == true ? <span className="text-success">Đã hoàn thiện đề cương</span> : <span className="text-danger">Chưa hoàn thiện đề cương</span>}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="text-center text-muted">
                                                        Không có môn học trong học kỳ này
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    ))
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan={8} className="text-center text-danger">
                                                Chưa có dữ liệu học phần trong khóa học này
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-rounded">
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
                                                <tr key={item.id_course}>
                                                    <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                                    <td>{item.name_key_year_semester}</td>
                                                    <td>{item.name_semester}</td>
                                                    <td>{item.name_program}</td>
                                                    <td className="formatSo">{item.code_course}</td>
                                                    <td>{item.name_course}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.name_gr_course}</td>
                                                    <td className="formatSo">{item.totalTheory}</td>
                                                    <td className="formatSo">{item.totalPractice}</td>
                                                    <td className="formatSo">{item.credits}</td>
                                                    <td>{unixTimestampToDate(item.time_cre)}</td>
                                                    <td>{unixTimestampToDate(item.time_up)}</td>
                                                    <td>{item.is_syllabus == true ? <span className="text-success">Đã hoàn thiện đề cương</span> : <span className="text-danger">Chưa hoàn thiện đề cương</span>}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={headers.length} className="text-center text-danger">
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
                        </>
                    )}
                </div>
            </div>
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
    );
}
export default CourseInterfaceAdmin;
const pieParams = {
    height: 200,
    margin: { right: 5 },
    hideLegend: true,
};