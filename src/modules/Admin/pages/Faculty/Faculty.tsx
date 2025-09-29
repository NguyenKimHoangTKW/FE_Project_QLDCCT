import React, { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../../URL_Config";
import { FacultyApi } from "../../../../api/Admin/Faculty/facultyapi";
import Modal from "../../../../components/ui/Modal";
import {
  SweetAlert,
  SweetAlertDel,
} from "../../../../components/ui/SweetAlert";

function FacultyInterface() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  const [idYear, setIdYear] = useState<number | null>(null);
  const [listYear, setListYear] = useState<any[]>([]);

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showModal, setShowModal] = useState(false);
  const didFetch = useRef(false);

  interface FacultyInput {
    id_faculty: number | null;
    code_faciulty: string;
    name_faculty: string;
    value_year: number | null;
  }
  const [formData, setFormData] = useState<FacultyInput>({
    id_faculty: null,
    code_faciulty: "",
    name_faculty: "",
    value_year: null,
  });

  const headers = [
    { label: "STT", key: "" },
    { label: "ID Đơn vị", key: "id_faculty" },
    { label: "Mã đơn vị", key: "code_faciulty" },
    { label: "Tên đơn vị", key: "name_faculty" },
    { label: "Năm hoạt động", key: "name_year" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];

  const LoadYearByFaculty = async () => {
    const res = await FacultyApi.loadNambyDonvi();
    if (res.success && res.data.length > 0) {
      setListYear(res.data);
      setIdYear(Number(res.data[0].value));
    }
  };

  const LoadFacultyByYear = async (yearId: number) => {
    const res = await FacultyApi.getAll(yearId, { page, pageSize });
    if (res.success) {
      setAllData(res.data); 
      setFilteredData(res.data); 
    } else {
      setAllData([]);
      setFilteredData([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "value_year") {
      setIdYear(Number(value));
      setFormData((prev) => ({ ...prev, value_year: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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

  const handleAdd = () => {
    setFormData({
      id_faculty: null,
      code_faciulty: "",
      name_faculty: "",
      value_year: idYear,
    });
    setModalMode("create");
    setShowModal(true);
  };

  const handleEdit = async (id: number) => {
    setModalMode("edit");
    const res = await FacultyApi.info({ id_faculty: id });
    setFormData({
      id_faculty: res.id_faculty,
      code_faciulty: res.code_faciulty,
      name_faculty: res.name_faculty,
      value_year: idYear,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (modalMode === "create") {
      const res = await FacultyApi.Add({
        code_faciulty: formData.code_faciulty,
        name_faculty: formData.name_faculty,
        id_year: idYear,
      });
      if (res.success) {
        SweetAlert("success", res.message);
        await LoadFacultyByYear(idYear!);
        setShowModal(false);
      } else {
        SweetAlert("error", res.message);
      }
    } else {
      const res = await FacultyApi.update({
        id_faculty: formData.id_faculty,
        code_faciulty: formData.code_faciulty,
        name_faculty: formData.name_faculty,
      });
      if (res.success) {
        SweetAlert("success", res.message);
        await LoadFacultyByYear(idYear!);
        setShowModal(false);
      } else {
        SweetAlert("error", res.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDel = await SweetAlertDel(
      "Bằng việc đồng ý, bạn sẽ xóa Đơn vị này cũng những dữ liệu liên quan, bạn muốn xóa?"
    );
    if (confirmDel) {
      const res = await FacultyApi.delete(id);
      if (res.success) {
        SweetAlert("success", res.message);
        await LoadFacultyByYear(idYear!);
      } else {
        SweetAlert("error", res.message);
      }
    }
  };
  useEffect(() => {
    if (!didFetch.current) {
      LoadYearByFaculty();
      didFetch.current = true;
    }
  }, []);

  useEffect(() => {
    if (idYear !== null) {
      LoadFacultyByYear(idYear);
    }
  }, [idYear]);

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const dataToShow = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">Quản lý Danh sách Đơn vị</h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Lọc theo năm</label>
                  <select
                    className="form-control"
                    name="value_year"
                    value={idYear ?? ""}
                    onChange={handleInputChange}
                  >
                    {listYear.length > 0 ? (
                      listYear.map((items, index) => (
                        <option key={index} value={items.value}>
                          {items.text}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có dữ liệu</option>
                    )}
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

          {/* Table */}
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
                  dataToShow.map((item: any, index: number) => (
                    <tr key={item.id_faculty}>
                      <td className="formatSo">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="formatSo">{item.id_faculty}</td>
                      <td className="formatSo">{item.code_faciulty}</td>
                      <td>{item.name_faculty}</td>
                      <td>{item.name_year}</td>
                      <td className="formatSo">
                        {unixTimestampToDate(item.time_cre)}
                      </td>
                      <td className="formatSo">
                        {unixTimestampToDate(item.time_up)}
                      </td>
                      <td>
                        <button
                          className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                          onClick={() => handleEdit(item.id_faculty)}
                        >
                          <i className="anticon anticon-edit" />
                        </button>
                        <button
                          className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                          onClick={() => handleDelete(item.id_faculty)}
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
        </div>
      </div>

      <Modal
        isOpen={showModal}
        title={
          modalMode === "create"
            ? "Thêm mới Đơn vị"
            : "Chỉnh sửa thông tin Đơn vị"
        }
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <form id="modal-body" autoComplete="off">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Mã đơn vị</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="code_faciulty"
                className="form-control"
                value={formData.code_faciulty || ""}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Tên đơn vị</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="name_faculty"
                className="form-control"
                value={formData.name_faculty || ""}
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FacultyInterface;
