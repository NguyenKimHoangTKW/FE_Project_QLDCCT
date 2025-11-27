import { useEffect, useRef, useState } from "react";
import { CourseDonViAPI } from "../../../api/DonVi/CourseAPI";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Swal from "sweetalert2";
import Loading from "../../../components/ui/Loading";
import CeoCombobox from "../../../components/ui/Combobox";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [listCTDT, setListCTDT] = useState<any[]>([]);
  const [selectedIdCourse, setSelectedIdCourse] = useState<number | null>(null);
  const [openFunction, setOpenFunction] = useState(false);
  const [listKeyYearSemester, setListKeyYearSemester] = useState<any[]>([]);
  const [listSemester, setListSemester] = useState<any[]>([]);
  const [logData, setLogData] = useState<any[]>([]);
  const [showLogData, setShowLogData] = useState(false);
  const [listKeyYearSemesterFilter, setListKeyYearSemesterFilter] = useState<any[]>([]);
  const [openOptionFilter, setOpenOptionFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
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
      });
      if (res.success) {
        setAllData(res.data);
        setTotalRecords(Number(res.totalRecords) || 0);
        setTotalPages(Number(res.totalPages) || 1);
        setPageSize(Number(res.pageSize) || 10);
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
  const filteredData = allData.filter((item) => {
    const keyword = searchText.toLowerCase().trim();

    return (
      item.code_course?.toLowerCase().includes(keyword) ||
      item.name_course?.toLowerCase().includes(keyword) ||
      item.name_program?.toLowerCase().includes(keyword) ||
      item.name_semester?.toLowerCase().includes(keyword) ||
      item.name_key_year_semester?.toLowerCase().includes(keyword) ||
      unixTimestampToDate(item.time_cre)?.toLowerCase().includes(keyword) ||
      unixTimestampToDate(item.time_up)?.toLowerCase().includes(keyword)
    );
  });
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
  useEffect(() => {
    if (!didFetch.current) {
      GetDataListOptionCourse();
      didFetch.current = true;
    }
  }, []);
  useEffect(() => {
    ShowData();
  }, [page, pageSize]);
  useEffect(() => {
    GetListCTDTByDonVi();
  }, []);
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
                <div className="col-md-4">
                  <label className="ceo-label">Tìm kiếm</label>
                  <input
                    type="text"
                    className="form-control ceo-input"
                    placeholder="🔍 Nhập từ khóa bất kỳ để tìm kiếm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
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
                    <i className="fas fa-clock"></i> Mở bảng chức năng môn học
                  </button>
                  <button className="btn btn-ceo-blue" onClick={() => ShowData()}>
                    <i className="fas fa-filter mr-1" /> Lọc dữ liệu
                  </button>
                </div>
              </div>
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
          <div className="table-responsive"></div>
          <table className="table table-bordered">
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
                    <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                    <td data-label="Thuộc khóa học">{item.name_key_year_semester}</td>
                    <td data-label="Thuộc học kỳ">{item.name_semester}</td>
                    <td data-label="Thuộc CTĐT">{item.name_program}</td>
                    <td className="formatSo">{item.code_course}</td>
                    <td data-label="Tên học phần">{item.name_course}</td>
                    <td>{item.name}</td>
                    <td data-label="Nhóm học phần">{item.name_gr_course}</td>
                    <td data-label="Số giờ lý thuyết" className="formatSo">{item.totalTheory}</td>
                    <td data-label="Số giờ thực hành" className="formatSo">{item.totalPractice}</td>
                    <td data-label="Số tín chỉ" className="formatSo">{item.credits}</td>
                    <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                    <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                    <td data-label="Trạng thái đề cương">{item.is_syllabus == true ? <span className="text-success">Đã hoàn thiện</span> : <span className="text-danger">Chưa hoàn thiện</span>}</td>
                    <td data-label="*" className="formatSo">
                      <div className="d-flex justify-content-center flex-wrap gap-3">
                        <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleOpenFunction(item.id_course)}>
                          <i className="anticon anticon-setting me-1" /> Mở chức năng
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
                    Không có dữ liệu môn học trong chương trình này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              handleInfo(Number(selectedIdCourse));
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
    </div>
  );
}
export default CourseInterfaceDonVi;
