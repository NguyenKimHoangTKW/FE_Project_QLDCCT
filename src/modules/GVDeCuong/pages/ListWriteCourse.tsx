import { WriteCourseAPI } from "../../../api/GVDeCuong/WriteCourse";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { useEffect, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import Swal from "sweetalert2";
function ListWriteCourseDVDC() {
    const [listCourse, setListCourse] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [nameCourse, setNameCourse] = useState<string>("");
    const [showButton, setShowButton] = useState(false);
    const [countdown, setCountdown] = useState<string>("");
    const [showModalRefundSyllabus, setShowModalRefundSyllabus] = useState(false);
    const [returned_content, setReturned_content] = useState<string>("");
    const [listTeacher, setListTeacher] = useState<{
        success?: boolean;
        data?: any[];
        message?: string;
        is_open?: number;
    }>({});
    interface FormData {
        id_course: number | null;
        id_teacherbysubject: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id_course: null,
        id_teacherbysubject: null,
    });
    interface InheritSyllabusTemplate {
        id_syllabus1: number | null;
        id_syllabus2: number | null;
    }
    const [inheritSyllabusTemplate, setInheritSyllabusTemplate] = useState<InheritSyllabusTemplate>({
        id_syllabus1: null,
        id_syllabus2: null,
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
    const formatCountdown = (ms: number) => {
        if (ms <= 0) return "Hết hạn";

        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
    };
    const HandleDestroyButton = () => {
        setShowButton(false);
        setInheritSyllabusTemplate({ id_syllabus1: null, id_syllabus2: null });
    }
    const handleDeleteSyllabus = async (id_syllabus: number) => {
        const confirmDel = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa mẫu đề cương này và không thể khôi phục lại, bạn muốn tiếp tục?");
        if (confirmDel) {
            const res = await WriteCourseAPI.DeleteSyllabus({ id_syllabus: Number(id_syllabus) });
            if (res.success) {
                SweetAlert("success", res.message);
                getListTeacherbyWriteCourse(Number(formData.id_course));
            } else {
                SweetAlert("error", res.message);
            }
        }
    }
    const handleInheritSyllabusTemplate = (id_syllabus: number) => {
        if (listTeacher.data?.length <= 1) {
            SweetAlert("error", "Bạn không thể kế thừa mẫu đề cương vì chỉ có 1 giảng viên");
            return;
        }
        setShowButton(true);
        setInheritSyllabusTemplate({ id_syllabus1: id_syllabus, id_syllabus2: null });
    }

    const handleRollbackSyllabus = async (id_syllabus: number) => {

        const confirm = await Swal.fire({
            title: "Xác nhận thu hồi đề cương?",
            text: "Sau khi thu hồi, đề cương sẽ được thu hồi và bạn có thể chỉnh sửa lại, bạn muốn tiếp tục?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, thu hồi ngay",
            cancelButtonText: "Hủy"
        });

        if (!confirm.isConfirmed) return;
        const res = await WriteCourseAPI.RollbackSyllabus({ id_syllabus: Number(id_syllabus) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListTeacherbyWriteCourse(Number(formData.id_course));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const SaveInheritSyllabusTemplate = async (id_syllabus: number) => {
        const res = await WriteCourseAPI.InheritSyllabusTemplate({ id_syllabus1: Number(inheritSyllabusTemplate.id_syllabus1), id_syllabus2: Number(id_syllabus), id_course: Number(formData.id_course) });
        if (res.success) {
            SweetAlert("success", res.message);
            setShowButton(false);
        } else {
            SweetAlert("error", res.message);
        }
    }
    const handleViewDetail = async (id_course: number, id_teacherbysubject: number) => {
        setShowModal(true);
        getListTeacherbyWriteCourse(id_course);
        setFormData({ id_course: id_course, id_teacherbysubject: id_teacherbysubject });

    }
    const getListTeacherbyWriteCourse = async (id_course: number) => {
        setFormData((prev) => ({ ...prev, id_course: id_course }));
        const res = await WriteCourseAPI.GetListTeacherbyWriteCourse({ id_course });
        if (res.success) {
            setListTeacher({
                success: true,
                data: res.data,
                message: res.message,
                is_open: res.data[0].is_open,
            });
            setNameCourse(res.name_course);

            const closeTime = res.data[0].time_close * 1000;

            if (window.countdownInterval) clearInterval(window.countdownInterval);

            window.countdownInterval = setInterval(() => {
                const now = Date.now();
                const diff = closeTime - now;
                setCountdown(formatCountdown(diff));
            }, 1000);
        } else {
            setListTeacher({
                success: false,
                data: [],
                message: res.message,
            });
            setNameCourse(res.name_course);
            const closeTime = res.data.time_close * 1000;

            if (window.countdownInterval) clearInterval(window.countdownInterval);

            window.countdownInterval = setInterval(() => {
                const now = Date.now();
                const diff = closeTime - now;
                setCountdown(formatCountdown(diff));
            }, 1000);
        }
    };

    useEffect(() => {
        if (!showModal) {
            if (window.countdownInterval) clearInterval(window.countdownInterval);
        }
    }, [showModal]);

    const CreateTemplateWriteCourse = async () => {
        const res = await WriteCourseAPI.CreateTemplateWriteCourse({ id_teacherbysubject: Number(formData.id_teacherbysubject) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListTeacherbyWriteCourse(Number(formData.id_course));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const handleViewDetailTemplateWriteCourse = async (id_syllabus: number) => {
        const url = `/gv-de-cuong/xem-truc-tuyen-mau-de-cuong/${id_syllabus}`;
        window.open(url, "_blank");
    }
    const handleViewDetailTemplateWriteCourseFinal = (id_syllabus: number) => {
        const url = `/gv-de-cuong/xem-truc-tuyen-mau-de-cuong-preview/${id_syllabus}`;
        window.open(url, "_blank");
    };
    const handleShowModalRefundSyllabus = async (id_syllabus: number) => {
        setShowModalRefundSyllabus(true);
        const res = await WriteCourseAPI.RefundSyllabus({ id_syllabus: Number(id_syllabus) });
        if (res.success) {
            SweetAlert("success", "Tải nội dung thành công!");
            setReturned_content(res.data);
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
                            Danh sách Đề cương được phân công soạn
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
                title={`Xem chi tiết đề cương cho môn học ${nameCourse}`}
                onClose={() => setShowModal(false)}
            >
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={CreateTemplateWriteCourse} disabled={listTeacher.is_open === 0}>
                        Tạo mới mẫu soạn đề cương
                    </button>
                    {showButton && (
                        <button type="button" className="btn btn-danger" onClick={HandleDestroyButton}>
                            <i className="fas fa-times me-2"></i>
                            Hủy chức năng kế thừa mẫu đề cương
                        </button>
                    )}
                </div>
                <hr />
                <div className="table-responsive">
                    {listTeacher.is_open === 1 && (
                        <div className="alert alert-info" style={{ textAlign: "center", marginTop: "20px" }}>
                            Đề cương đang được mở.
                            <br />
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                Thời gian còn lại:  <span style={{ color: "red" }}>{countdown}</span>
                            </span>
                        </div>
                    )}
                    {listTeacher.is_open === 0 && (
                        <>
                            {listTeacher.data && listTeacher.data?.length > 0 && (
                                <div className="alert alert-danger" style={{ textAlign: "center", marginTop: "20px" }}>
                                    Ngoài thời gian thực hiện đề cương, chỉ được xem nội dung
                                </div>
                            )}
                        </>
                    )}
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
                                                <div className="btn-group d-flex flex-wrap" style={{ gap: "8px" }}>

                                                    {listTeacher.is_open === 0 && (
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                                                            title="Xem nội dung đề cương"
                                                            onClick={() => handleViewDetailTemplateWriteCourseFinal(teacher.id_syllabus)}
                                                        >
                                                            <i className="fas fa-eye me-2"></i>
                                                            Xem nội dung
                                                        </button>
                                                    )}

                                                    {listTeacher.is_open === 1 && (
                                                        <>
                                                            {teacher.code_status === 1 && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-primary d-flex align-items-center"
                                                                        title="Tiếp tục viết đề cương"
                                                                        onClick={() => handleViewDetailTemplateWriteCourse(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-pen me-2"></i>
                                                                        Tiếp tục viết
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                                        title="Kế thừa Mẫu đề cương"
                                                                        onClick={() => handleInheritSyllabusTemplate(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-file-import me-2"></i>
                                                                        Kế thừa mẫu
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                                                        title="Kế thừa Mẫu đề cương"
                                                                        onClick={() => handleDeleteSyllabus(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-file-import me-2"></i>
                                                                        Xóa mẫu
                                                                    </button>
                                                                </>
                                                            )}

                                                            {teacher.code_status === 2 && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-success d-flex align-items-center"
                                                                        title="Xem đề cương chi tiết"
                                                                        onClick={() => handleViewDetailTemplateWriteCourseFinal(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-eye me-2"></i>
                                                                        Xem
                                                                    </button>

                                                                    <button
                                                                        className="btn btn-sm btn-warning d-flex align-items-center"
                                                                        title="Chỉnh sửa đề cương"
                                                                        onClick={() => handleRollbackSyllabus(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-edit me-2"></i>
                                                                        Thu hồi đề cương 
                                                                    </button>
                                                                </>
                                                            )}

                                                            {teacher.code_status === 3 && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-warning d-flex align-items-center"
                                                                        title="Chỉnh sửa đề cương"
                                                                        onClick={() => handleViewDetailTemplateWriteCourse(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-edit me-2"></i>
                                                                        Chỉnh sửa
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-ceo-red"
                                                                        title="Hoàn trả đề cương"
                                                                        onClick={() => handleShowModalRefundSyllabus(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-edit me-2"></i>
                                                                        Xem lý do hoàn trả
                                                                    </button>
                                                                </>

                                                            )}

                                                            {teacher.code_status === 4 && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-success d-flex align-items-center"
                                                                        title="Xem đề cương"
                                                                        onClick={() => handleViewDetailTemplateWriteCourseFinal(teacher.id_syllabus)}
                                                                    >
                                                                        <i className="fas fa-eye me-2"></i>
                                                                        Xem
                                                                    </button>

                                                                    {showButton && (
                                                                        <button
                                                                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                                                            title="Kế thừa mẫu đề cương"
                                                                            onClick={() => SaveInheritSyllabusTemplate(teacher.id_syllabus)}
                                                                        >
                                                                            <i className="fas fa-file-import me-2"></i>
                                                                            Chọn để kế thừa
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}

                                                            {!([1, 2, 3, 4].includes(teacher.code_status)) && (
                                                                <span className="badge bg-secondary px-3 py-2">
                                                                    {teacher.status}
                                                                </span>
                                                            )}
                                                        </>
                                                    )}

                                                </div>
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
                            <br />
                            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                Thời gian còn lại:  <span style={{ color: "red" }}>{countdown}</span>
                            </span>
                        </div>
                    )}
                </div>

            </Modal>
            <Modal
                isOpen={showModalRefundSyllabus}
                title="📌 Lý do hoàn trả đề cương"
                onClose={() => setShowModalRefundSyllabus(false)}
            >
                <div
                    style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "16px",
                        maxHeight: "400px",
                        overflowY: "auto",
                    }}
                >
                    {returned_content ? (
                        <div
                            className="preview-html"
                            dangerouslySetInnerHTML={{ __html: returned_content }}
                            style={{
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#1e293b",
                            }}
                        />
                    ) : (
                        <p className="text-muted fst-italic text-center">
                            (Không có nội dung hoàn trả)
                        </p>
                    )}
                </div>
            </Modal>

        </div>
    );
}
export default ListWriteCourseDVDC;
