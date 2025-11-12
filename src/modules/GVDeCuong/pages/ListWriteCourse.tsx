import { WriteCourseAPI } from "../../../api/DVDC/WriteCourse";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import { useEffect, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
function ListWriteCourseDVDC() {
    const [listCourse, setListCourse] = useState<any[]>([]);
    const headers = [
        { label: "STT", key: "" },
        { label: "Mã học phần", key: "code_course" },
        { label: "Tên học phần", key: "name_course" },
        { label: "Nhóm học phần", key: "name_gr_course" },
        { label: "Thuộc khóa học", key: "name_key_year_semester" },
        { label: "Thuộc học kỳ", key: "name_semester" },
        { label: "Thuộc CTĐT", key: "name_program" },
        { label: "Kiểm tra học phần bắt buộc", key: "name" },
        { label: "Số giờ lý thuyết", key: "totalTheory" },
        { label: "Số giờ thực hành", key: "totalPractice" },
        { label: "Số tín chỉ", key: "credits" },
        { label: "Thời gian mở đề cương", key: "time_open" },
        { label: "Thời gian đóng đề cương", key: "time_close" },
        { label: "*", key: "*" },
    ];
    const GetListCourse = async () => {
        const res = await WriteCourseAPI.GetListCourse();
        if (res.success) {
            setListCourse(res.data);
            SweetAlert("success", res.message);
        } else {
            SweetAlert("error", res.message);
        }
    }
    useEffect(() => {
        GetListCourse();
    }, []);
    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Danh sách Đề cương được phân công
                        </h2>
                    </div>
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
                                {listCourse.length > 0 ? (
                                    listCourse.map((item, index) => (
                                        <tr key={item.id_civilSer}>
                                            <td className="formatSo">{index + 1}</td>
                                            <td>{item.code_course}</td>
                                            <td>{item.name_course}</td>
                                            <td>{item.name_gr_course}</td>
                                            <td>{item.name_key_year_semester}</td>
                                            <td>{item.name_semester}</td>
                                            <td>{item.name_program}</td>
                                            <td>{item.name}</td>
                                            <td className="formatSo">{item.totalTheory}</td>
                                            <td className="formatSo">{item.totalPractice}</td>
                                            <td className="formatSo">{item.credits}</td>
                                            <td className="formatSo" style={{ color: item.is_open === 1 ? "blue" : "red" }}>{unixTimestampToDate(item.time_open)}</td>
                                            <td className="formatSo" style={{ color: item.is_open === 1 ? "blue" : "red" }}>{unixTimestampToDate(item.time_close)}</td>
                                            <td className="formatSo">
                                                {item.is_open === 1 ? (
                                                    <button className="btn btn-light border-primary text-primary btn-sm">
                                                        <i className="fas fa-edit me-2 text-primary"></i> Viết đề cương
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-light border-primary text-primary btn-sm" disabled>
                                                        <i className="fas fa-edit me-2 text-primary"></i> Viết đề cương
                                                    </button>
                                                )}
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
                </div>
            </div>
        </div>
    );
}
export default ListWriteCourseDVDC;
