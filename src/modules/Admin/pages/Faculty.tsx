import React, { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import { FacultyApi } from "../../../api/Admin/facultyapi";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Loading from "../../../components/ui/Loading";
import Swal from "sweetalert2";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
function FacultyInterface() {
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
  interface Faculty {
    id_faculty: number;
    name_faculty: string;
    code_faculty: string;
  }
  const [formData, setFormData] = useState<Faculty>({
    id_faculty: 0,
    name_faculty: "",
    code_faculty: "",
  });
  const headers = [
    { label: "STT", key: "" },
    { label: "Mã đơn vị", key: "code_faculty" },
    { label: "Tên đơn vị", key: "name_faculty" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const showData = async () => {
    setLoading(true);
    try {
      const res = await FacultyApi.GetListFaculty({ Page: page, PageSize: pageSize });
      if (res.success) {
        setListFaculty(res.data);
        setTotalRecords(Number(res.totalRecords) || 0);
        setTotalPages(Number(res.totalPages) || 1);
        setPageSize(Number(res.pageSize) || 10);
      }
      else {
        SweetAlert("error", res.message);
        setListFaculty([]);
        setTotalRecords(0);
        setTotalPages(1);
        setPageSize(10);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleAddNewFaculty = async () => {
    setShowModal(true);
    setModalMode("create");
  }
  const handleEditFaculty = async (id_faculty: number) => {
    setShowModal(true);
    setModalMode("edit");
    const res = await FacultyApi.InfoFaculty({ id_faculty: id_faculty });
    setFormData({
      id_faculty: res.data.id_faculty,
      name_faculty: res.data.name_faculty,
      code_faculty: res.data.code_faculty,
    });
  }
  const handleDeleteFaculty = async (id_faculty: number) => {
    try {
      const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa đơn vị này và các dữ liệu liên quan, bạn muốn xóa?");
      if (confirm) {
        setLoading(true);
        const res = await FacultyApi.DeleteFaculty({ id_faculty: id_faculty });
        if (res.success) {
          SweetAlert("success", res.message);
          showData();
        }
        else {
          SweetAlert("error", res.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }
  const handleSaveFaculty = async () => {
    if (modalMode === "create") {
      setLoading(true);
      try {
        const res = await FacultyApi.AddNewFaculty({ name_faculty: formData.name_faculty, code_faculty: formData.code_faculty });
        if (res.success) {
          SweetAlert("success", res.message);
          showData();
        }
        else {
          SweetAlert("error", res.message);
        }
      } finally {
        setLoading(false);
      }
    }
    else {
      setLoading(true);
      try {
        const res = await FacultyApi.UpdateFaculty({ id_faculty: formData.id_faculty, name_faculty: formData.name_faculty, code_faculty: formData.code_faculty });
        if (res.success) {
          SweetAlert("success", res.message);
          showData();
        }
        else {
          SweetAlert("error", res.message);
        }
      } finally {
        setLoading(false);
      }
    }
  }
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const res = await FacultyApi.ExportExcel();

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
      const res = await FacultyApi.UploadExcelCourse(selectedFile);

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
      link.href = "/file-import/ImportFaculty.xlsx";
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
    showData();
  }, [page, pageSize]);
  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">
              Quản lý Danh sách đơn vị
            </h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-ceo-butterfly" onClick={handleAddNewFaculty}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button
                    className="btn btn-ceo-green"
                    id="exportExcel"
                    data-toggle="modal"
                    data-target="#importExcelModal"
                  >
                    <i className="fas fa-file-excel mr-1" /> Import danh sách từ file Excel
                  </button>
                  <button className="btn btn-ceo-green" onClick={handleExportExcel}>
                    <i className="fas fa-file-excel mr-1" /> Xuất dữ liệu ra file Excel
                  </button>
                  <button className="btn btn-ceo-blue" onClick={showData}>
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
                  <h5 className="modal-title">Import danh sách đơn vị từ Excel</h5>
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
          <div className="card mt-3">
            <div className="card-body">
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
                    {listFaculty.length > 0 ? (
                      listFaculty.map((item, index) => (
                        <tr key={item.id_faculty}>
                          <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                          <td data-label="Mã đơn vị" className="formatSo">{item.code_faciulty}</td>
                          <td data-label="Tên đơn vị" className="formatSo">{item.name_faculty}</td>
                          <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                          <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                          <td data-label="*" className="formatSo">
                            <div className="d-flex justify-content-center flex-wrap gap-3">
                              <button className="btn btn-sm btn-ceo-butterfly" onClick={() => handleEditFaculty(item.id_faculty)}>
                                <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                              </button>
                              <button className="btn btn-sm btn-ceo-red" onClick={() => handleDeleteFaculty(item.id_faculty)}>
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
            </div>
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
        title={modalMode === "create" ? "Thêm mới đơn vị" : "Chỉnh sửa đơn vị"}
        onClose={() => setShowModal(false)}
        onSave={handleSaveFaculty}
      >
        <form id="modal-body" autoComplete="off">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Tên đơn vị</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" name="name_faculty" value={formData.name_faculty} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Mã đơn vị</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" name="code_faculty" value={formData.code_faculty} onChange={handleInputChange} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FacultyInterface;
