import { useEffect, useState } from "react";
import { ListCTDTPermissionAPI } from "../../../api/CTDT/ListCTDTPermissionAPI";
import { BrowseOutlineAPI } from "../../../api/CTDT/BrowseOutline";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
export default function     () {
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [allData, setAllData] = useState<any[]>([]);
    const [countSylabus, setCountSylabus] = useState<{
        count_cho_duyet: number | null;
        count_da_duyet: number | null;
        count_tra_ve_chinh_sua: number | null;
    }>({
        count_cho_duyet: null,
        count_da_duyet: null,
        count_tra_ve_chinh_sua: null,
    });
    interface FilterData {
        id_program: number | null;
        id_status: number | null;
    }
    const [formData, setFormData] = useState<FilterData>({
        id_program: null,
        id_status: null,
    });
    const headers = [
        { label: "STT", key: "" },
        { label: "Mã môn học", key: "code_course" },
        { label: "Tên môn học", key: "name_course" },
        { label: "Thuộc học kỳ", key: "semester" },
        { label: "Thuộc khóa học", key: "key_year" },
        { label: "Thuộc CTĐT", key: "program" },
        { label: "Mã giảng viên soạn đề cương", key: "code_civil" },
        { label: "Tên giảng viên soạn đề cương", key: "name_civil" },
        { label: "Email giảng viên soạn đề cương", key: "email_civil" },
        { label: "Ngày tạo đề cương", key: "time_cre" },
        { label: "Ngày nộp đề cương", key: "time_up" },
        { label: "Phiên bản đề cương", key: "version" },
        { label: "Trạng thái đề cương", key: "id_status" },
        { label: "*", key: "*" },
    ];
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    }
    const LoadListCTDTByDonVi = async () => {
        const res = await ListCTDTPermissionAPI.GetListCTDTPermission();
        setListCTDT(res);
        setFormData((prev) => ({ ...prev, id_program: 0 }));
    }
    const ShowData = async (override?: Partial<FilterData>) => {
        const payload = {
            id_program: Number(
                override?.id_program ?? formData.id_program ?? 0
            ),
            id_status: Number(
                override?.id_status ?? formData.id_status ?? 0
            ),
        };

        const res = await BrowseOutlineAPI.BrowseOutline(payload);
        if (res.success) {
            SweetAlert("success", res.message);
            setAllData(res.data);
            setCountSylabus({
                count_cho_duyet: res.count[0].dang_cho_duyet,
                count_da_duyet: res.count[0].hoan_thanh,
                count_tra_ve_chinh_sua: res.count[0].tra_de_cuong,
            });
        } else {
            SweetAlert("error", res.message);
            setAllData([]);
            setCountSylabus({
                count_cho_duyet: res.count[0].dang_cho_duyet,
                count_da_duyet: res.count[0].hoan_thanh,
                count_tra_ve_chinh_sua: res.count[0].tra_de_cuong,
            });
        }
    };
    const filteredData = allData.filter((item) => {
        const keyword = searchText.toLowerCase().trim();
        return item.code_course?.toLowerCase().includes(keyword) ||
            item.name_course?.toLowerCase().includes(keyword) ||
            item.semester?.toLowerCase().includes(keyword) ||
            item.key_year?.toLowerCase().includes(keyword) ||
            item.program?.toLowerCase().includes(keyword) ||
            item.code_civil?.toLowerCase().includes(keyword) ||
            item.name_civil?.toLowerCase().includes(keyword) ||
            item.email_civil?.toLowerCase().includes(keyword) ||
            item.version?.toLowerCase().includes(keyword);
    });
    const filterByStatus = (status: number) => {
        setFormData(prev => ({ ...prev, id_status: status }));
        ShowData({ id_status: status });
    };
    const handleResetFilter = () => {
        const resetData = { id_status: 0, id_program: 0 };

        setFormData(resetData);

        ShowData(resetData);
    };
    const handleShowSyllabus = (id_syllabus: number, status: string) => {
        window.open(`/ctdt/preview-syllabus/${id_syllabus}/${status}`, "_blank");
    }
    useEffect(() => {
        ShowData();
        LoadListCTDTByDonVi();
    }, []);
    useEffect(() => {
        const handleReload = (e: StorageEvent) => {
            if (e.key === "reload_syllabus_list") {
                ShowData(); 
            }
        };
        window.addEventListener("storage", handleReload);
        return () => window.removeEventListener("storage", handleReload);
    }, []);
    
    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Mục tiêu học phần
                        </h2>
                        <hr />
                        <fieldset className="ceo-panel">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo CTĐT</label>
                                    <select className="form-control  ceo-input" name="id_program" value={formData.id_program ?? ""} onChange={handleInputChange} >
                                        <option value="0">Tất cả</option>
                                        {listCTDT.map((item, index) => (
                                            <option key={index} value={item.value}>{item.text}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="ceo-label">Tìm kiếm</label>
                                    <input
                                        type="text"
                                        className="form-control ceo-input"
                                        placeholder="🔍 Từ khóa bất kỳ để tìm ..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-blue" onClick={handleResetFilter} >
                                        <i className="fas fa-plus-circle mr-1" /> Reset lại bộ lọc
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div
                                className="card h-100 shadow-sm"
                                style={{ borderRadius: "12px", cursor: "pointer" }}
                                onClick={() => filterByStatus(2)}
                            >
                                <div className="card-body text-center py-4">
                                    <h5 className="fw-bold text-success mb-2">
                                        <i className="fas fa-hourglass-half me-2"></i>
                                        Đề cương đang chờ duyệt
                                    </h5>
                                    <p className="display-6 fw-bold text-dark mb-0">
                                        {countSylabus.count_cho_duyet}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="card h-100 shadow-sm"
                                style={{ borderRadius: "12px", cursor: "pointer" }}
                                onClick={() => filterByStatus(3)}
                            >
                                <div className="card-body text-center py-4">
                                    <h5 className="fw-bold text-danger mb-2">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        Đề cương trả về chỉnh sửa
                                    </h5>
                                    <p className="display-6 fw-bold text-dark mb-0">
                                        {countSylabus.count_tra_ve_chinh_sua}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div
                                className="card h-100 shadow-sm"
                                style={{ borderRadius: "12px", cursor: "pointer" }}
                                onClick={() => filterByStatus(4)}
                            >
                                <div className="card-body text-center py-4">
                                    <h5 className="fw-bold text-primary mb-2">
                                        <i className="fas fa-check-circle me-2"></i>
                                        Đề cương đã duyệt
                                    </h5>
                                    <p className="display-6 fw-bold text-dark mb-0">
                                        {countSylabus.count_da_duyet}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <p className=" text-danger mt-3">Click vào từng trạng thái để lọc dữ liệu</p>
                    <hr />
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
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id_syllabus}>
                                            <td className="formatSo">{index + 1}</td>
                                            <td className="formatSo">{item.code_course}</td>
                                            <td className="formatSo">{item.name_course}</td>
                                            <td className="formatSo">{item.semester}</td>
                                            <td className="formatSo">{item.key_year}</td>
                                            <td className="formatSo">{item.program}</td>
                                            <td className="formatSo">{item.code_civil}</td>
                                            <td className="formatSo">{item.name_civil}</td>
                                            <td className="formatSo">{item.email_civil}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td className="formatSo">{item.version}</td>
                                            {item.id_status === 2 ? (
                                                <td className="formatSo"><span className="text-success">Đang chờ duyệt</span></td>
                                            ) : item.id_status === 3 ? (
                                                <td className="formatSo"><span className="text-danger">Trả đề cương về chỉnh sửa</span></td>
                                            ) : (
                                                <td className="formatSo"><span className="text-primary">Đã duyệt</span></td>
                                            )}
                                            {item.id_status === 2 ? (
                                                <td>
                                                    <button className="btn btn-sm btn-function-ceo" onClick={() => handleShowSyllabus(item.id_syllabus, "true")} >
                                                        ⚙️ Chức năng
                                                    </button>
                                                </td>
                                            ) : item.id_status === 3 ? (
                                                <td className="formatSo"><span className="text-danger">Trả đề cương về chỉnh sửa</span></td>
                                            ) : (
                                                <td>
                                                    <button className="btn btn-sm btn-function-ceo" onClick={() => handleShowSyllabus(item.id_syllabus, "false")} >
                                                        ⚙️ Xem đề cương hoàn chỉnh
                                                    </button>
                                                </td>
                                            )}

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
                </div>
            </div>
        </div>
    )
}