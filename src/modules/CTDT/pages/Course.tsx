import { useEffect, useRef, useState } from "react";
import { CourseDonViAPI } from "../../../api/DonVi/CourseAPI";
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

  const GetListCTDTByDonVi = async () => {
    const res = await ListCTDTPermissionAPI.GetListCTDTPermission();
    setListCTDT(res);
    setOptionFilter((prev) => ({ ...prev, id_ctdt: Number(res[0].value) }));
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
      const res = await CourseCTDTAPI.GetListCourseByKeyYear({ id_key_year_semester: Number(optionFilter.id_key_year_semester), id_program: Number(optionFilter.id_ctdt) });
      if (res.success) {
        setListCourseByKeyYear(res.data);
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
          ShowData();
          SweetAlert("success", res.message);
          setShowModal(false);
          ShowData();
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
              Quản lý Danh sách Học phần thuộc Đơn vị
            </h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Lọc theo CTĐT</label>
                  <select className="form-control" name="id_ctdt_filter" value={optionFilter.id_ctdt || 0} onChange={handleInputChange}>
                    {listCTDT.map((items, idx) => (
                      <option key={idx} value={items.value}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Lọc theo kiểm tra học phần bắt buộc</label>
                  <select className="form-control" name="id_isCourse_filter" value={optionFilter.id_isCourse || 0} onChange={handleInputChange}>
                    <option value="0">Tất cả</option>
                    {listKiemTraHocPhanBatBuocFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Lọc theo nhóm học phần</label>
                  <select className="form-control" name="id_gr_course_filter" value={optionFilter.id_gr_course || 0} onChange={handleInputChange}>
                    <option value="0">Tất cả</option>
                    {lisNhomHocPhanFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Lọc theo khóa học</label>
                  <select className="form-control" name="id_key_year_semester_filter" value={optionFilter.id_key_year_semester || 0} onChange={handleInputChange}>
                    <option value="0">Tất cả</option>
                    {listKeyYearSemesterFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Lọc theo học kỳ</label>
                  <select className="form-control" name="id_semester_filter" value={optionFilter.id_semester || 0} onChange={handleInputChange}>
                    <option value="0">Tất cả</option>
                    {listSemesterFilter.map((items, idx) => (
                      <option key={idx} value={items.value}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-success" onClick={AddNewCourse}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button
                    className="btn btn-success"
                    id="exportExcel"
                    data-toggle="modal"
                    data-target="#importExcelModal"
                  >
                    <i className="fas fa-file-excel mr-1" /> Import từ Excel
                  </button>
                  <button className="btn btn-primary" onClick={() => handleClickFilter()}>
                    <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                  </button>
                </div>
              </div>
              {checkClickFilter === true && allData.length > 0 ? (
                <>
                  <hr />
                  <div className="row justify-content-center align-items-center my-3">
                    <div className="col-12 d-flex flex-wrap justify-content-center gap-3 text-center">
                      <button
                        className="btn btn-outline-primary px-4 py-2 d-flex align-items-center justify-content-center"
                        style={{ maxWidth: "420px", whiteSpace: "normal" }}
                        onClick={handleClickKeyYearFalse}
                      >
                        <span>
                          Hiện danh sách môn học tổng hợp<br />theo chương trình đào tạo
                        </span>
                      </button>

                      <button
                        className="btn btn-outline-success px-4 py-2 d-flex align-items-center justify-content-center"
                        style={{ maxWidth: "420px", whiteSpace: "normal" }}
                        onClick={handleClickKeyYearTrue}
                      >
                        <span>
                          Hiện danh sách môn học theo học kỳ<br />theo chương trình đào tạo
                        </span>
                      </button>
                    </div>
                  </div>
                </>

              ) : null}

            </fieldset>
          </div>

          {checkClickKeyYear === true ? (
            <div className="table-responsive mt-3">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "8%" }}>Mã môn học</th>
                    <th style={{ width: "25%" }}>Tên học phần</th>
                    <th style={{ width: "15%" }}>Kiểm tra học phần bắt buộc</th>
                    <th style={{ width: "15%" }}>Nhóm học phần</th>
                    <th style={{ width: "10%" }}>Số giờ lý thuyết</th>
                    <th style={{ width: "10%" }}>Số giờ thực hành</th>
                    <th style={{ width: "8%" }}>Số tín chỉ</th>
                  </tr>
                </thead>

                {Array.isArray(listCourseByKeyYear) && listCourseByKeyYear.length > 0 ? (
                  listCourseByKeyYear.map((semester: any, sIdx: number) => (
                    <tbody key={sIdx} style={{ color: "black" }}>
                      <tr className="table-secondary" >
                        <td colSpan={7} className="fw-bold text-start" style={{ backgroundColor: "#bfd1ec" }}>
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
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center text-muted">
                            Không có môn học trong học kỳ này
                          </td>
                        </tr>
                      )}
                    </tbody>
                  ))
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={7} className="text-center text-danger">
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
                          <td className="formatSo">
                            <button
                              className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                              onClick={() => handleInfo(item.id_course)}
                            >
                              <i className="anticon anticon-edit" />
                            </button>
                            <button
                              className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                              onClick={() => handleDelete(item.id_course)}
                            >
                              <i className="anticon anticon-delete" />
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
    </div>
  );
}
export default CourseInterfaceCtdt;
