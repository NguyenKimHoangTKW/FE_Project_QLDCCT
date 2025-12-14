import { useEffect, useRef, useState } from "react";
import { CourseDonViAPI } from "../../../api/DonVi/CourseAPI";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Swal from "sweetalert2";
import Loading from "../../../components/ui/Loading";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { PieChart } from "@mui/x-charts";
function CourseInterfaceDonVi() {
  const didFetch = useRef(false);
  const [listKiemTraHocPhanBatBuoc, setListKiemTraHocPhanBatBuoc] = useState<any[]>([]);
  const [lisNhomHocPhan, setLisNhomHocPhan] = useState<any[]>([]);
  const [listKiemTraHocPhanBatBuocFilter, setListKiemTraHocPhanBatBuocFilter] = useState<any[]>([]);
  const [lisNhomHocPhanFilter, setLisNhomHocPhanFilter] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allData, setAllData] = useState<any[]>([]);
  const [listUserWriteCourse, setListUserWriteCourse] = useState<any[]>([]);
  const [showListUserWriteCourse, setShowListUserWriteCourse] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [listCTDT, setListCTDT] = useState<any[]>([]);
  const [selectedIdCourse, setSelectedIdCourse] = useState<number | null>(null);
  const [openFunction, setOpenFunction] = useState(false);
  const [listKeyYearSemester, setListKeyYearSemester] = useState<any[]>([]);
  const [listSemester, setListSemester] = useState<any[]>([]);
  const [listCourseByKeyYear, setListCourseByKeyYear] = useState<any[]>([]);
  const [checkClickKeyYear, setCheckClickKeyYear] = useState(false);
  const [logData, setLogData] = useState<any[]>([]);
  const [showLogData, setShowLogData] = useState(false);
  const [openViewSyllabus, setOpenViewSyllabus] = useState(false);
  const [listKeyYearSemesterFilter, setListKeyYearSemesterFilter] = useState<any[]>([]);
  const [openOptionFilter, setOpenOptionFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [rawSearchText, setRawSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountIsSyllabus, setTotalCountIsSyllabus] = useState(0);
  const [listSyllabusByCourseFinal, setListSyllabusByCourseFinal] = useState<{
    message?: string;
    success?: boolean;
    data?: any[];
  }>({});
  const [listSemesterFilter, setListSemesterFilter] = useState<any[]>([]);
  interface FormData {
    id_course: number | null;
    code_course: string;
    name_course: string;
    id_gr_course: number | null;
    credits: number | null;
    id_isCourse: number | null;
    totalPractice: number | null;
    totalTheory: number | null;
    id_key_year_semester: number | null;
    id_semester: number | null;
  }
  const [formData, setFormData] = useState<FormData>({
    id_course: null,
    code_course: "",
    name_course: "",
    id_gr_course: null,
    credits: null,
    id_isCourse: null,
    totalPractice: null,
    totalTheory: null,
    id_key_year_semester: null,
    id_semester: null,
  });

  interface OptionFilter {
    id_ctdt: number;
    id_gr_course: number;
    id_isCourse: number;
    id_key_year_semester: number;
    id_semester: number;
  }
  const [optionFilter, setOptionFilter] = useState<OptionFilter>({
    id_ctdt: 0,
    id_gr_course: 0,
    id_isCourse: 0,
    id_key_year_semester: 0,
    id_semester: 0,
  });
  const GetDataListOptionCourse = async () => {
    const res = await CourseDonViAPI.GetListOptionCourse();
    setListKiemTraHocPhanBatBuoc(res.is_hoc_phan);
    setLisNhomHocPhan(res.nhom_hoc_phan);
    setListKiemTraHocPhanBatBuocFilter(res.is_hoc_phan);
    setLisNhomHocPhanFilter(res.nhom_hoc_phan);
    setListKeyYearSemester(res.keyYearSemester);
    setListSemester(res.semester);
    setListKeyYearSemesterFilter(res.keyYearSemester);
    setListSemesterFilter(res.semester);
    setFormData((prev) => ({
      ...prev,
      id_isCourse: Number(res.is_hoc_phan[0]?.value || 0),
      id_gr_course: Number(res.nhom_hoc_phan[0]?.value || 0),
      id_key_year_semester: Number(res.keyYearSemester[0]?.value || 0),
      id_semester: Number(res.semester[0]?.value || 0),
    }));
  }
  const GetListCTDTByDonVi = async () => {
    const res = await CourseDonViAPI.GetListCTDTByDonVi();
    setListCTDT(res);
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "id_isCourse_filter") {
      setOptionFilter((prev) => ({ ...prev, id_isCourse: Number(value) }));
    }
    if (name === "id_gr_course_filter") {
      setOptionFilter((prev) => ({ ...prev, id_gr_course: Number(value) }));
    }
    if (name === "id_isCourse") {
      setFormData((prev) => ({ ...prev, id_isCourse: Number(value) }));
    }
    if (name === "id_gr_course") {
      setFormData((prev) => ({ ...prev, id_gr_course: Number(value) }));
    }
    if (name === "id_ctdt_filter") {
      setOptionFilter((prev) => ({ ...prev, id_ctdt: Number(value) }));
    }
    if (name === "id_key_year_semester_filter") {
      setOptionFilter((prev) => ({ ...prev, id_key_year_semester: Number(value) }));
    }
    if (name === "id_semester_filter") {
      setOptionFilter((prev) => ({ ...prev, id_semester: Number(value) }));
    }
    if (name === "id_key_year_semester") {
      setFormData((prev) => ({ ...prev, id_key_year_semester: Number(value) }));
    }
    if (name === "id_semester") {
      setFormData((prev) => ({ ...prev, id_semester: Number(value) }));
    }
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
    { label: "Trạng thái đề cương", key: "is_syllabus" },
    { label: "Ngày tạo", key: "tim_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];
  const ShowData = async () => {
    setLoading(true);
    try {
      const res = await CourseDonViAPI.GetListCourse({
        id_gr_course: Number(optionFilter.id_gr_course || null),
        id_key_year_semester: Number(optionFilter.id_key_year_semester || null),
        id_semester: Number(optionFilter.id_semester || null),
        id_program: Number(optionFilter.id_ctdt || null),
        id_isCourse: Number(optionFilter.id_isCourse || null),
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

  const GetListCourseByKeyYear = async () => {
    setLoading(true);
    try {
      const res = await CourseDonViAPI.GetListCourseByKeyYear({ id_key_year_semester: Number(optionFilter.id_key_year_semester), id_program: Number(optionFilter.id_ctdt) });
      if (res.success) {
        setListCourseByKeyYear(res.data);
        SweetAlert("success", res.message);
        setTotalCount(res.total_course);
        setTotalCountIsSyllabus(res.total_syllabus);
      }
      else {
        SweetAlert("error", res.message);
        setTotalCount(res.total_course);
        setTotalCountIsSyllabus(res.total_syllabus);
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
      setAllData([]);
    }
  }
  const handleClickKeyYearFalse = () => {
    setCheckClickKeyYear(false);
    ShowData();
    setListCourseByKeyYear([]);
  }
  const handleSave = async () => {
    setLoading(true);
    try {
      if (modalMode === "create") {
        const res = await CourseDonViAPI.AddNewCourse({
          code_course: formData.code_course,
          id_program: Number(optionFilter.id_ctdt || 0),
          name_course: formData.name_course,
          id_gr_course: Number(formData.id_gr_course || 0),
          credits: Number(formData.credits || 0),
          id_key_year_semester: Number(formData.id_key_year_semester || 0),
          id_semester: Number(formData.id_semester || 0),
          id_isCourse: Number(formData.id_isCourse || 0),
          totalPractice: Number(formData.totalPractice || 0),
          totalTheory: Number(formData.totalTheory || 0),
        });
        if (res.success) {
          ShowData();
          SweetAlert("success", res.message);
          setShowModal(false);
          ShowData();
        } else {
          SweetAlert("error", res.message);
        }
      }
      else {
        const res = await CourseDonViAPI.UpdateCourse({
          id_course: Number(formData.id_course || 0),
          code_course: formData.code_course,
          name_course: formData.name_course,
          id_gr_course: Number(formData.id_gr_course || 0),
          credits: Number(formData.credits || 0),
          id_isCourse: Number(formData.id_isCourse || 0),
          totalPractice: Number(formData.totalPractice || 0),
          totalTheory: Number(formData.totalTheory || 0),
          id_key_year_semester: Number(formData.id_key_year_semester || 0),
          id_semester: Number(formData.id_semester || 0),
        });
        if (res.success) {
          ShowData();
          SweetAlert("success", res.message);
          setShowModal(false);
          ShowData();
        } else {
          SweetAlert("error", res.message);
        }
      }
    }
    finally {
      setLoading(false);
    }

  }
  const AddNewCourse = async () => {
    setShowModal(true);
    setModalMode("create");
  }
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!selectedFile) {
        Swal.fire("Thông báo", "Vui lòng chọn file Excel!", "warning");
        return;
      }
      setLoading(true);
      const res = await CourseDonViAPI.UploadExcelCourse(selectedFile, Number(optionFilter.id_ctdt));

      setLoading(false);
      if (res.success) {
        SweetAlert("success", res.message);
        ShowData();
        setLoading(false);
      } else {
        SweetAlert("error", res.message);
        setLoading(false);
      }
    }
    finally {
      setLoading(false);
    }
  };
  const handleInfo = async (id: number) => {
    const res = await CourseDonViAPI.InfoCourse({ id_course: id });
    if (res.success) {
      setShowModal(true);
      setModalMode("edit");
      setFormData({
        id_course: res.data.id_course,
        code_course: res.data.code_course,
        name_course: res.data.name_course,
        id_gr_course: res.data.id_gr_course,
        credits: res.data.credits,
        id_isCourse: res.data.id_isCourse,
        totalPractice: res.data.totalPractice,
        totalTheory: res.data.totalTheory,
        id_key_year_semester: res.data.id_key_year_semester,
        id_semester: res.data.id_semester,
      });
    }
    else {
      SweetAlert("error", res.message);
    }
  }
  const handleDelete = async (id: number) => {
    const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Học phần này và những dữ liệu liên quan, bạn muốn tiếp tục?");
    if (confirmDel) {
      setLoading(true);
      try {
        const res = await CourseDonViAPI.DeleteCourse({ id_course: id });
        if (res.success) {
          ShowData();
          SweetAlert("success", res.message);
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
  const handleOpenFunction = (id_course: number) => {
    setSelectedIdCourse(Number(id_course));
    setOpenFunction(true);
  }
  const LoadLogCourse = async (id_course: number) => {
    const res = await CourseDonViAPI.GetListLogCourse({ id_course: Number(id_course) });
    setLogData(res);
    setShowLogData(true);
  }
  const handleExportExcel = async () => {
    setLoading(true);

    try {
      const res = await CourseDonViAPI.ExportExcelCourse({
        id_gr_course: Number(optionFilter.id_gr_course || 0),
        id_key_year_semester: Number(optionFilter.id_key_year_semester || 0),
        id_semester: Number(optionFilter.id_semester || 0),
        id_program: Number(optionFilter.id_ctdt || 0),
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
  const handleDownloadTemplate = () => {
    setLoading(true);
    try {
      const link = document.createElement("a");
      link.href = "/file-import/ImportCourse.xlsx";
      link.download = "TemplateImport.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    finally {
      setLoading(false);
    }
  };
  const handleExportExcelIsStatus = async () => {
    setLoading(true);

    try {
      const res = await CourseDonViAPI.ExportExcelIsStatus({
        id_gr_course: Number(optionFilter.id_gr_course || 0),
        id_key_year_semester: Number(optionFilter.id_key_year_semester || 0),
        id_semester: Number(optionFilter.id_semester || 0),
        id_program: Number(optionFilter.id_ctdt || 0),
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
  const handleOpenOptionFilter = () => {
    setOpenOptionFilter(true);
  }

  const LoadListSyllabusByCourseFinal = async () => {
    const res = await CourseDonViAPI.ListSyllabusByCourseFinal({ id_course: Number(selectedIdCourse) });
    if (res.success) {
      setListSyllabusByCourseFinal({
        success: true,
        data: res.data,
        message: res.message,
      });
    }
    else {
      SweetAlert("error", res.message);
      setListSyllabusByCourseFinal({
        success: false,
        data: [],
        message: res.message,
      });
    }
  }
  const handleViewSyllabus = () => {
    setOpenViewSyllabus(true);
    LoadListSyllabusByCourseFinal();
  }
  const handlePreviewSyllabus = (id_syllabus: number) => {
    window.open(`/donvi/preview-syllabus/${id_syllabus}/false`, "_blank");
  }
  const LoadListUserWriteCourse = async (id_course: number) => {
    const res = await CourseDonViAPI.LoadListUserWriteCourse({ id_course: Number(id_course) });
    if (res.success) {
      setListUserWriteCourse(res.data);
      setShowListUserWriteCourse(true);
    }
    else {
      SweetAlert("error", res.message);
      setListUserWriteCourse([]);
    }
  }
  useEffect(() => {
    if (!didFetch.current) {
      GetDataListOptionCourse();
      didFetch.current = true;
    }
  }, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchText(rawSearchText);
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [rawSearchText]);
  useEffect(() => {
    ShowData();
  }, [searchText, page, pageSize]);
  useEffect(() => {
    GetListCTDTByDonVi();
  }, []);
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
              Quản lý Danh sách Học phần thuộc Đơn vị
            </h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo CTĐT"
                    name="id_ctdt_filter"
                    value={optionFilter.id_ctdt}
                    onChange={handleInputChange}
                    options={listCTDT.map(item => ({
                      value: item.id_program,
                      text: item.name_program
                    }))}
                  />

                </div>
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo kiểm tra học phần bắt buộc"
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
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo nhóm học phần"
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
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo khóa học"
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
                </div>
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo học kỳ"
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
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-ceo-butterfly" onClick={AddNewCourse}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button className="btn btn-ceo-green" onClick={handleOpenOptionFilter}>
                    <i className="fas fa-clock"></i> Mở bảng chức năng Excel
                  </button>
                  <button className="btn btn-ceo-blue" onClick={() => ShowData()}>
                    <i className="fas fa-filter mr-1" /> Lọc dữ liệu
                  </button>
                </div>
              </div>
              {/* KEY YEAR BUTTONS */}
              {(allData.length > 0 || listCourseByKeyYear.length > 0) && (
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
              {(listCourseByKeyYear.length > 0 || allData.length > 0) && (
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
          {/*Modal Import*/}
          <div
            className="modal fade"
            id="importExcelModal"
            tabIndex={-1}
            aria-labelledby="importExcelModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Import danh sách học phần từ Excel</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form id="importExcelForm" autoComplete="off">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">File Excel</label>
                      <div className="col-sm-10">
                        <input type="file" className="form-control" name="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                  </form>
                </div>
                <hr />
                <div className="modal-footer">
                  <button type="button" className="btn btn-ceo-green" onClick={handleDownloadTemplate}>Tải file mẫu</button>
                  <button type="button" className="btn btn-ceo-blue" onClick={handleSubmit}>Import</button>
                  <button type="button" className="btn btn-ceo-red" data-dismiss="modal">Đóng</button>
                </div>
              </div>
            </div>
          </div>
          {/*Modal Import*/}
          {checkClickKeyYear === true ? (
            <div className="table-responsive mt-3">
              <table className="table table-bordered table-rounded">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "8%" }}>Mã môn học</th>
                    <th style={{ width: "25%" }}>Tên môn học</th>
                    <th style={{ width: "15%" }}>Môn bắt buộc</th>
                    <th style={{ width: "15%" }}>Nhóm học phần</th>
                    <th style={{ width: "10%" }}>Lý thuyết</th>
                    <th style={{ width: "10%" }}>Thực hành</th>
                    <th style={{ width: "8%" }}>Tín chỉ</th>
                    <th style={{ width: "10%" }}>Trạng thái</th>
                    <th style={{ width: "10%" }}>Hành động</th>
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
                            <td className="text-center">{course.name_isCourse == "Bắt buộc" ? <span className="text-success">X</span> : <span className="text-danger">O</span>}</td>
                            <td >{course.name_gr_course}</td>
                            <td className="text-center">{course.totalTheory}</td>
                            <td className="text-center">{course.totalPractice}</td>
                            <td className="text-center">{course.credits}</td>
                            <td>{course.is_syllabus == true ? <span className="text-success">Đã có đề cương</span> : <span className="text-danger">Chưa có đề cương</span>}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-function-ceo"
                                onClick={() => handleOpenFunction(course.id_course)}
                              >
                                ⚙️ Mở chức năng
                              </button>

                            </td>
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
                      allData.map((item: any, index: number) => (
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
                          <td>{item.is_syllabus == true ? <span className="text-success">Đã hoàn thiện</span> : <span className="text-danger">Chưa hoàn thiện</span>}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-function-ceo"
                              onClick={() => handleOpenFunction(item.id_course)}
                            >
                              ⚙️ Mở chức năng
                            </button>

                          </td>
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

      <Modal
        isOpen={showModal}
        title={modalMode === "create" ? "Thêm mới Học phần" : "Chỉnh sửa Học phần"}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <form id="modal-body" autoComplete="off">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Mã học phần</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="code_course"
                value={formData.code_course}
                className="form-control"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Tên học phần</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="name_course"
                value={formData.name_course}
                className="form-control"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Kiểm tra học phần bắt buộc</label>
            <div className="col-sm-10">
              <select className="form-control" name="id_isCourse" value={formData.id_isCourse || 0} onChange={handleInputChange}>
                {listKiemTraHocPhanBatBuoc.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Nhóm học phần</label>
            <div className="col-sm-10">
              <select className="form-control" name="id_gr_course" value={formData.id_gr_course || 0} onChange={handleInputChange}>
                {lisNhomHocPhan.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Số giờ lý thuyết</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" name="totalTheory" min={1} max={100} value={formData.totalTheory || 1} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Số giờ thực hành</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" name="totalPractice" min={1} max={100} value={formData.totalPractice || 1} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Số tín chỉ</label>
            <div className="col-sm-10">
              <input type="number" className="form-control" name="credits" min={1} max={100} value={formData.credits || 1} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Thuộc khóa học</label>
            <div className="col-sm-10">
              <select className="form-control" name="id_key_year_semester" value={formData.id_key_year_semester || 0} onChange={handleInputChange}>
                {listKeyYearSemester.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Thuộc học kỳ</label>
            <div className="col-sm-10">
              <select className="form-control" name="id_semester" value={formData.id_semester || 0} onChange={handleInputChange}>
                {listSemester.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>


      <Modal
        isOpen={openFunction}
        title={`CHỨC NĂNG HỌC PHẦN`}
        onClose={() => setOpenFunction(false)}
      >
        <div className="action-menu">

          {/* Chỉnh sửa */}
          <div
            className="action-card edit"
            onClick={() => {
              handleInfo(Number(selectedIdCourse));
              setOpenFunction(false);
            }}
          >
            <div className="icon-area">
              <i className="fas fa-edit"></i>
            </div>
            <div className="text-area">
              <h5>Chỉnh sửa học phần</h5>
              <p>Cập nhật thông tin học phần, số tín chỉ, giờ học, nhóm học phần…</p>
            </div>
          </div>
          {/* Xem chi tiết đề cương đã hoàn thiện */}
          <div
            className="action-card edit"
            onClick={() => {
              handleViewSyllabus();
              setOpenFunction(false);
            }}
          >
            <div className="icon-area">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="text-area">
              <h5>Xem chi tiết đề cương đã hoàn thiện</h5>
              <p>Xem chi tiết đề cương đã hoàn thiện của học phần</p>
            </div>
          </div>
          {/* Xem lịch sử thao tác */}
          <div
            className="action-card edit"
            onClick={() => {
              LoadLogCourse(Number(selectedIdCourse));
              setOpenFunction(false);
            }}
          >
            <div className="icon-area">
              <i className="fas fa-history"></i>
            </div>
            <div className="text-area">
              <h5>Xem lịch sử thao tác</h5>
              <p>Xem lịch sử thao tác của học phần</p>
            </div>
          </div>
          {/* Xem danh sách giảng viên phụ trách đề cương */}
          <div
            className="action-card edit"
            onClick={() => {
              LoadListUserWriteCourse(Number(selectedIdCourse));
              setOpenFunction(false);
            }}
          >
            <div className="icon-area">
              <i className="fas fa-users"></i>
            </div>
            <div className="text-area">
              <h5>Xem danh sách giảng viên phụ trách đề cương</h5>
              <p>Xem danh sách giảng viên phụ trách đề cương của học phần</p>
            </div>
          </div>
          {/* Xóa */}
          <div
            className="action-card edit"
            onClick={() => {
              handleDelete(Number(selectedIdCourse));
              setOpenFunction(false);
            }}
          >
            <div className="icon-area">
              <i className="fas fa-trash-alt"></i>
            </div>
            <div className="text-area">
              <h5>Xóa học phần</h5>
              <p>Xóa học phần và toàn bộ dữ liệu liên quan (không thể khôi phục).</p>
            </div>
          </div>

        </div>
      </Modal>

      <Modal
        isOpen={showLogData}
        onClose={() => setShowLogData(false)}
        title="Lịch sử thao tác"
      >
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>STT</th>
                <th>Nội dung thao tác</th>
                <th>Thời gian thao tác</th>
              </tr>
            </thead>
            <tbody>
              {logData.length > 0 ? (
                logData.map((item, index) => (
                  <tr key={index}>
                    <td className="formatSo">{index + 1}</td>
                    <td>{item.content_value}</td>
                    <td className="formatSo">{unixTimestampToDate(item.log_time)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-danger">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>



      <Modal
        isOpen={openOptionFilter}
        title={`CHỨC NĂNG HỌC PHẦN`}
        onClose={() => setOpenOptionFilter(false)}
      >
        <div className="action-menu">
          <div
            className="action-card permission"
            id="exportExcel"
            data-toggle="modal"
            data-target="#importExcelModal"
            onClick={() => {
              setOpenOptionFilter(false);
            }}
          >
            <div className="icon-area permission">
              <i className="fas fa-file-import"></i>
            </div>
            <div className="text-area">
              <h5>Import dữ liệu môn học từ Excel</h5>
              <p>Import dữ liệu môn học từ file Excel vào chương trình đào tạo này</p>
            </div>
          </div>
          {/* Chỉnh sửa */}
          <div
            className="action-card permission"
            onClick={() => {
              handleExportExcel();
              setOpenOptionFilter(false);
            }}
          >
            <div className="icon-area permission">
              <i className="fas fa-file-export"></i>
            </div>
            <div className="text-area">
              <h5>Xuất Excel dữ liệu đang hiển thị</h5>
              <p>Xuất Excel dữ liệu đang hiển thị</p>
            </div>
          </div>
          {/* Xem chi tiết đề cương đã hoàn thiện */}
          <div
            className="action-card permission"
            onClick={() => {
              handleExportExcelIsStatus();
              setOpenOptionFilter(false);
            }}
          >
            <div className="icon-area permission">
              <i className="fas fa-file-export"></i>
            </div>
            <div className="text-area">
              <h5>Xuất Excel môn học chưa tồn tại đề cương</h5>
              <p>Xuất Excel môn học chưa tồn tại đề cương</p>
            </div>
          </div>
        </div>
      </Modal>


      <Modal
        isOpen={showListUserWriteCourse}
        title="Danh sách yêu cầu tham gia viết đề cương"
        onClose={() => setShowListUserWriteCourse(false)}
      >
        <>
          <div className="table-responsive">

            {listUserWriteCourse.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã giảng viên</th>
                    <th>Tên giảng viên</th>
                    <th>Email</th>
                    <th>Thuộc CTĐT</th>
                    <th>Thời gian nhận yêu cầu</th>
                    <th>Thời gian duyệt yêu cầu</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {listUserWriteCourse.map((item, index) => (
                    <tr key={item.id_ApproveUserSyllabus}>
                      <td>{index + 1}</td>
                      <td>{item.code_civil}</td>
                      <td>{item.name_civil}</td>
                      <td>{item.email}</td>
                      <td>{item.name_program}</td>
                      <td>{item.time_accept_request === null ? "" : unixTimestampToDate(item.time_request)}</td>
                      <td>{item.time_accept_request === null ? "" : unixTimestampToDate(item.time_accept_request)}</td>
                      <td>{item.is_key_user === true ? <span className="badge badge-pill badge-success">Giảng viên viết chính</span> : <span className="badge badge-pill badge-warning">Giảng viên phụ viết</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-info" style={{ textAlign: "center", marginTop: "20px" }}>
                Không có yêu cầu tham gia viết đề cương
              </div>
            )}
          </div>
        </>
      </Modal>
      <Modal
        isOpen={openViewSyllabus}
        title="Xem chi tiết đề cương đã hoàn thiện"
        onClose={() => setOpenViewSyllabus(false)}
      >
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã giảng viên</th>
                <th>Họ và tên giảng viên</th>
                <th>Email</th>
                <th>Thuộc chương trình đào tạo</th>
                <th>Mã học phần</th>
                <th>Tên học phần</th>
                <th>Version đề cương</th>
                <th>Thời gian tạo đề cương</th>
                <th>Thời gian hoàn thành đề cương</th>
                <th>Trạng thái đề cương</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {listSyllabusByCourseFinal.data?.map((item, index) => (
                <tr key={item.id_syllabus}>
                  <td>{index + 1}</td>
                  <td>{item.code_civilSer}</td>
                  <td>{item.fullname_civilSer}</td>
                  <td>{item.email}</td>
                  <td>{item.name_program}</td>
                  <td>{item.code_course}</td>
                  <td>{item.name_course}</td>
                  <td className="formatSo">{item.version}</td>
                  <td>{unixTimestampToDate(item.time_cre)}</td>
                  <td>{unixTimestampToDate(item.time_up)}</td>
                  <td>{item.status == "Duyệt thành công" ? <span className="text-success">Đã hoàn thành</span> : <span className="text-danger">Chưa hoàn thành</span>}</td>
                  <td>
                    <button className="btn btn-sm btn-function-ceo" onClick={() => handlePreviewSyllabus(item.id_syllabus)}>
                      <i className="fas fa-eye"></i> Xem đề cương
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
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
export default CourseInterfaceDonVi;
const pieParams = {
  height: 200,
  margin: { right: 5 },
  hideLegend: true,
};