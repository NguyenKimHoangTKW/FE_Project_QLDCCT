import { useEffect, useState } from "react";
import { YearAPI } from "../../../../api/Admin/Year/Year";
import Modal from "../../../../components/ui/Modal";

function DanhSachNam() {
  const [year, setYear] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<{ value_year?: number; name_year: string }>({
    name_year: "",
  });

  // load list
  const fetchData = async () => {
    const res = await YearAPI.getAll();
    if (res?.success) setYear(res.data);
    else setYear([]);
  };

  useEffect(() => {
    fetchData();
  }, []);


  const headers = ["STT", "ID Năm", "Tên năm", "Thao tác"];

  const handleAdd = () => {
    setModalMode("create");
    setFormData({ name_year: "" });
    setShowModal(true);
  };

  const handleEdit = async (value_year: number) => {
    setModalMode("edit");
    const data = { value_year: value_year, name_year: "" };
    const res = await YearAPI.getInfo(data);

    if (res) {
      setFormData({
        value_year: res.value_year,
        name_year: res.name_year,
      });
      setShowModal(true);
    } else {
      alert("Không tìm thấy dữ liệu năm học!");
    }
  };

  const handleSave = async () => {
    if (!formData.name_year?.trim()) {
      alert("Tên năm không được để trống!");
      return;
    }

    if (modalMode === "create") {
      const res = await YearAPI.AddNew({ name_year: formData.name_year });
      if (res.success) {
        alert(res.message);
        await fetchData();
        setShowModal(false);
      } else {
        alert(res.message);
      }
    } else {
      if (!formData.value_year) {
        alert("Thiếu ID năm để cập nhật");
        return;
      }
      const res = await YearAPI.update({
        value_year: formData.value_year,
        name_year: formData.name_year,
      });
      if (res.success) {
        alert(res.message || "Cập nhật thành công!");
        await fetchData();
        setShowModal(false);
      } else {
        alert(res.message || "Có lỗi xảy ra!");
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
                        <td>{index + 1}</td>
                        <td>{y.id_year}</td>
                        <td>{y.name_year}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(y.id_year)}
                          >
                            Xem / Sửa
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

          {/* Modal dùng chung */}
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
