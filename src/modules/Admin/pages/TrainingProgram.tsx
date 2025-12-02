import { useEffect, useState } from "react";
import Loading from "../../../components/ui/Loading";
import { TrainingProgramDonViAPI } from "../../../api/DonVi/TrainingProgram";
import { unixTimestampToDate } from "../../../URL_Config";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Modal from "../../../components/ui/Modal";
import Swal from "sweetalert2";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import { TrainingProgramAPI } from "../../../api/Admin/TrainingProgramAPI";
export default function TrainingProgramInterfaceAdmin() {
  const [loading, setLoading] = useState(false);
  const [listFaculty, setListFaculty] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allData, setAllData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  interface OptionFilter {
    id_faculty: number | null;
  }
  const [optionFilter, setOptionFilter] = useState<OptionFilter>({
    id_faculty: null,
  });
  interface FormData {
    id_program: number | null;
    code_program: string;
    name_program: string;
  }
  const [formData, setFormData] = useState<FormData>({
    id_program: null,
    code_program: "",
    name_program: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setOptionFilter((prev) => ({
      ...prev,
      id_faculty: Number(value)
    }));
  };

  const GetListFaculty = async () => {
    const res = await TrainingProgramAPI.GetListFaculty();
    setListFaculty(res);
    setOptionFilter({ id_faculty: 0 });
  };

  const GetListProgram = async () => {
    setLoading(true);
    try {
      const res = await TrainingProgramAPI.GetListProgram({ id_faculty: Number(optionFilter.id_faculty), Page: page, PageSize: pageSize });
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
      }
    }
    finally {
      setLoading(false);
    }
  }
  const headers = [
    { label: "STT", key: "" },
    { label: "Mã CTĐT", key: "code_program" },
    { label: "Tên CTĐT", key: "name_program" },
    { label: "Thuộc đơn vị", key: "name_faculty" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];
  const filteredData = allData.filter((item) => {
    const keyword = searchText.toLowerCase().trim();

    return (
      item.code_program?.toLowerCase().includes(keyword) ||
      item.name_program?.toLowerCase().includes(keyword) ||
      item.name_faculty?.toLowerCase().includes(keyword) ||
      unixTimestampToDate(item.time_cre)?.toLowerCase().includes(keyword) ||
      unixTimestampToDate(item.time_up)?.toLowerCase().includes(keyword)
    );
  });
  const handleAddNewProgram = () => {
    setShowModal(true);
    setModalMode("create");
  }
  const handleInfoProgram = async (id_program: number) => {
    setLoading(true);
    try {
      const res = await TrainingProgramAPI.InfoProgram({ id_program: id_program });
      setFormData((prev) => ({ ...prev, id_program: res.id_program, code_program: res.code_program, name_program: res.name_program }));
      setShowModal(true);
      setModalMode("edit");
    }
    finally {
      setLoading(false);
    }
  }
  const handleDeleteProgram = async (id_program: number) => {
    const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Chương trình đào tạo này và những dữ liệu liên quan, bạn muốn xóa?");
    if (confirmDel) {
      setLoading(true);
      try {
        const res = await TrainingProgramAPI.DeleteProgram({ id_program: id_program });
        if (res.success) {
          SweetAlert("success", res.message);
          GetListProgram();
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
  const handleSaveProgram = async () => {
    if (modalMode === "create") {
      setLoading(true);
      try {
        const res = await TrainingProgramAPI.AddNewProgram({ id_faculty: Number(optionFilter.id_faculty), code_program: formData.code_program, name_program: formData.name_program });
        if (res.success) {
          SweetAlert("success", res.message);
          GetListProgram();
        }
        else {
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
        const res = await TrainingProgramAPI.UpdateProgram({ id_program: Number(formData.id_program), id_faculty: Number(optionFilter.id_faculty), code_program: formData.code_program, name_program: formData.name_program });
        if (res.success) {
          SweetAlert("success", res.message);
          GetListProgram();
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
      const res = await TrainingProgramAPI.ExportExcel({
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
      const res = await TrainingProgramAPI.UploadExcel(selectedFile, Number(optionFilter.id_faculty));

      setLoading(false);
      if (res.success) {
        SweetAlert("success", res.message);
        GetListProgram();
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
      link.href = "/file-import/ImportTrainingProgram.xlsx";
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
    GetListFaculty();
  }, []);
  useEffect(() => {
    GetListProgram();

  }, [page, pageSize]);
  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">
              Quản lý Danh sách Chương trình đào tạo thuộc đơn vị
            </h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <CeoSelect2
                    label="Lọc theo Đơn vị"
                    name="id_faculty"
                    value={optionFilter.id_faculty}
                    onChange={handleFilterChange}
                    options={[
                      { value: 0, text: "Tất cả" },
                      ...listFaculty.map(item => ({
                        value: item.value,
                        text: item.name
                      }))
                    ]}
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
                  <button className="btn btn-ceo-butterfly" onClick={handleAddNewProgram} >
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button
                    className="btn btn-ceo-green"
                    id="exportExcel"
                    data-toggle="modal"
                    data-target="#importExcelModal"
                  >
                    <i className="fas fa-file-excel mr-1" /> Import danh sách Chương trình đào tạo file từ Excel
                  </button>
                  <button className="btn btn-ceo-green" onClick={handleExportExcel} >
                    <i className="fas fa-file-excel mr-1" /> Xuất dữ liệu ra file Excel
                  </button>
                  <button className="btn btn-ceo-blue" onClick={() => GetListProgram()} >
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
                  <h5 className="modal-title">Import danh sách Chương trình đào tạo từ Excel</h5>
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
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id_program}>
                      <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                      <td data-label="Mã CTĐT" className="formatSo">{item.code_program}</td>
                      <td data-label="Tên CTĐT">{item.name_program}</td>
                      <td data-label="Thuộc đơn vị">{item.name_faculty}</td>
                      <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                      <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                      <td data-label="*" className="formatSo">
                        <div className="d-flex justify-content-center flex-wrap gap-3">
                          <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleInfoProgram(item.id_program)}>
                            <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                          </button>
                          <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteProgram(item.id_program)}>
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
        isOpen={showModal}
        title={modalMode === "create" ? "Thêm mới Chương trình đào tạo" : "Chỉnh sửa Chương trình đào tạo"}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProgram}
      >
        <form id="modal-body" autoComplete="off">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label ceo-label">Mã CTĐT</label>
            <div className="col-sm-10">
              <input type="text" className="form-control ceo-input" name="code_program" value={formData.code_program ?? ""} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label ceo-label">Tên CTĐT</label>
            <div className="col-sm-10">
              <input type="text" className="form-control ceo-input" name="name_program" value={formData.name_program ?? ""} onChange={handleInputChange} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}