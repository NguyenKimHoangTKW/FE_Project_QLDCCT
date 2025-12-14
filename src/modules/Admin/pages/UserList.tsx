import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/ui/Modal";
import { UsersAPI } from "../../../api/Admin/UsersAPI";
import { unixTimestampToDate } from "../../../URL_Config";
import Loading from "../../../components/ui/Loading";
import Select from "react-select";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
function UsersList() {
  const navigate = useNavigate();
  const didFetch = useRef(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [listType, setListType] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [idTypeSelected, setIdTypeSelected] = useState<number>(0);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [searchText, setSearchText] = useState("");
  const [rawSearchText, setRawSearchText] = useState("");
  interface UserInput {
    id_users: number | null;
    Username: string;
    email: string;
    id_type_users: number;
    status: number | null;
  }
  const [formData, setFormData] = useState<UserInput>({
    Username: "",
    email: "",
    id_users: null,
    id_type_users: 0,
    status: null,
  });

  const showData = async () => {
    try {
      setLoading(true);
      const res = await UsersAPI.getLoadDanhSachUser({
        id_type_users: Number(idTypeSelected),
        Page: page,
        PageSize: pageSize,
        searchTerm: searchText,
      });
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
    } finally {
      setLoading(false);
    }
  };
  const headers = [
    { label: "STT", key: "" },
    { label: "Tên tài khoản", key: "Username" },
    { label: "Email", key: "email" },
    { label: "Quyền tài khoản", key: "name_type_users" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];
  const GetListTypeUser = async () => {
    const res = await UsersAPI.getListTypeUsers();
    if (res.success) {
      const formatted = res.data.map((item: any) => ({
        value: item.value,
        label: item.name,
      }));
      setListType(formatted);
      setSelectedValue(0);
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
      } else {
        SweetAlert("error", res.message);
      }
    }
  };
  const handleDelete = async (id: number) => {
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
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchText(rawSearchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [rawSearchText]);
  useEffect(() => {
    if (!didFetch.current) {
      GetListTypeUser();
      didFetch.current = true;
    }
  }, []);
  useEffect(() => {
    showData();
  }, [page, pageSize, searchText]);

  return (
    <div className="main-content">
      <Loading isOpen={loading} />
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">Quản lý Danh sách tài khoản toàn trường</h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row mb-3">
                <div className="col-md-6">
 
                  <CeoSelect2
                    label="Lọc theo Quyền tài khoản"
                    name="selected_typeUser"
                    options={[
                      { value: 0, text: "Tất cả" },
                      ...listType.map((item: any) => ({
                        value: item.value,
                        text: item.label
                      })),
                    ]}
                    value={selectedValue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-ceo-butterfly" onClick={handleAdd}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button className="btn btn-ceo-blue" onClick={showData}>
                    <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
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
                      <th key={idx}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allData.length > 0 ? (
                    allData.map((item, index) => (
                      <tr key={item.id_users}>
                        <td data-label="STT" className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                        <td data-label="Tên tài khoản">{item.username}</td>
                        <td data-label="Email">{item.email}</td>
                        <td data-label="Quyền tài khoản">{item.name_type_users}</td>
                        <td data-label="Ngày tạo" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                        <td data-label="Cập nhật lần cuối" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                        <td data-label="*" className="formatSo">
                          <div className="d-flex justify-content-center flex-wrap gap-3">
                            <button className="btn btn-sm btn-ceo-butterfly" onClick={() =>
                              navigate(
                                `/admin/quan-li-danh-sach-user/phan-quyen/${item.id_users}`
                              )
                            }>
                              <i className="anticon anticon-edit me-1" /> Chỉnh sửa
                            </button>
                            <button className="btn btn-sm btn-ceo-red" onClick={() => handleDelete(item.id_users)}>
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
      <div
        className="shadow-lg d-flex flex-wrap justify-content-center align-items-center gap-3 p-3 mt-4"
        style={{
          position: "sticky",
          bottom: 0,
          background: "rgba(245, 247, 250, 0.92)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid #e5e7eb",
          zIndex: 100,
        }}
      >
        {/* Ô tìm kiếm */}
        <div className="col-md-4">
          <label className="ceo-label" style={{ fontWeight: 600, opacity: 0.8 }}>
            Tìm kiếm
          </label>

          <div className="input-group">
            <span
              className="input-group-text"
              style={{
                background: "#fff",
                borderRight: "none",
                borderRadius: "10px 0 0 10px",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập từ khóa để tìm kiếm..."
              value={rawSearchText}
              onChange={(e) => setRawSearchText(e.target.value)}
              style={{
                borderLeft: "none",
                borderRadius: "0 10px 10px 0",
                padding: "10px 12px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default UsersList;
