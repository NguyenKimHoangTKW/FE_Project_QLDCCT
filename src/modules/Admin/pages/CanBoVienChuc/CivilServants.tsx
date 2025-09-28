import { useEffect, useRef, useState } from "react";
import { CivilServantsAPI } from "../../../../api/Admin/CivilServantsAPI/civilServants";
import { unixTimestampToDate } from "../../../../URL_Config";
import Modal from "../../../../components/ui/Modal";
import SweetAlert from "../../../../components/ui/SweetAlert";
function CivilServants() {
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [optionYear, setOptionYear] = useState<any[]>([]);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [formData, setFormData] = useState({
    code_civilSer: "",
    fullname_civilSer: "",
    email: "",
    birthday: "",
    value_year: null as number | null,
  });

  const didFetch = useRef(false);

  const headers = [
    { label: "STT", key: "" },
    { label: "ID Viên chức", key: "id_civilSer" },
    { label: "Mã viên chức", key: "code_civilSer" },
    { label: "Tên viên chức", key: "fullname_civilSer" },
    { label: "Email", key: "email" },
    { label: "Ngày sinh", key: "birthday" },
    { label: "Năm hoạt động", key: "name_year" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value_year" ? Number(value) : value,
    }));
  };

  const fetchData = async () => {
    const res = await CivilServantsAPI.getAll({ page: 1, pageSize: 10 });
    if (res.success) {
      setAllData(res.data);
      setFilteredData(res.data);
    }
  };

  const handleAdd = () => {
    setFormData({
      code_civilSer: "",
      fullname_civilSer: "",
      email: "",
      birthday: "",
      value_year: optionYear.length > 0 ? optionYear[0].value : null,
    });
    setModalMode("create");
    setShowModal(true);
  };

  const FilterOptionYear = async () => {
    const res = await CivilServantsAPI.loadYearOption();
    setOptionYear(res);

    if (!formData.value_year && res.length > 0) {
      setFormData((prev) => ({
        ...prev,
        value_year: res[0].value,
      }));
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      fetchData();
      FilterOptionYear();
      didFetch.current = true;
    }
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let temp = [...allData];
    Object.keys(newFilters).forEach((fKey) => {
      const fValue = newFilters[fKey].toLowerCase();
      if (fValue) {
        temp = temp.filter((item) =>
          String(item[fKey] || "")
            .toLowerCase()
            .includes(fValue)
        );
      }
    });
    setFilteredData(temp);
    setPage(1);
  };

  const handleSave = async () => {
    if (modalMode === "create") {
      const payload = {
        code_civilSer: formData.code_civilSer,
        fullname_civilSer: formData.fullname_civilSer,
        email: formData.email,
        birthday: formData.birthday || null,
        value_year: Number(formData.value_year),
      };

      const res = await CivilServantsAPI.create(payload);

      if (res.success) {
        await fetchData();
        SweetAlert("success", res.message);
        setShowModal(false);
      } else {
        SweetAlert("error", res.message);
      }
    }
  };

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const dataToShow = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-body">
          {/* chức năng */}
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">
              Quản lý Danh sách Cán bộ viên chức
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
                    value={formData.value_year ?? ""}
                    onChange={handleInputChange}
                  >
                    {optionYear.map((items, idx) => (
                      <option key={idx} value={items.value}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-success" onClick={handleAdd}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                </div>
              </div>
            </fieldset>
          </div>

          {/* bảng */}
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
                {dataToShow.length > 0 ? (
                  dataToShow.map((item, index) => (
                    <tr key={item.id_civilSer}>
                      <td>{(page - 1) * pageSize + index + 1}</td>
                      <td>{item.id_civilSer}</td>
                      <td>{item.code_civilSer}</td>
                      <td>{item.fullname_civilSer}</td>
                      <td>{item.email}</td>
                      <td>{item.birthday}</td>
                      <td>{item.name_year}</td>
                      <td>{unixTimestampToDate(item.time_cre)}</td>
                      <td>{unixTimestampToDate(item.time_up)}</td>
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

          {/* phân trang */}
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
      </div>

      {/* modal thêm/sửa */}
      <Modal
        isOpen={showModal}
        title={
          modalMode === "create"
            ? "Thêm mới Cán bộ viên chức"
            : "Chỉnh sửa Cán bộ viên chức"
        }
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <form id="modal-body">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Mã cán bộ</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="code_civilSer"
                className="form-control"
                value={formData.code_civilSer}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Tên cán bộ</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="fullname_civilSer"
                className="form-control"
                value={formData.fullname_civilSer}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Ngày sinh</label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CivilServants;
