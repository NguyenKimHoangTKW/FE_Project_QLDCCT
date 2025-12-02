import { useEffect, useRef, useState } from "react";
import { CivilServantsAPI } from "../../../api/Admin/civilServants";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import Loading from "../../../components/ui/Loading";
import Swal from "sweetalert2";
function CivilServants() {
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [optionYear, setOptionYear] = useState<any[]>([]);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [idYear, setIdYear] = useState(Number);
  const [listDonVi, setListDonVi] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [listCTDT, setListCTDT] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  interface CivilServantForm {
    id_civilSer?: number | null;
    code_civilSer: string;
    fullname_civilSer: string;
    email: string;
    birthday: string;
    value_year?: number | null;
    id_program: number;
  }
  const [formData, setFormData] = useState<CivilServantForm>({
    code_civilSer: "",
    fullname_civilSer: "",
    email: "",
    birthday: "",
    id_program: 0,
  });
  interface OptionFilter {
    id_program: number;
    id_faculty: number;
  }
  const [optionFilter, setOptionFilter] = useState<OptionFilter>({
    id_program: 0,
    id_faculty: 0,
  });

  const headers = [
    { label: "STT", key: "" },
    { label: "Mã viên chức", key: "code_civilSer" },
    { label: "Tên viên chức", key: "fullname_civilSer" },
    { label: "Email", key: "email" },
    { label: "Thuộc CTĐT", key: "name_program" },
    { label: "Thuộc Đơn vị", key: "name_faculty" },
    { label: "Ngày sinh", key: "birthday" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOptionFilter((prev) => ({ ...prev, [name]: Number(value) }));
    if (name === "id_faculty_filter") {
      setOptionFilter((prev) => ({ ...prev, id_program: Number(value) }));
    }
    if (name === "id_program_filter") {
      setOptionFilter((prev) => ({ ...prev, id_faculty: Number(value) }));
    }
    if (name === "id_program") {
      setFormData((prev) => ({ ...prev, id_program: Number(value) }));
    }
  };

  const LoadListDonVi = async () => {
    const res = await CivilServantsAPI.GetListDonVi();
    setListDonVi(res);
  }
  const LoadListCTDT = async () => {
    const res = await CivilServantsAPI.GetListCTDT({ id_faculty: optionFilter.id_faculty });
    setListCTDT(res);
  }

  const showData = async () => {
    const res = await CivilServantsAPI.getAll({ id_program: optionFilter.id_program, id_faculty: optionFilter.id_faculty, Page: page, PageSize: pageSize });
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
    setLoading(true);
    try {
      const res = await CivilServantsAPI.InfoCivilServant({ id_civilSer: id_civilSer });
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
    finally {
      setLoading(false);
    }
  }
  const handleAddNewCivilServant = () => {
    setModalOpen(true);
    setModalMode("create");
  }
  const handleDeleteCivilServant = async (id_civilSer: number) => {
    const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóao toàn bộ dữ liệu của CBVC này và những dữ liệu liên quan, bạn muốn tiếp tục?");
    if (confirmDel) {
      setLoading(true);
      try {
        const res = await CivilServantsAPI.DeleteCivilServant({ id_civilSer: id_civilSer });
        if (res.success) {
          SweetAlert("success", res.message);
          showData();
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
  const handleSave = async () => {
    if (modalMode === "create") {
      setLoading(true);
      try {
        const res = await CivilServantsAPI.CreateNewCivilServant({
          code_civilSer: formData.code_civilSer,
          fullname_civilSer: formData.fullname_civilSer,
          email: formData.email,
          birthday: formData.birthday,
          id_faculty: Number(optionFilter.id_faculty || 0),
          id_program: Number(optionFilter.id_program || 0),
        });
        if (res.success) {
          SweetAlert("success", res.message);
          setModalOpen(false);
          showData();
        } else {
          SweetAlert("error", res.message);
        }
      }
      finally {
        setLoading(false);
      }
    }
    else {
      setLoading(true);
      try {
        const res = await CivilServantsAPI.UpdateCivilServant({
          id_civilSer: Number(formData.id_civilSer),
          code_civilSer: formData.code_civilSer,
          fullname_civilSer: formData.fullname_civilSer,
          email: formData.email,
          birthday: formData.birthday,
          id_program: Number(optionFilter.id_program),
        });
        if (res.success) {
          SweetAlert("success", res.message);
          setModalOpen(false);
          showData();
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
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const res = await CivilServantsAPI.ExportExcel({
        id_program: Number(optionFilter.id_program),
        id_faculty: Number(optionFilter.id_faculty),
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
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!selectedFile) {
        Swal.fire("Thông báo", "Vui lòng chọn file Excel!", "warning");
        return;
      }
      setLoading(true);
      const res = await CivilServantsAPI.UploadExcelCourse(selectedFile, Number(optionFilter.id_program));

      setLoading(false);
      if (res.success) {
        SweetAlert("success", res.message);
        showData();
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
  const handleDownloadTemplate = () => {
    setLoading(true);
    try {
      const link = document.createElement("a");
      link.href = "/file-import/ImportCivilServants.xlsx";
      link.download = "TemplateImport.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    LoadListDonVi();
  }, []);
  useEffect(() => {
    if (optionFilter.id_faculty > 0) {
      LoadListCTDT();
    }
  }, [optionFilter.id_faculty]);
  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">
              Quản lý Danh sách Cán bộ viên chức thuộc Đơn vị
            </h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo Đơn vị"
                    name="id_faculty_filter"
                    value={optionFilter.id_faculty}
                    onChange={handleInputChange}
                    options={[
                      { value: 0, text: "Tất cả" },
                      ...listDonVi.map(item => ({
                        value: item.id_faculty,
                        text: item.name_faculty
                      }))
                    ]}
                  />
                </div>
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo CTĐT"
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
                <div className="col-md-6">
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
                  <button className="btn btn-ceo-butterfly" onClick={handleAddNewCivilServant}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button
                    className="btn btn-ceo-green"
                    id="exportExcel"
                    data-toggle="modal"
                    data-target="#importExcelModal"
                  >
                    <i className="fas fa-file-excel mr-1" /> Import danh sách Giảng viên từ Excel
                  </button>
                  <button className="btn btn-ceo-green" onClick={handleExportExcel}>
                    <i className="fas fa-file-excel mr-1" /> Xuất dữ liệu ra file Excel
                  </button>
                  <button className="btn btn-ceo-blue" onClick={() => showData()}>
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
                  <h5 className="modal-title">Import danh sách Giảng viên từ Excel</h5>
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
                      <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                      <td data-label="Mã viên chức" className="formatSo">{item.code_civilSer}</td>
                      <td data-label="Tên viên chức">{item.fullname_civilSer}</td>
                      <td data-label="Email">{item.email}</td>
                      <td data-label="Thuộc CTĐT">{item.name_program}</td>
                      <td data-label="Thuộc Đơn vị">{item.name_faculty}</td>
                      <td data-label="Ngày sinh" className="formatSo">{item.birthday}</td>
                      <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                      <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                      <td data-label="*" className="formatSo">
                        <div className="d-flex justify-content-center flex-wrap gap-3">
                          <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleEditCivilServant(item.id_civilSer)}>
                            <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                          </button>
                          <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteCivilServant(item.id_civilSer)}>
                            <i className="anticon anticon-delete me-1" /> Xóa bỏ
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


    </div>
  );
}

export default CivilServants;
