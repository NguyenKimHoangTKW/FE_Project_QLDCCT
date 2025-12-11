import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { UsersAPI } from "../../../api/Admin/UsersAPI";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import Loading from "../../../components/ui/Loading";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../components/ui/table";
function UserPermissionPage() {
  const { id_users } = useParams<{ id_users: string }>();
  const navigate = useNavigate();
  const [nameType, setNameType] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [listTypePermission, setListTypePermission] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [idTypeUserSelected, setIdTypeUserSelected] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [listYear, setListYear] = useState<any[]>([]);
  const [filterText, setFilterText] = useState("");
  const handleSelectedChangeValue = (opt: any) => {
    setNameType(opt.label);
    setSelectedValue(opt);
    setIdTypeUserSelected(opt ? opt.value : 0);
    if (opt.label === "CTĐT") {
      GetListCTDT();
    }
    if (opt.label === "Đơn vị") {
      GetListDonVi();
    }
  };
  const [listDonVi, setListDonVi] = useState<any[]>([]);
  const [selectedValueYear, setSelectedValueYear] = useState<any>(null);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const filteredDataDonVi = useMemo(() => {
    return listDonVi.filter(
      (item: any) =>
        item.name_faculty &&
        item.name_faculty.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, listDonVi]);

  const columnsDonVi = [
    {
      name: "STT",
      selector: (_row: any, index: number) => index + 1,
      width: "80px",
      cell: (row: any, index: number) => (
        <div className="text-center w-full">{index + 1}</div>
      ),
    },
    {
      name: "Tên đơn vị",
      selector: (row: any) => row.name_faculty,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.name_faculty}</div>,
    },
  ];

  const GetListDonVi = async () => {
    const res = await UsersAPI.GetListDonVi({ id_users: Number(id_users) });
    setListDonVi(res);
  };

  const [listCTDT, setListCTDT] = useState<[]>([]);
  const filteredDataCTDT = useMemo(() => {
    return listCTDT.filter(
      (item: any) =>
        item.name_program &&
        item.name_program.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, listCTDT]);
  const columnsCTDT = [
    {
      name: "STT",
      selector: (_row: any, index: number) => index + 1,
      width: "80px",
      cell: (row: any, index: number) => (
        <div className="text-center w-full">{index + 1}</div>
      ),
    },
    {
      name: "Tên chương trình đào tạo",
      selector: (row: any) => row.name_program,
      sortable: true,
      cell: (row: any) => <div className="px-2">{row.name_program}</div>,
    },
  ];

  const GetListCTDT = async () => {
    const res = await UsersAPI.GetListCTDT({ id_users: Number(id_users) });
    setListCTDT(res);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, typeRes] = await Promise.all([
          UsersAPI.GetInfo({ id_users: Number(id_users) }),
          UsersAPI.getListTypeUsers(),
        ]);

        if (typeRes.success) {
          const formatted = typeRes.data.map((item: any) => ({
            value: item.value,
            label: item.name,
          }));
          setListTypePermission(formatted);

          const current = formatted.find(
            (opt) => opt.value === userRes.id_type_users
          );
          setSelectedValue(current || null);
          setIdTypeUserSelected(current ? current.value : 0);
        }

        setUserInfo(userRes);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_users]);
  const isRowSelected = useCallback(
    (row: any) => row.checkedPermission === true,
    []
  );
  const handleSave = async () => {
    const listIdFac = selectedRows.map((item) => item.id_faculty);
    const listIDPro = selectedRows.map((item) => item.id_program);
    const res = await UsersAPI.SavePermission({
      id_user: Number(id_users),
      id_FacPro: selectedValue.label === "CTĐT" ? listIDPro : listIdFac,
      name_permission: selectedValue.label,
      id_type_users: selectedValue.value,
    });
    if (res.success) {
      SweetAlert("success", res.message);
    }
  };
  useEffect(() => {
    if (selectedValue) {
      handleSelectedChangeValue(selectedValue);
    }
  }, [selectedValue]);
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loading isOpen={true} />
      </div>
    );

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-body">
          <h3 className="text-uppercase mb-3">Phân quyền tài khoản</h3>
          <hr />

          {userInfo && (
            <div className="p-3">
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <img
                  src={
                    userInfo.avatar_url ||
                    "/src/assets/images/avatars/default.png"
                  }
                  alt="avatar"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "2px solid #dee2e6",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <h5 style={{ margin: 0 }}>{userInfo.Username}</h5>
                  <p>{userInfo.email}</p>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">ID người dùng</label>
                <input
                  type="text"
                  className="form-control"
                  value={userInfo.id_users}
                  disabled
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={userInfo.email}
                  disabled
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label fw-bold">Quyền hiện tại</label>
                <div
                  className="p-2 rounded text-center fw-semibold"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #ced4da",
                  }}
                >
                  {userInfo.name_type_users}
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label fw-bold">Cập nhật quyền mới</label>
                <Select
                  options={listTypePermission}
                  value={selectedValue}
                  onChange={handleSelectedChangeValue}
                  placeholder="Chọn quyền mới..."
                  isClearable
                />
              </div>
              <hr />
              <div
                className="d-flex justify-content-end align-items-center mt-4"
                style={{ gap: "20px" }}
              >
                <button
                  className="btn text-white px-4 py-2"
                  style={{ backgroundColor: "#8b5cf6", borderRadius: "8px" }}
                  onClick={() => navigate("/admin/quan-li-danh-sach-user")}
                >
                  Quay lại
                </button>

                <button
                  className="btn text-white px-4 py-2"
                  style={{ backgroundColor: "#3b82f6", borderRadius: "8px" }}
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          )}
        </div>
        <hr />
        {nameType === "Đơn vị" ? (
          <div className="w-full p-4">
            <div className="bg-white shadow-md rounded-2xl p-5">
              <div className="table-responsive">
                <DataTable
                  title="Danh sách đơn vị"
                  columns={columnsDonVi}
                  data={filteredDataDonVi}
                  pagination
                  highlightOnHover
                  dense
                  selectableRows
                  selectableRowsHighlight
                  onSelectedRowsChange={({ selectedRows }) =>
                    setSelectedRows(selectedRows)
                  }
                  selectableRowSelected={isRowSelected}
                  selectableRowsNoSelectAll={false}
                  customStyles={customStyles}
                  noDataComponent={
                    <div className="text-danger text-center py-3">
                      Không có dữ liệu
                    </div>
                  }
                  subHeader
                  subHeaderComponent={
                    <div className="d-flex justify-content-end w-100">
                      <input
                        type="text"
                        placeholder="🔍 Tìm kiếm..."
                        className="form-control w-25"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        ) : nameType === "CTĐT" ? (
          <div className="table-responsive">
            <DataTable
              title="Danh sách chương trình đào tạo"
              columns={columnsCTDT}
              data={filteredDataCTDT}
              pagination
              highlightOnHover
              dense
              selectableRows
              selectableRowsHighlight
              onSelectedRowsChange={({ selectedRows }) =>
                setSelectedRows(selectedRows)
              }
              selectableRowsNoSelectAll={false}
              selectableRowSelected={isRowSelected}
              customStyles={customStyles}
              noDataComponent={
                <div className="text-danger text-center py-3">
                  Không có dữ liệu
                </div>
              }
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm..."
                  className="form-control w-25"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default UserPermissionPage;
