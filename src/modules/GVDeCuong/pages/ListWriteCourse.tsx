import { WriteCourseAPI } from "../../../api/GVDeCuong/WriteCourse";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import { useEffect, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
function ListWriteCourseDVDC() {
    const [listCourse, setListCourse] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [listTeacher, setListTeacher] = useState<{
        success?: boolean;
        data?: any[];
        message?: string;
    }>({});

    interface FormData {
        id_course: number | null;
        id_teacherbysubject: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id_course: null,
        id_teacherbysubject: null,
    });
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
    const headersTeacher = [
        { label: "STT", key: "" },
        { label: "Mã giảng viên", key: "name" },
        { label: "Tên giảng viên", key: "email" },
        { label: "Thuộc CTĐT", key: "name_program" },
        { label: "Email", key: "email" },
        { label: "Trạng thái đề cượng", key: "status" },
        { label: "Phiên bản đề cương", key: "version" },
        { label: "*", key: "*" },
    ];
    const GetListCourse = async () => {
        const res = await WriteCourseAPI.GetListCourse();
        if (res.success) {
            setListCourse(res.data);
            SweetAlert("success", res.message);
        }
    }
    const handleViewDetail = async (id_course: number, id_teacherbysubject: number) => {
        setShowModal(true);
        getListTeacherbyWriteCourse(id_course);
        setFormData({ id_course: id_course, id_teacherbysubject: id_teacherbysubject });

    }
    const getListTeacherbyWriteCourse = async (id_course: number) => {
        const res = await WriteCourseAPI.GetListTeacherbyWriteCourse({ id_course });
        if (res.success) {
            setListTeacher({
                success: true,
                data: res.data,
                message: res.message,
            });
        } else {
            setListTeacher({
                success: false,
                data: [],
                message: res.message,
            });
        }
    };

    const CreateTemplateWriteCourse = async () => {
        const res = await WriteCourseAPI.CreateTemplateWriteCourse({ id_teacherbysubject: Number(formData.id_teacherbysubject) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListTeacherbyWriteCourse(Number(formData.id_course));
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
                        {listCourse.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        {headers.map((h, idx) => (
                                            <th key={idx}>{h.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listCourse.map((item, index) => (
                                        <tr key={item.id_teacherbysubject}>
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
                                            <td
                                                className="formatSo"
                                                style={{ color: item.is_open === 1 ? "blue" : "red" }}
                                            >
                                                {unixTimestampToDate(item.time_open)}
                                            </td>
                                            <td
                                                className="formatSo"
                                                style={{ color: item.is_open === 1 ? "blue" : "red" }}
                                            >
                                                {unixTimestampToDate(item.time_close)}
                                            </td>
                                            <td className="formatSo">
                                                <button className="btn btn-light border-primary text-primary btn-sm" onClick={() => handleViewDetail(item.id_course, item.id_teacherbysubject)}>
                                                    <i className="fas fa-edit me-2 text-primary"></i> Xem chi tiết đề cương
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div
                                className="alert alert-info"
                                style={{ textAlign: "center", marginTop: "20px" }}
                            >
                                Bạn chưa có học phần được phân để viết đề cương.
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                title="Xem chi tiết đề cương"
                onClose={() => setShowModal(false)}
            >
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={CreateTemplateWriteCourse}>
                        Tạo mới mẫu soạn đề cương
                    </button>
                </div>
                <hr />
                <div className="table-responsive">
                    {listTeacher.success ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {headersTeacher.map((h, idx) => (
                                        <th key={idx}>{h.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {listTeacher.data?.map((teacher: any, index: number) =>
                                    teacher.civilServants.map((item: any, subIndex: number) => (
                                        <tr key={`${teacher.value}-${subIndex}`}>
                                            <td className="formatSo">{index + 1}</td>
                                            <td>{item.code_civilSer}</td>
                                            <td>{item.fullname_civilSer}</td>
                                            <td>{item.name_program}</td>
                                            <td>{item.email}</td>
                                            <td className="formatSo">
                                                {teacher.code_status === 1 ? (
                                                    <span className="badge badge-pill badge-warning">{teacher.status}</span>
                                                ) : teacher.code_status === 2 ? (
                                                    <span className="badge badge-pill badge-info">{teacher.status}</span>
                                                ) : teacher.code_status === 3 ? (
                                                    <span className="badge badge-pill badge-danger">{teacher.status}</span>
                                                ) : teacher.code_status === 4 ? (
                                                    <span className="badge badge-pill badge-success">{teacher.status}</span>
                                                ) : (
                                                    <span className="badge badge-pill badge-secondary">{teacher.status}</span>
                                                )}
                                            </td>
                                            <td className="formatSo">{teacher.version}</td>
                                            <td>
                                                {teacher.code_status === 1 ? (
                                                    <button className="btn btn-light border-primary text-primary btn-sm" >
                                                        <i className="fas fa-edit me-2 text-primary"></i> Tiếp tục viết đề cương
                                                    </button>
                                                ) : teacher.code_status === 2 ? (
                                                    <button className="btn btn-light border-primary text-primary btn-sm" disabled>
                                                        <i className="fas fa-edit me-2 text-primary"></i> Tiếp tục viết đề cương
                                                    </button>
                                                ) : teacher.code_status === 3 ? (
                                                    <button className="btn btn-light border-primary text-primary btn-sm">
                                                        <i className="fas fa-edit me-2 text-primary"></i> Tiếp tục viết đề cương
                                                    </button>
                                                ) : teacher.code_status === 4 ? (
                                                    <button className="btn btn-light border-primary text-primary btn-sm">
                                                        <i className="fas fa-edit me-2 text-primary"></i> Xem đề cương
                                                    </button>
                                                ) : (
                                                    <span className="badge badge-pill badge-secondary">{teacher.status}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div
                            className="alert alert-info"
                            style={{ textAlign: "center", marginTop: "20px" }}
                        >
                            {listTeacher.message}
                        </div>
                    )}
                </div>

            </Modal>
        </div>
    );
}
export default ListWriteCourseDVDC;
