import { useState } from "react"
import { unixTimestampToDate } from "../../../../URL_Config";

function FacultyInterface() {
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [filteredData, setFilteredData] = useState([]);
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
        { label: "*", key: "*" }
    ];
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
                            Quản lý Danh sách Đơn vị
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo năm</label>
                                    <select>

                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-success">
                                        <i className="fas fa-plus-circle mr-1" /> Thêm mới
                                    </button>
                                    <button className="btn btn-primary" >
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

                            </thead>
                            <tbody>
                                {dataToShow.length > 0 ? (
                                    dataToShow.map((item, index) => (
                                        <tr key={item.id_civilSer}>
                                            <td className="formatSo">{(page - 1) * pageSize + index + 1}</td>
                                            <td className="formatSo">{item.id_civilSer}</td>
                                            <td className="formatSo">{item.code_civilSer}</td>
                                            <td>{item.fullname_civilSer}</td>
                                            <td>{item.email}</td>
                                            <td>{item.birthday}</td>
                                            <td>{item.name_year}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"

                                                >
                                                    <i className="anticon anticon-edit" />
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-hover btn-sm btn-rounded pull-right"

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
                                            className="text-center text-danger">
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
        </div>
    )
}