import React, { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import { FacultyApi } from "../../../api/Admin/facultyapi";
import Modal from "../../../components/ui/Modal";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Select from "react-select";
import Loading from "../../../components/ui/Loading";
import DataTable from "react-data-table-component";

function FacultyInterface() {
  const [allData, setAllData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [idYear, setIdYear] = useState<number | null>(null);
  const [listYear, setListYear] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showModal, setShowModal] = useState(false);
  const didFetch = useRef(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  const handleSelectChange = async (opt: any) => {
    setSelected(opt);
    setFormData((prev) => ({
      ...prev,
      value_year: opt.value,
    }));
    setIdYear(opt.value);
  };
  const LoadYearByFaculty = async () => {
    const res = await FacultyApi.loadNambyDonvi();
    if (res.success) {
      const formatted = res.data.map((item: any) => ({
        value: item.value,
        label: item.text,
      }));
      setListYear(formatted);
      const firstOption = formatted[0];
      setSelected(firstOption);
      setIdYear(Number(firstOption.value));
      setFormData((prev) => ({
        ...prev,
        value_year: firstOption.value,
      }));
    }
  };
  const Columns = [
    {
      name: "STT",
      width: "80px",
      cell: (row: any, index: number) => (
        <div className="text-center w-full">
          {(page - 1) * perPage + (index + 1)}
        </div>
      ),
    },
    {
      name: "ID Đơn vị",
      selector: (row: any) => row.id_faculty,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.id_faculty}</div>,
    },
    {
      name: "Mã Đơn vị",
      selector: (row: any) => row.code_faciulty,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.code_faciulty}</div>,
    },
    {
      name: "Tên Đơn vị",
      selector: (row: any) => row.name_faculty,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.name_faculty}</div>,
    },
    {
      name: "Ngày tạo",
      selector: (row: any) => unixTimestampToDate(row.time_cre),
      sortable: true,
      cell: (row: any) => (
        <div className="px-2">{unixTimestampToDate(row.time_cre)}</div>
      ),
    },
    {
      name: "Cập nhật lần cuối",
      selector: (row: any) => unixTimestampToDate(row.time_up),
      sortable: true,
      cell: (row: any) => (
        <div className="px-2">{unixTimestampToDate(row.time_up)}</div>
      ),
    },
    {
      name: "Năm hoạt động",
      selector: (row: any) => row.name_year,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.name_year}</div>,
    },
    {
      name: "Hành động",
      width: "120px",
      cell: (row: any) => (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-icon btn-hover btn-sm btn-rounded"
            onClick={() => handleEdit(row.id_faculty)}
          >
            <i className="anticon anticon-edit text-primary" />
          </button>
          <button
            className="btn btn-icon btn-hover btn-sm btn-rounded"
            onClick={() => handleDelete(row.id_faculty)}
          >
            <i className="anticon anticon-delete text-danger" />
          </button>
        </div>
      ),
    },
  ];
  const LoadFacultyByYear = async (
    yearId: number,
    page: number,
    size: number
  ) => {
    setLoading(true);
    const res = await FacultyApi.getAll(yearId, { page, pageSize: size });
    setLoading(false);
    if (res.success) {
      setAllData(res.data);
      setTotalRows(res.totalRecords);
    } else {
      setAllData([]);
      setTotalRows(0);
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
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "name_faculty" || key === "code_faciulty") {
      setSearchText(value);
      setPage(1);
    }
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
      const delayDebounce = setTimeout(() => {
        LoadFacultyByYear(idYear, page, perPage);
      }, 200);
      return () => clearTimeout(delayDebounce);
    }
  }, [idYear, page, perPage]);

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
    const res = await FacultyApi.uploadExcelKhoaVienTruong(selectedFile);

    setLoading(false);

    console.log(res.data);

    if (res.data.success) {
      SweetAlert("success", res.data.message);
    } else {
      SweetAlert("error", res.data.message);
    }
  };
  return (
    <div className="main-content">
      <Loading isOpen={loading} />
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
                  <Select
                    options={listYear}
                    value={selected}
                    onChange={handleSelectChange}
                    isClearable
                  />
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
                  <h5 className="modal-title">Import Khoa từ Excel</h5>
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
          {/* Table */}
          <div className="table-responsive">
            <DataTable
              columns={Columns}
              data={allData}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationPerPage={perPage}
              onChangePage={setPage}
              onChangeRowsPerPage={(newPerPage, newPage) => {
                setPerPage(newPerPage);
                setPage(newPage);
              }}
              highlightOnHover
              dense
            />
          </div>

          {/* Pagination */}
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
