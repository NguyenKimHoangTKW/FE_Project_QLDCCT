import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { UsersAPI } from "../../../api/Admin/UsersAPI";
import { unixTimestampToDate } from "../../../URL_Config";
import Loading from "../../../components/ui/Loading";
import Select from "react-select";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
function UsersList() {
  const navigate = useNavigate();
  const didFetch = useRef(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [allData, setAllData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [listType, setListType] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [idTypeSelected, setIdTypeSelected] = useState(0);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showModalType, setShowModalType] = useState(false);
  const [selected_typeUserValue, setSelected_typeUserValue] = useState<any[]>(
    []
  );
  interface UserInput {
    id_users: number | null;
    Username: string;
    email: string;
    id_type_users: number | null;
    status: number | null;
  }
  const [formData, setFormData] = useState<UserInput>({
    Username: "",
    email: "",
  });
  const Columns = [
    {
      name: "STT",
      selector: (_row: any, index: number) => index + 1,
      width: "80px",
      cell: (row: any, index: number) => (
        <div className="text-center w-full">{index + 1}</div>
      ),
    },
    {
      name: "ID Users",
      selector: (row: any) => row.id_users,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.id_users}</div>,
    },
    {
      name: "Tên tài khoản",
      selector: (row: any) => row.username,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.username}</div>,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.email}</div>,
    },
    {
      name: "Tên Quyền",
      selector: (row: any) => row.name_type_users,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.name_type_users}</div>,
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
      name: "Trạng thái hoạt động",
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.status}</div>,
    },
    {
      name: "Hành động",
      width: "120px",
      cell: (row: any) => (
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-icon btn-hover btn-sm btn-rounded"
            onClick={() =>
              navigate(
                `/admin/quan-li-danh-sach-user/phan-quyen/${row.id_users}`
              )
            }
          >
            <i className="anticon anticon-edit text-primary" />
          </button>
          <button
            className="btn btn-icon btn-hover btn-sm btn-rounded"
            onClick={() => handleDelete(row.id_users)}
          >
            <i className="anticon anticon-delete text-danger" />
          </button>
        </div>
      ),
    },
  ];
  const showData = async () => {
    try {
      setLoading(true);
      const res = await UsersAPI.getLoadDanhSachUser(idTypeSelected, {
        page,
        perPage,
      });
      if (res.success) {
        setAllData(res.data);
        setTotalRows(res.totalRecords);
      } else {
        setAllData([]);
        setTotalRows(0);
      }
    } finally {
      setLoading(false);
    }
  };
  const GetListTypeUser = async () => {
    const res = await UsersAPI.getListTypeUsers();
    if (res.success) {
      const formatted = res.data.map((item: any) => ({
        value: item.value,
        label: item.name,
      }));
      setListType(formatted);
    } else {
      setListType([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "selected_typeUser") {
      const Value = Number(value);
      setIdTypeSelected(Value);
    }
  };
  const handleAdd = async () => {
    setModalMode("create");
    setShowModal(true);
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
  useEffect(() => {
    if (!didFetch.current) {
      GetListTypeUser();
      showData();
      didFetch.current = true;
    }
  }, []);

  const handleSelectChange = (opt: any) => {
    setSelected(opt);
    setIdTypeSelected(opt ? opt.value : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "create") {
      const res = await UsersAPI.AddNew({
        email: formData.email,
      });

      if (res.success) {
        showData();
        SweetAlert("success", res.message);
        setShowModal(false);
        setFormData({ email: "" });
      } else {
        SweetAlert("error", res.message);
      }
    }
  };
  const handleDelete = async (id: Number) => {
    const confirm = await SweetAlertDel(
      "Bằng việc đồng ý, bạn sẽ xóa dữ liệu tài khoản này và các dữ liệu liên quan khác, bạn muốn xóa?"
    );
    if (confirm) {
      const res = await UsersAPI.Delete(id);
      if (res.success) {
        SweetAlert("success", res.message);
        showData();
      } else {
        SweetAlert("error", res.message);
      }
    }
  };

  const handleEditPermission = async (id_users: number) => {
    const res = await UsersAPI.GetInfo({ id_users });
    GetListTypeUserPermission();
    setShowModalType(true);
    setUserInfo(res);
  };

  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">Quản lý năm</h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Lọc theo Quyền tài khoản</label>
                  <Select
                    options={listType}
                    value={selected}
                    onChange={handleSelectChange}
                    placeholder="Chọn quyền..."
                    isClearable
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-success" onClick={handleAdd}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button className="btn btn-primary" onClick={showData}>
                    <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                  </button>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="m-t-25">
            <div className="table-responsive">
              <DataTable
                title="Danh sách người dùng"
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
          </div>
        </div>
      </div>
      {/* Modal Thêm mới tài khoản*/}
      <Modal
        isOpen={showModal}
        title={
          modalMode === "create" ? "Thêm mới Tài khoản" : "Chỉnh sửa tài khoản"
        }
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <form id="modal-body">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Nhập Email</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="email"
                value={formData.email}
                className="form-control"
                onChange={handleInputChange}
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </Modal>
      {/* EndModal Thêm mới tài khoản*/}
    </div>
  );
}
export default UsersList;
