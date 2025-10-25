import { useEffect, useRef, useState } from "react";
import { YearAPI } from "../../../api/Admin/YearAPI";
import Modal from "../../../components/ui/Modal";
import { SweetAlert,SweetAlertDel } from "../../../components/ui/SweetAlert";

function DanhSachNam() {
  const [year, setYear] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<{ value_year?: number; name_year: string }>({
    name_year: "",
  });
  const didFetch = useRef(false);

  const fetchData = async () => {
    const res = await YearAPI.getAll({ page, pageSize });
    if (res?.success) {
      setYear(res.data);
      setTotalPages(res.totalPages);
      setTotalRecords(res.totalRecords);
    } else {
      setYear([]);
      setTotalPages(1);
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchData();
    }
  }, [page]);

  const headers = ["STT", "ID Năm", "Tên năm", "*"];

  const handleAdd = () => {
    setModalMode("create");
    setFormData({ name_year: "" });
    setShowModal(true);
  };

  const handleEdit = async (id: number) => {
    setModalMode("edit");
    const res = await YearAPI.getById(id);
    if (res) {
      setFormData({
        value_year: res.value_year,
        name_year: res.name_year,
      });
      setShowModal(true);
    }
  };

  const handleDelte = async (id: number) =>{
    
    const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa Năm học này và các dữ liệu liên quan, bạn muốn xóa?");
    if(confirmDel){
      const res = await YearAPI.delete(id);
      if(res.success){
        SweetAlert("success",  res.message);
        await fetchData();
      }
      else{
        SweetAlert("success",  res.message);
      }
    }
  }

  const handleSave = async () => {
    if (!formData.name_year?.trim()) {
      alert("Tên năm không được để trống!");
      return;
    }

    if (modalMode === "create") {
      const res = await YearAPI.create({ name_year: formData.name_year });
      if (res.success) {
        SweetAlert("success",res.message);
        await fetchData();
        setShowModal(false);
      } else {
        SweetAlert("error",res.message);
      }
    } else {
      if (!formData.value_year) {
        alert("Thiếu ID năm để cập nhật!");
        return;
      }
      const res = await YearAPI.update(formData.value_year, {
        name_year: formData.name_year,
      });
      if (res.success) {
        SweetAlert("success",res.message);
        await fetchData();
        setShowModal(false);
      } else {
         SweetAlert("error",res.message);
      }
    }
  };


  return (
    <div className="main-content">
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">Quản lý năm</h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-success" onClick={handleAdd}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="m-t-25">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    {headers.map((h, idx) => (
                      <th key={idx}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {year.length > 0 ? (
                    year.map((y, index) => (
                      <tr key={y.id_year ?? index}>
                        <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                        <td className="formatSo">{y.id_year}</td>
                        <td className="formatSo">{y.name_year}</td>
                        <td className="formatSo">
                          <button
                            className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                            onClick={() => handleEdit(y.id_year)}
                          >
                            <i className="anticon anticon-edit" />
                          </button>
                          <button
                            className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                            onClick={() => handleDelte(y.id_year)}
                          >
                            <i className="anticon anticon-delete" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={headers.length} className="text-center text-danger">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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

          {/* Modal */}
          <Modal
            isOpen={showModal}
            title={modalMode === "create" ? "Thêm năm học mới" : "Chỉnh sửa năm học"}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          >
            <form>
              <div className="mb-3">
                <label className="form-label">Tên năm</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên năm"
                  value={formData.name_year}
                  onChange={(e) => setFormData({ ...formData, name_year: e.target.value })}
                />
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default DanhSachNam;
