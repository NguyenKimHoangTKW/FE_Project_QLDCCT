import { useEffect, useRef, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { GroupCourseAPI } from "../../../api/Admin/GroupCourse";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";

function GroupCourseInterface() {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [showModal, setShowModal] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const dataToShow = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const didFetch = useRef(false);
  interface GroupCourseInput {
    id_gr_course: number | null;
    name_gr_course: string;
  }
  const defaultFormData: GroupCourseInput = {
    id_gr_course: null,
    name_gr_course: "",
  };
  const [formData, setFormData] = useState<GroupCourseInput>({
    name_gr_course: "",
  });
  const headers = [
    { label: "STT", key: "" },
    { label: "ID nhóm môn học", key: "id_gr_course" },
    { label: "Tên nhóm môn học", key: "name_gr_course" },
    { label: "Ngày tạo", key: "time_cre" },
    { label: "Cập nhật lần cuối", key: "time_up" },
    { label: "*", key: "*" },
  ];
  const handleAdd = async () => {
    setShowModal(true);
    setModalMode("create");
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
  const handleInputChange = async (
    e: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const ShowData = async () => {
    const res = await GroupCourseAPI.GetListGroupCourse({ page, pageSize });
    if (res.success) {
      setAllData(res.data);
      setFilteredData(res.data);
    } else {
      setAllData([]);
      setFilteredData([]);
    }
  };
  const handleEdit = async (id: number) => {
    const res = await GroupCourseAPI.InfoGroupCourse({
      id_gr_course: id,
    });
    setShowModal(true);
    setModalMode("edit");
    setFormData({
      id_gr_course: res.id_gr_course,
      name_gr_course: res.name_gr_course,
    });
  };
  const handleSave = async () => {
    if (modalMode === "create") {
      const res = await GroupCourseAPI.AddGroupCourse({
        name_gr_course: formData.name_gr_course,
      });
      if (res.success) {
        ShowData();
        SweetAlert("success", res.message);
      } else {
        SweetAlert("error", res.message);
      }
    } else {
      const res = await GroupCourseAPI.UpdateGroupCourse({
        id_gr_course: formData.id_gr_course,
        name_gr_course: formData.name_gr_course,
      });
      if (res.success) {
        SweetAlert("success", res.message);
        setFormData(defaultFormData);
        setShowModal(false);
        ShowData();
      } else {
        SweetAlert("error", res.message);
      }
    }
  };
  const handleDelete = async (id: number) => {
    const confirmDel = await SweetAlertDel(
      "Bằng việc đồng ý, bạn sẽ xóa Nhóm học phần này và những dữ liệu liên quan, bạn muốn tiếp tục?"
    );
    if (confirmDel) {
      const res = await GroupCourseAPI.DeleteGroupCourse({
        id_gr_course: id,
      });
      if (res.success) {
        SweetAlert("success", res.message);
        ShowData();
      } else {
        SweetAlert("errorr", res.message);
      }
    }
  };
  useEffect(() => {
    if (!didFetch.current) {
      ShowData();
      didFetch.current = true;
    }
  }, []);
  return (
    <div className="main-content">
      <div className="card">
        <div className="card-body">
          <div className="page-header no-gutters">
            <h2 className="text-uppercase">Quản lý Danh sách Nhóm học phần</h2>
            <hr />
            <fieldset className="border rounded-3 p-3">
              <legend className="float-none w-auto px-3">Chức năng</legend>
              <div className="row">
                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                  <button className="btn btn-success" onClick={handleAdd}>
                    <i className="fas fa-plus-circle mr-1" /> Thêm mới
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
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
                    <tr key={item.id_gr_course}>
                      <td className="formatSo">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="formatSo">{item.id_gr_course}</td>
                      <td className="formatSo">{item.name_gr_course}</td>
                      <td className="formatSo">
                        {unixTimestampToDate(item.time_cre)}
                      </td>
                      <td className="formatSo">
                        {unixTimestampToDate(item.time_up)}
                      </td>
                      <td>
                        <button
                          className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                          onClick={() => handleEdit(item.id_gr_course)}
                        >
                          <i className="anticon anticon-edit" />
                        </button>
                        <button
                          className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"
                          onClick={() => handleDelete(item.id_gr_course)}
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
            ? "Thêm mới Nhóm học phần"
            : "Cập nhật Nhóm học phần"
        }
        onClose={() => {
          setShowModal(false);
          setFormData(defaultFormData);
        }}
        onSave={handleSave}
      >
        <form id="modal-body">
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Mã cán bộ</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="name_gr_course"
                value={formData.name_gr_course || ""}
                className="form-control"
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
export default GroupCourseInterface;
