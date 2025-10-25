import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import { TrainingProgramAPI } from "../../../api/Admin/TrainingProgramAPI";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Loading from "../../../components/ui/Loading";

function TrainingProgramInterface() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showModal, setShowModal] = useState(false);
  const didFetch = useRef(false);
  const [searchText, setSearchText] = useState("");
  const [listYear, setListYear] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [listDonVi, setListDonVi] = useState<any[]>([]);
  const [listDonViValue, setListDonViValue] = useState<any[]>([]);
  const [idSelectedDonVi, setIdSelectedDonVi] = useState(Number);
  const [idYearValue, setIdYearValue] = useState(Number);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  interface TrainingProgramInput {
    id_program: number | null;
    id_faculty: number | null;
    code_program: string;
    name_program: string;
    value_year: number | null;
  }
  const defaultFormData: TrainingProgramInput = {
    code_program: "",
    id_faculty: null,
    id_program: null,
    name_program: "",
    value_year: null,
  };
  const [fromData, setFormData] = useState<TrainingProgramInput>({
    code_program: "",
    id_faculty: null,
    id_program: null,
    name_program: "",
    value_year: null,
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

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "value_year") {
      const yearValue = Number(value);
      setFormData((prev) => ({ ...prev, value_year: yearValue }));
      await LoadSelectDonViByYear(yearValue);
    } else if (name === "value_year_value") {
      const yearValue = Number(value);
      setIdYearValue(yearValue);
      await LoadSelectDonViByYearValue(yearValue);
    } else if (name === "selected-year") {
      setIdSelectedDonVi(Number(value));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const ShowData = async () => {
    const res = await TrainingProgramAPI.getAllProgramCtdt(idSelectedDonVi, {
      page,
      pageSize,
      searchText,
    });
    if (res.success) {
      setAllData(res.data || []);
      setFilteredData(res.data || []);
      setTotalRecords(res.totalRecords || 0);
      setTotalPages(res.totalPages || 1);
    } else {
      setFilteredData([]);
      setAllData([]);
      setTotalPages(0);
      setTotalRecords(1);
    }
  };
  const handleAdd = async () => {
    setShowModal(true);
    setModalMode("create");
    await LoadSelectDonViByYearValue(idYearValue);
  };
  const handleInfo = async (id: number) => {
    setShowModal(true);
    setModalMode("edit");
    const res = await TrainingProgramAPI.GetInfoProgram({
      id_program: id,
    });
    await LoadSelectDonViByYearValue(idYearValue);
    setFormData((prev) => ({
      ...prev,
      code_program: res.code_program,
      name_program: res.name_program,
      id_faculty: res.id_faculty,
      id_program: res.id_program,
    }));
  };
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (
      key === "code_program" ||
      key === "name_program" ||
      key === "name_faculty"
    ) {
      setSearchText(value);
      setPage(1);
    }
  };
  const handleSave = async () => {
    if (modalMode === "create") {
      const res = await TrainingProgramAPI.AddNewProgram({
        id_faculty: fromData.id_faculty,
        code_program: fromData.code_program,
        name_program: fromData.name_program,
      });
      if (res.success) {
        SweetAlert("success", res.message);
        setShowModal(false);
        await ShowData();
      } else {
        SweetAlert("error", res.message);
      }
    } else {
      const res = await TrainingProgramAPI.UpdateInfoProgram({
        id_program: fromData.id_program,
        id_faculty: fromData.id_faculty,
        code_program: fromData.code_program,
        name_program: fromData.name_program,
      });
      if (res.success) {
        SweetAlert("success", res.message);
        setShowModal(false);
        await ShowData();
      } else {
        SweetAlert("error", res.message);
      }
    }
  };
  const LoadSelectedYear = async () => {
    const res = await TrainingProgramAPI.getSelectYear();
    setIdYearValue(res[0].value_year);
    setListYear(res);
  };
  const LoadSelectDonViByYear = async (idYear: number) => {
    const res = await TrainingProgramAPI.getSelectFacultyByYear(idYear);
    if (idYear === 0) {
      setIdSelectedDonVi(0);
      setListDonVi([]);
    } else {
      setIdSelectedDonVi(res[0].value);
      setListDonVi(res);
    }
  };
  const LoadSelectDonViByYearValue = async (idYear: number) => {
    const res = await TrainingProgramAPI.getSelectFacultyByYear(idYear);
    const idFaculty = res[0].value;
    setFormData((prev) => ({
      ...prev,
      id_faculty: idFaculty,
    }));
    setListDonViValue(res);
  };

  const handleDelete = async (id: number) => {
    const confirmDel = await SweetAlertDel(
      "Bằng việc đồng ý, bạn sẽ xóa CTĐT này và những dữ liệu liên quan, bạn muốn xóa?"
    );
    if (confirmDel) {
      const res = await TrainingProgramAPI.DeleteProgram(id);
      if (res.success) {
        SweetAlert("success", res.message);
        await ShowData();
      } else {
        SweetAlert("error", res.message);
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire("Thông báo", "Vui lòng chọn file Excel!", "warning");
      return;
    }

    setLoading(true);
    const res = await TrainingProgramAPI.UploadExcel(selectedFile);
    setLoading(false);
    if (res.data.success) {
      SweetAlert("success", res.data.message);
    } else {
      SweetAlert("error", res.data.message);
    }
  };
  useEffect(() => {
    if (!didFetch.current) {
      LoadSelectedYear();
      didFetch.current = true;
    }
  }, []);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      ShowData();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [page, searchText]);

  const dataToShow = filteredData.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">
              Quản lý Danh sách Chương trình đào tạo
            </h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Lọc theo năm</label>
                  <select
                    className="form-control"
                    name="value_year"
                    onChange={handleInputChange}
                  >
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
                  <button
                    className="btn btn-success"
                    id="exportExcel"
                    data-toggle="modal"
                    data-target="#importExcelModal"
                  >
                    <i className="fas fa-file-excel mr-1" /> Import từ Excel
                  </button>
                  <button className="btn btn-primary" onClick={ShowData}>
                    <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
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
                  <h5 className="modal-title">Import CTĐT từ Excel</h5>
                  <button type="button" className="close" data-dismiss="modal">
                    <i className="anticon anticon-close" />
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="excelFile">Chọn file Excel</label>
                      <input
                        type="file"
                        className="form-control"
                        id="excelFile"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success btn-tone m-r-5"
                      disabled={loading}
                    >
                      {loading ? "Đang upload..." : "Upload"}
                    </button>

                    <a href="/DataExport/Mau/Mau_Upload_Khoa.xlsx" download>
                      <button
                        type="button"
                        className="btn btn-info btn-tone m-r-5"
                      >
                        Tải file mẫu
                      </button>
                    </a>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/*End Modal Import*/}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx}>{h.label}</th>
                  ))}
                </tr>
                <tr>
                  {headers.map((h, idx) => (
                    <th key={idx}>
                      {h.key ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={filters[h.key] || ""}
                          onChange={(e) =>
                            handleFilterChange(h.key, e.target.value)
                          }
                        />
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item: any, index: number) => (
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
                          onClick={() => handleInfo(item.id_program)}
                        >
                          <i className="anticon anticon-edit" />
                        </button>
                        <button
                          className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                          onClick={() => handleDelete(item.id_program)}
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
          title={
            modalMode === "create"
              ? "Thêm mới Chương trình đào tạo"
              : "Chỉnh sửa chương trình đào tạo"
          }
          onClose={() => {
            setShowModal(false);
            setFormData(defaultFormData);
          }}
          onSave={handleSave}
        >
          <form id="modal-body">
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Chọn năm</label>
              <div className="col-sm-10">
                <select
                  className="form-control"
                  name="value_year_value"
                  onChange={handleInputChange}
                >
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
  );
}
export default TrainingProgramInterface;
