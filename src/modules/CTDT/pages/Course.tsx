import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Loading from "../../../components/ui/Loading";
import { CourseCTDTAPI } from "../../../api/CTDT/Course";
import { ListCTDTPermissionAPI } from "../../../api/CTDT/ListCTDTPermissionAPI";

function CourseInterfaceCtdt() {
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
  const [loading, setLoading] = useState(false);
  const [listCTDT, setListCTDT] = useState<any[]>([]);
  const [listKeyYearSemester, setListKeyYearSemester] = useState<any[]>([]);
  const [listSemester, setListSemester] = useState<any[]>([]);
  const [listKeyYearSemesterFilter, setListKeyYearSemesterFilter] = useState<any[]>([]);
  const [listSemesterFilter, setListSemesterFilter] = useState<any[]>([]);
  const [listCourseByKeyYear, setListCourseByKeyYear] = useState<any[]>([]);
  const [checkClickKeyYear, setCheckClickKeyYear] = useState(false);
  const [checkClickFilter, setCheckClickFilter] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [listCivilServantsPermission, setListCivilServantsPermission] = useState<any[]>([]);
  const [setUpTimeOpen, setSetUpTimeOpen] = useState(false);
  const [countdownMap, setCountdownMap] = useState<any>({});
  const [openFunction, setOpenFunction] = useState(false);
  const [selectedIdCourse, setSelectedIdCourse] = useState<number | null>(null);
  const [openViewSyllabus, setOpenViewSyllabus] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listSyllabusByCourseFinal, setListSyllabusByCourseFinal] = useState<{
    message?: string;
    success?: boolean;
    data?: any[];
  }>({});
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
    id_ctdt: number | null;
    id_gr_course: number | null;
    id_isCourse: number | null;
    id_key_year_semester: number | null;
    id_semester: number | null;
  }
  const [optionFilter, setOptionFilter] = useState<OptionFilter>({
    id_ctdt: null,
    id_gr_course: null,
    id_isCourse: null,
    id_key_year_semester: null,
    id_semester: null,
  });

  interface PermissionData {
    code_civilSer: string;
    id_course: number | null;
  }
  const [permissionData, setPermissionData] = useState<PermissionData>({
    code_civilSer: "",
    id_course: null,
  });

  interface SetUpTimeData {
    open_time: number | null;
    close_time: number | null;
    reason: string;
  }
  const [setUpTimeData, setSetUpTimeData] = useState<SetUpTimeData>({
    open_time: null,
    close_time: null,
    reason: "",
  });
  const GetListCTDTByDonVi = async () => {
    const res = await ListCTDTPermissionAPI.GetListCTDTPermission();
    setListCTDT(res);
    setOptionFilter((prev) => ({ ...prev, id_ctdt: Number(res[0].value) }));
  }
  const formatCountdown = (ms: number) => {
    if (ms <= 0) return "Hết hạn";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };
  const startCountdownForCourses = (courses: any[]) => {
    if (window.courseCountdownInterval) clearInterval(window.courseCountdownInterval);

    window.courseCountdownInterval = setInterval(() => {
      const newCountdowns: any = {};

      courses.forEach((course) => {
        if (!course.time_close) {
          newCountdowns[course.id_course] = "Chưa mở thời gian";
          return;
        }

        const diff = course.time_close * 1000 - Date.now();
        newCountdowns[course.id_course] = formatCountdown(diff);
      });

      setCountdownMap(newCountdowns);
    }, 1000);
  };

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
    if (name === "code_civilSer") {
      setPermissionData((prev) => ({ ...prev, code_civilSer: value }));
    }
  }
  const handleInputChangeSetUpTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "open_time" || name === "close_time") {
      const unixTime = value ? Math.floor(new Date(value).getTime() / 1000) : null;
      setSetUpTimeData((prev) => ({ ...prev, [name]: unixTime }));
    } else {
      setSetUpTimeData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "reason") {
      setSetUpTimeData((prev) => ({ ...prev, reason: value }));
    }
  };
  const unixToLocal = (timestamp: number | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);

    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString();

    return localISOTime.slice(0, 16);
  };

  const GetDataListOptionCourse = async (id_ctdt: number) => {
    const res = await CourseCTDTAPI.GetListOptionCourse({ id_program: id_ctdt });
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
  const filteredData = allData.filter((item) => {
    const keyword = searchText.toLowerCase().trim();

    return (
      item.code_course?.toLowerCase().includes(keyword) ||
      item.name_course?.toLowerCase().includes(keyword) ||
      item.name_program?.toLowerCase().includes(keyword) ||
      item.name_semester?.toLowerCase().includes(keyword) ||
      item.name_key_year_semester?.toLowerCase().includes(keyword)
    );
  });

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
    { label: "Thời gian mở học phần đề cương", key: "open_time" },
    { label: "Thời gian đóng học phần đề cương", key: "close_time" },
    { label: "Thời gian còn lại để đề cương", key: "time_remaining" },
    { label: "Số lượng giảng viên phụ trách đề cương", key: "count_syllabus" },
    { label: "Trạng thái đề cương", key: "is_syllabus" },
    { label: "*", key: "*" },
  ];
  const headersPermission = [
    { label: "STT", key: "stt" },
    { label: "Mã viên chức", key: "code_civilSer" },
    { label: "Họ và tên", key: "fullname_civilSer" },
    { label: "Email", key: "email" },
    { label: "Chương trình đào tạo", key: "name_program" },
    { label: "Ngày sinh", key: "birthday" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];
  const GetListCourseByKeyYear = async () => {
    setLoading(true);
    try {
      const res = await CourseCTDTAPI.GetListCourseByKeyYear({ id_key_year_semester: Number(optionFilter.id_key_year_semester), id_program: Number(optionFilter.id_ctdt) });
      if (res.success) {
        setListCourseByKeyYear(res.data);
        SweetAlert("success", res.message);
        startCountdownForCourses(res.data);
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
  }
  const handleClickFilter = () => {
    setCheckClickFilter(true);
    ShowData();
  }
  const ShowData = async () => {
    setLoading(true);
    try {
      const res = await CourseCTDTAPI.GetListCourse({
        id_gr_course: Number(optionFilter.id_gr_course || null),
        id_key_year_semester: Number(optionFilter.id_key_year_semester || null),
        id_semester: Number(optionFilter.id_semester || null),
        id_program: Number(optionFilter.id_ctdt || null),
        id_isCourse: Number(optionFilter.id_isCourse || null),
        Page: page,
        PageSize: pageSize,
      });
      if (res.success) {
        setAllData(res.data);
        setTotalRecords(Number(res.totalRecords) || 0);
        setTotalPages(Number(res.totalPages) || 1);
        setPageSize(Number(res.pageSize) || 10);
        startCountdownForCourses(res.data);
      } else {
        setAllData([]);
        setTotalRecords(0);
        setTotalPages(1);
        setPageSize(10);
        setTotalRecords(0);
      }
    }
    finally {
      setLoading(false);
    }
  }
  const handleSave = async () => {
    setLoading(true);
    try {
      if (modalMode === "create") {
        const res = await CourseCTDTAPI.AddNewCourse({
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
          SweetAlert("success", res.message);
          setShowModal(false);
          if (checkClickKeyYear === true) {
            GetListCourseByKeyYear();
          }
          else {
            ShowData();
          }
        } else {
          SweetAlert("error", res.message);
        }
      }
      else {
        const res = await CourseCTDTAPI.UpdateCourse({
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
          SweetAlert("success", res.message);
          setShowModal(false);
          if (checkClickKeyYear === true) {
            GetListCourseByKeyYear();
          }
          else {
            ShowData();
          }
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
  const handleInfo = async (id: number) => {
    const res = await CourseCTDTAPI.InfoCourse({ id_course: id });
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
        const res = await CourseCTDTAPI.DeleteCourse({ id_course: id });
        if (res.success) {
          SweetAlert("success", res.message);
          if (checkClickKeyYear === true) {
            GetListCourseByKeyYear();
          }
          else {
            ShowData();
          }
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
  const SavePermissionCourse = async () => {
    const res = await CourseCTDTAPI.SavePermissionCourse({ id_program: Number(optionFilter.id_ctdt), code_civilSer: permissionData.code_civilSer, id_course: Number(permissionData.id_course) });
    if (res.success) {
      SweetAlert("success", res.message);
      LoadDataCivilServantsPermission(Number(permissionData.id_course));
    }
    else {
      SweetAlert("error", res.message);
    }
  }
  const HandleOpenPermission = async (id_course: number) => {
    setPermissionOpen(true);

    setPermissionData((prev) => ({ ...prev, id_course: Number(id_course) }));

    await LoadDataCivilServantsPermission(id_course);
  };

  const LoadDataCivilServantsPermission = async (id_course: number) => {
    const res = await CourseCTDTAPI.LoadInfoPermissionCourse({ id_course });
    if (res.success) {
      setListCivilServantsPermission(res.data);
    } else {
      SweetAlert("error", res.message);
    }
  };
  const handleDeletePermission = async (id_teacherbysubject: number) => {
    const res = await CourseCTDTAPI.DeletePermissionCourse({ id_teacherbysubject });
    if (res.success) {
      SweetAlert("success", res.message);
      LoadDataCivilServantsPermission(Number(permissionData.id_course));
    }
    else {
      SweetAlert("error", res.message);
    }
  }
  const handleSetUpTimeCourse = async () => {
    const res = await CourseCTDTAPI.SetUpTimeCourse({ id_keyYearSemester: Number(optionFilter.id_key_year_semester), open_time: Number(setUpTimeData.open_time), close_time: Number(setUpTimeData.close_time) });
    if (res.success) {
      SweetAlert("success", res.message);
    }
    else {
      SweetAlert("error", res.message);
    }
  }
  const handleOpenSetUpTimeCourse = () => {
    setSetUpTimeOpen(true);
  }
  const handleOpenFunction = (id_course: number) => {
    setSelectedIdCourse(Number(id_course));
    setOpenFunction(true);
  }
  const handleViewSyllabus = () => {
    setOpenViewSyllabus(true);
    LoadListSyllabusByCourseFinal();
  }
  const LoadListSyllabusByCourseFinal = async () => {
    const res = await CourseCTDTAPI.ListSyllabusByCourseFinal({ id_course: Number(selectedIdCourse) });
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
  useEffect(() => {
    if (!didFetch.current) {
      GetListCTDTByDonVi();
      didFetch.current = true;
    }
  }, []);
  useEffect(() => {
    if (optionFilter.id_ctdt) {
      GetDataListOptionCourse(Number(optionFilter.id_ctdt));
    }
  }, [optionFilter.id_ctdt]);
  useEffect(() => {
    ShowData();
  }, [page, pageSize]);
  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">
              Quản lý Danh sách Học phần thuộc Chương trình
            </h2>
            <hr />
            <fieldset className="ceo-panel">
              <legend className="ceo-title">Chức năng</legend>

              {/* HÀNG 1: FILTER */}
              <div className="row g-3 mb-2">
                <div className="col-md-4">
                  <label className="ceo-label">Chương trình đào tạo</label>
                  <select
                    className="form-control ceo-input"
                    name="id_ctdt_filter"
                    value={optionFilter.id_ctdt || 0}
                    onChange={handleInputChange}
                  >
                    {listCTDT.map((items, idx) => (
                      <option key={idx} value={items.value}>{items.text}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="ceo-label">Kiểm tra học phần bắt buộc</label>
                  <select
                    className="form-control ceo-input"
                    name="id_isCourse_filter"
                    value={optionFilter.id_isCourse || 0}
                    onChange={handleInputChange}
                  >
                    <option value="0">Tất cả</option>
                    {listKiemTraHocPhanBatBuocFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>{items.text}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="ceo-label">Nhóm học phần</label>
                  <select
                    className="form-control ceo-input"
                    name="id_gr_course_filter"
                    value={optionFilter.id_gr_course || 0}
                    onChange={handleInputChange}
                  >
                    <option value="0">Tất cả</option>
                    {lisNhomHocPhanFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>{items.text}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* HÀNG 2: FILTER */}
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="ceo-label">Khóa học</label>
                  <select
                    className="form-control ceo-input"
                    name="id_key_year_semester_filter"
                    value={optionFilter.id_key_year_semester || 0}
                    onChange={handleInputChange}
                  >
                    <option value="0">Tất cả</option>
                    {listKeyYearSemesterFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>{items.text}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="ceo-label">Học kỳ</label>
                  <select
                    className="form-control ceo-input"
                    name="id_semester_filter"
                    value={optionFilter.id_semester || 0}
                    onChange={handleInputChange}
                  >
                    <option value="0">Tất cả</option>
                    {listSemesterFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>{items.text}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="ceo-label">Tìm kiếm</label>
                  <input
                    type="text"
                    className="form-control ceo-input"
                    placeholder="🔍 Nhập mã / tên học phần..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="row mt-4">
                <div className="col-12 d-flex flex-wrap gap-3 justify-content-end">

                  <button className="btn btn-ceo-green" onClick={AddNewCourse}>
                    <i className="fas fa-plus-circle"></i> Thêm mới
                  </button>

                  <button className="btn btn-ceo-green" onClick={handleOpenSetUpTimeCourse}>
                    <i className="fas fa-clock"></i> Thiết lập thời gian
                  </button>

                  <button
                    className="btn btn-ceo-green"
                    id="exportExcel"
                    data-toggle="modal"
                    data-target="#importExcelModal"
                  >
                    <i className="fas fa-file-excel"></i> Import Excel
                  </button>

                  <button className="btn btn-ceo-blue" onClick={handleClickFilter}>
                    <i className="fas fa-filter"></i> Lọc dữ liệu
                  </button>

                </div>
              </div>

              {/* KEY YEAR BUTTONS */}
              {checkClickFilter && allData.length > 0 && (
                <>
                  <hr />
                  <div className="row justify-content-center mt-4">
                    <div className="col-12 d-flex flex-wrap justify-content-center gap-4">
                      <button className="btn btn-outline-ceo-primary" onClick={handleClickKeyYearFalse}>
                        <i className="fas fa-list-ul mb-1 d-block"></i>
                        Danh sách tổng hợp<br />theo CTĐT
                      </button>

                      <button className="btn btn-outline-ceo-green" onClick={handleClickKeyYearTrue}>
                        <i className="fas fa-calendar-alt mb-1 d-block"></i>
                        Danh sách theo học kỳ<br />theo CTĐT
                      </button>
                    </div>
                  </div>
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
                    <th style={{ width: "10%" }}>Thời gian mở học phần đề cương</th>
                    <th style={{ width: "10%" }}>Thời gian đóng học phần đề cương</th>
                    <th style={{ width: "10%" }}>Thời gian còn lại để đề cương</th>
                    <th style={{ width: "10%" }}>Số lượng giảng viên phụ trách đề cương</th>
                    <th style={{ width: "10%" }}>Trạng thái đề cương</th>
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
                            <td className="text-center">{course.name_isCourse}</td>
                            <td className="text-center">{course.name_gr_course}</td>
                            <td className="text-center">{course.totalTheory}</td>
                            <td className="text-center">{course.totalPractice}</td>
                            <td className="text-center">{course.credits}</td>
                            <td className="formatSo">{course.time_open == null ? <span className="text-danger">Chưa mở thời gian cho môn học</span> : <span className="text-primary">{unixTimestampToDate(course.time_open)}</span>}</td>
                            <td className="formatSo">{course.time_close == null ? <span className="text-danger">Chưa mở thời gian cho môn học</span> : <span className="text-primary">{unixTimestampToDate(course.time_close)}</span>}</td>
                            <td className="formatSo">{course.time_close == null ? <span className="text-danger">Chưa mở thời gian cho môn học</span> : <span className="text-success">{formatCountdown(course.time_close * 1000 - Date.now())}</span>}</td>
                            <td className="formatSo">{course.count_syllabus}</td>
                            <td className="formatSo">{course.is_syllabus == true ? <span className="text-success">Môn học này đã hoàn thành đề cương</span> : <span className="text-danger">Môn học này chưa hoàn thành đề cương</span>}</td>
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
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
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
                          <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                          <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                          <td className="formatSo">{item.time_open == null ? <span className="text-danger">Chưa mở thời gian cho môn học</span> : <span className="text-primary">{unixTimestampToDate(item.time_open)}</span>}</td>
                          <td className="formatSo">{item.time_close == null ? <span className="text-danger">Chưa mở thời gian cho môn học</span> : <span className="text-primary">{unixTimestampToDate(item.time_close)}</span>}</td>
                          <td className="formatSo">
                            {item.time_close == null ? <span className="text-danger">Chưa mở thời gian cho môn học</span> : <span className="text-success">{formatCountdown(item.time_close * 1000 - Date.now())}</span>}
                          </td>
                          <td className="formatSo">{item.count_syllabus}</td>
                          <td className="formatSo">{item.is_syllabus == true ? <span className="text-success">Môn học này đã hoàn thành đề cương</span> : <span className="text-danger">Môn học này chưa hoàn thành đề cương</span>}</td>
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
            <label className="ceo-label col-sm-2 col-form-label">Mã học phần</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="code_course"
                value={formData.code_course}
                className="form-control ceo-input"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Tên học phần</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="name_course"
                value={formData.name_course}
                className="form-control ceo-input"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Kiểm tra học phần bắt buộc</label>
            <div className="col-sm-10">
              <select className="form-control ceo-input" name="id_isCourse" value={formData.id_isCourse || 0} onChange={handleInputChange}>
                {listKiemTraHocPhanBatBuoc.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Nhóm học phần</label>
            <div className="col-sm-10">
              <select className="form-control ceo-input" name="id_gr_course" value={formData.id_gr_course || 0} onChange={handleInputChange}>
                {lisNhomHocPhan.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Số giờ lý thuyết</label>
            <div className="col-sm-10">
              <input type="number" className="form-control ceo-input" name="totalTheory" min={1} max={100} value={formData.totalTheory || 1} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Số giờ thực hành</label>
            <div className="col-sm-10">
              <input type="number" className="form-control ceo-input" name="totalPractice" min={1} max={100} value={formData.totalPractice || 1} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Số tín chỉ</label>
            <div className="col-sm-10">
              <input type="number" className="form-control ceo-input" name="credits" min={1} max={100} value={formData.credits || 1} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Thuộc khóa học</label>
            <div className="col-sm-10">
              <select className="form-control ceo-input" name="id_key_year_semester" value={formData.id_key_year_semester || 0} onChange={handleInputChange}>
                {listKeyYearSemester.map((items, idx) => (
                  <option key={idx} value={items.value}>
                    {items.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Thuộc học kỳ</label>
            <div className="col-sm-10">
              <select className="form-control ceo-input" name="id_semester" value={formData.id_semester || 0} onChange={handleInputChange}>
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
        isOpen={permissionOpen}
        title="Quản lý quyền hạn"
        onClose={() => setPermissionOpen(false)}
        onSave={SavePermissionCourse}
      >
        <form id="modal-body" autoComplete="off">
          <h5 className="text-center text-uppercase font-size-20">Nhập mã giảng viên vào ô để phân quyền vào đề cương môn học này</h5>
          <hr />
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Mã cán bộ</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="code_civilSer"
                value={permissionData.code_civilSer}
                className="form-control ceo-input"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <hr />
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  {headersPermission.map((h, idx) => (
                    <th key={idx}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listCivilServantsPermission.length > 0 ? (
                  listCivilServantsPermission.map((item, index) => (
                    <tr key={item.id_teacherbysubject}>
                      <td>{(page - 1) * pageSize + index + 1}</td>
                      <td>{item.code_civilSer}</td>
                      <td>{item.fullname_civilSer}</td>
                      <td>{item.email}</td>
                      <td>{item.name_program}</td>
                      <td>{item.birthday}</td>
                      <td>{unixTimestampToDate(item.time_cre)}</td>
                      <td>{unixTimestampToDate(item.time_up)}</td>
                      <td >
                        <div className="d-flex justify-content flex-wrap gap-2">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeletePermission(item.id_teacherbysubject);
                            }
                            }
                          >
                            🗑️ Xóa giảng viêng này ra khỏi đề cương
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="text-center text-danger">
                      Không có dữ liệu giảng viên nào được phân quyền.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={setUpTimeOpen}
        title="Thiết lập thời gian mở học phần đề cương"
        onClose={() => setSetUpTimeOpen(false)}
        onSave={handleSetUpTimeCourse}
      >
        <form id="modal-body" autoComplete="off">
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Thời gian mở học phần đề cương</label>
            <div className="col-sm-10">
              <input type="datetime-local" className="form-control ceo-input" name="open_time" value={unixToLocal(setUpTimeData.open_time) ?? ""} onChange={handleInputChangeSetUpTime} />
            </div>
          </div>
          <div className="form-group row">
            <label className="ceo-label col-sm-2 col-form-label">Thời gian đóng học phần đề cương</label>
            <div className="col-sm-10">
              <input type="datetime-local" className="form-control ceo-input" name="close_time" value={unixToLocal(setUpTimeData.close_time) ?? ""} onChange={handleInputChangeSetUpTime} />
            </div>
          </div>
        </form>
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
                  <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                  <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                  <td>{item.status == "Duyệt thành công" ? <span className="text-success">Đã hoàn thành</span> : <span className="text-danger">Chưa hoàn thành</span>}</td>
                  <td>
                    <button className="btn btn-sm btn-function-ceo">
                      <i className="fas fa-eye"></i> Xem đề cương
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          {/* Phân quyền */}
          <div
            className="action-card permission"
            onClick={() => {
              HandleOpenPermission(Number(selectedIdCourse));
              setOpenFunction(false);
            }}
          >
            <div className="icon-area">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="text-area">
              <h5>Phân quyền giảng viên</h5>
              <p>Quản lý danh sách giảng viên được phân nhiệm vụ soạn đề cương.</p>
            </div>
          </div>

          {/* Xóa */}
          <div
            className="action-card delete"
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
    </div>
  );
}
export default CourseInterfaceCtdt;
