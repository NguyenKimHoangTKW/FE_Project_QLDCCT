import { WriteCourseAPI } from "../../../api/GVDeCuong/WriteCourse";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import { useEffect, useState } from "react";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
function ListWriteCourseDVDC() {
    const [listCourse, setListCourse] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [nameCourse, setNameCourse] = useState<string>("");
    const [is_write, setIs_write] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [countdown, setCountdown] = useState<string>("");
    const [showModalRequestWriteCourse, setShowModalRequestWriteCourse] = useState(false);
    const [listRequestWriteCourse, setListRequestWriteCourse] = useState<any[]>([]);
    const [showModalRefundSyllabus, setShowModalRefundSyllabus] = useState(false);
    const [returned_content, setReturned_content] = useState<string>("");
    const [showModalRequestEditSyllabus, setShowModalRequestEditSyllabus] = useState(false);
    const [contentRequestEditSyllabus, setContentRequestEditSyllabus] = useState<string>("");
    const [code_civilSer, setCode_civilSer] = useState<string>("");
    const [listTeacher, setListTeacher] = useState<{
        success?: boolean;
        data?: any[];
        message?: string;
        is_open?: number;
    }>({});
    interface FormData {
        id_syllabus: number | null;
        id_course: number | null;
        id_teacherbysubject: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id_syllabus: null,
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
    const handleCancelRequestEditSyllabus = async (id_syllabus: number) => {
        const confirm = await Swal.fire({
            title: "Xác nhận thu hồi yêu cầu mở chỉnh sửa đề cương sau duyệt?",
            text: "Sau khi thu hồi, yêu cầu mở chỉnh sửa đề cương sẽ bị hủy, bạn muốn tiếp tục?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, thu hồi ngay",
            cancelButtonText: "Hủy"
        });

        if (!confirm.isConfirmed) return;
        const res = await WriteCourseAPI.CancelRequestEditSyllabus({ id_syllabus: Number(id_syllabus) });
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
            setIs_write(res.is_write);
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
            setIs_write(res.is_write);
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
    const handleShowModalRequestEditSyllabus = async (id_syllabus: number) => {
        setShowModalRequestEditSyllabus(true);
        setFormData((prev) => ({ ...prev, id_syllabus: id_syllabus }));
    }
    const saveRequestEditSyllabus = async () => {
        const res = await WriteCourseAPI.RequestEditSyllabus({ id_syllabus: Number(formData.id_syllabus), edit_content: contentRequestEditSyllabus });
        if (res.success) {
            SweetAlert("success", res.message);
            setShowModalRequestEditSyllabus(false);
            getListTeacherbyWriteCourse(Number(formData.id_course));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const handleShowModalRequestWriteCourse = async (id_syllabus: number) => {
        setShowModalRequestWriteCourse(true);
        setFormData((prev) => ({ ...prev, id_syllabus: id_syllabus }));
        getListRequestWriteCourse(id_syllabus);
    }
    const handleRequestWriteCourse = async (id_syllabus: number) => {
        const res = await WriteCourseAPI.RequestWriteCourse({ id_syllabus: id_syllabus });
        if (res.success) {
            SweetAlert("success", res.message);
            getListTeacherbyWriteCourse(Number(formData.id_course));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const getListRequestWriteCourse = async (id_syllabus: number) => {
        const res = await WriteCourseAPI.ListRequestWriteCourse({ id_syllabus: id_syllabus });
        if (res.success) {
            setListRequestWriteCourse(res.data);
        } else {
            SweetAlert("error", res.message);
            setListRequestWriteCourse([]);
        }
    }
    const handleAcceptRequestWriteCourse = async (id_ApproveUserSyllabus: number) => {
        const res = await WriteCourseAPI.AcceptJoinWriteCourse({ id_ApproveUserSyllabus: Number(id_ApproveUserSyllabus) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListRequestWriteCourse(Number(formData.id_syllabus));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const handleRejectRequestWriteCourse = async (id_ApproveUserSyllabus: number) => {
        const res = await WriteCourseAPI.RejectJoinWriteCourse({ id_ApproveUserSyllabus: Number(id_ApproveUserSyllabus) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListRequestWriteCourse(Number(formData.id_syllabus));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const handleRemoveJoinWriteCourse = async (id_ApproveUserSyllabus: number) => {
        const confirm = await SweetAlertDel("Bạn có chắc muốn loại thành viên này khỏi danh sách yêu cầu viết đề cương?");
        if (!confirm) return;
        const res = await WriteCourseAPI.RemoveJoinWriteCourse({ id_ApproveUserSyllabus: Number(id_ApproveUserSyllabus) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListRequestWriteCourse(Number(formData.id_syllabus));
        } else {
            SweetAlert("error", res.message);
        }
    }
    const handleSearchRequestWriteCourse = async () => {
        const res = await WriteCourseAPI.SearchRequestWriteCourse({ code_civilSer: code_civilSer, id_syllabus: Number(formData.id_syllabus) });
        if (res.success) {
            SweetAlert("success", res.message);
            getListRequestWriteCourse(Number(formData.id_syllabus));
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
                                            <td>{item.name_isCourse}</td>
                                            <td className="formatSo">{item.totalTheory}</td>
                                            <td className="formatSo">{item.totalPractice}</td>
                                            <td className="formatSo">{item.credits}</td>
                                            <td
                                                style={{ color: item.is_open === 1 ? "blue" : "red" }}
                                            >
                                                {unixTimestampToDate(item.time_open)}
                                            </td>
                                            <td
                                                style={{ color: item.is_open === 1 ? "blue" : "red" }}
                                            >
                                                {unixTimestampToDate(item.time_close)}
                                            </td>
                                            <td className="formatSo">
                                                <button className="btn btn-ceo-blue border-primary text-primary btn-sm" onClick={() => handleViewDetail(item.id_course, item.id_teacherbysubject)}>
                                                    <i className="fas fa-edit me-2 text-white"></i> Xem chi tiết đề cương
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
                    <button type="button" className="btn btn-ceo-green" onClick={CreateTemplateWriteCourse} disabled={listTeacher.is_open === 0 || is_write === false}>
                        <i className="fas fa-plus me-2"></i>  Tạo mới mẫu soạn đề cương
                    </button>
                    {showButton && (
                        <button type="button" className="btn btn-ceo-red" onClick={HandleDestroyButton}>
                            <i className="fas fa-trash me-2"></i>
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

                                                    {listTeacher?.is_open === 1 && (
                                                        <>
                                                            {teacher?.is_approve_user ? (
                                                                <>
                                                                    {teacher.code_status === 1 && (
                                                                        <div>
                                                                            <button
                                                                                className="btn btn-sm btn-ceo-blue w-100 mb-2"
                                                                                onClick={() => handleViewDetailTemplateWriteCourse(teacher.id_syllabus)}
                                                                            >
                                                                                ✏️ Tiếp tục viết
                                                                            </button>
                                                                            {is_write === true ? (
                                                                                <>
                                                                                    <button
                                                                                        className="btn btn-sm btn-ceo-green w-100 mb-2"
                                                                                        onClick={() => handleShowModalRequestWriteCourse(teacher.id_syllabus)}
                                                                                    >
                                                                                        📄 Xem danh sách yêu cầu tham gia viết đề cương
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn btn-sm  btn-ceo-green w-100 mb-2"
                                                                                        onClick={() => handleInheritSyllabusTemplate(teacher.id_syllabus)}
                                                                                    >
                                                                                        📄 Kế thừa mẫu
                                                                                    </button>

                                                                                    <button
                                                                                        className="btn btn-sm btn-ceo-red w-100 mb-2"
                                                                                        onClick={() => handleDeleteSyllabus(teacher.id_syllabus)}
                                                                                    >
                                                                                        🗑️ Xóa mẫu
                                                                                    </button>
                                                                                </>
                                                                            ) : null}

                                                                        </div>
                                                                    )}

                                                                    {teacher.code_status === 2 && (
                                                                        <div>
                                                                            <button
                                                                                className="btn btn-sm btn-success w-100 mb-2"
                                                                                onClick={() => handleViewDetailTemplateWriteCourseFinal(teacher.id_syllabus)}
                                                                            >
                                                                                👁️ Xem bản đã nộp
                                                                            </button>

                                                                            {is_write === true ? (
                                                                                <>
                                                                                    <button
                                                                                        className="btn btn-sm btn-warning w-100 mb-2"
                                                                                        onClick={() => handleRollbackSyllabus(teacher.id_syllabus)}
                                                                                    >
                                                                                        🔄 Thu hồi đề cương
                                                                                    </button>
                                                                                </>
                                                                            ) : null}

                                                                        </div>
                                                                    )}

                                                                    {teacher.code_status === 3 && (
                                                                        <div>
                                                                            <button
                                                                                className="btn btn-sm btn-warning w-100 mb-2"
                                                                                onClick={() => handleViewDetailTemplateWriteCourse(teacher.id_syllabus)}
                                                                            >
                                                                                ✏️ Chỉnh sửa
                                                                            </button>

                                                                            <button
                                                                                className="btn btn-sm btn-danger w-100 mb-2"
                                                                                onClick={() => handleShowModalRefundSyllabus(teacher.id_syllabus)}
                                                                            >
                                                                                ❗ Xem lý do hoàn trả
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {teacher.code_status === 4 && (
                                                                        <div>
                                                                            <button
                                                                                className="btn btn-sm btn-success w-100 mb-2"
                                                                                onClick={() => handleViewDetailTemplateWriteCourseFinal(teacher.id_syllabus)}
                                                                            >
                                                                                👁️ Xem đề cương
                                                                            </button>
                                                                            {is_write === true ? (
                                                                                <>
                                                                                    {teacher.is_open_edit_final === 0 && (
                                                                                        <button
                                                                                            className="btn btn-sm btn-info text-white fw-bold w-100 mb-2"
                                                                                            onClick={() => handleShowModalRequestEditSyllabus(teacher.id_syllabus)}
                                                                                        >
                                                                                            ✉️ Gửi yêu cầu mở chỉnh sửa
                                                                                        </button>
                                                                                    )}

                                                                                    {teacher.is_open_edit_final === 1 && (
                                                                                        <>
                                                                                            <div className="alert alert-info py-1 px-2 mb-2" style={{ fontSize: "13px", borderRadius: "8px" }}>
                                                                                                <i className="fas fa-envelope-open-text me-2"></i>
                                                                                                Yêu cầu mở chỉnh sửa đã gửi, đang chờ duyệt
                                                                                            </div>

                                                                                            <button
                                                                                                className="btn btn-sm btn-danger text-white fw-bold w-100 mb-2"
                                                                                                onClick={() => handleCancelRequestEditSyllabus(teacher.id_syllabus)}
                                                                                            >
                                                                                                ✉️ Hủy yêu cầu
                                                                                            </button>
                                                                                        </>
                                                                                    )}

                                                                                    {teacher.is_open_edit_final === 2 && (
                                                                                        <>
                                                                                            <div className="alert alert-danger py-1 px-2 mb-2" style={{ fontSize: "13px", borderRadius: "8px" }}>
                                                                                                <i className="fas fa-times-circle me-2"></i>
                                                                                                Đã bị từ chối yêu cầu mở chỉnh sửa bổ sung
                                                                                            </div>

                                                                                            <button
                                                                                                className="btn btn-sm btn-danger text-white fw-bold w-100 mb-2"
                                                                                                onClick={() => handleShowModalRefundSyllabus(teacher.id_syllabus)}
                                                                                            >
                                                                                                ✉️ Xem lý do từ chối
                                                                                            </button>
                                                                                        </>
                                                                                    )}
                                                                                </>
                                                                            ) : null}
                                                                            {showButton && (
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-primary w-100 mb-2"
                                                                                    onClick={() => SaveInheritSyllabusTemplate(teacher.id_syllabus)}
                                                                                >
                                                                                    📄 Chọn để kế thừa
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {teacher.code_status === 7 && (
                                                                        <div>
                                                                            <button
                                                                                className="btn btn-sm btn-primary w-100 mb-2"
                                                                                onClick={() => handleViewDetailTemplateWriteCourse(teacher.id_syllabus)}
                                                                            >
                                                                                ✏️ Chỉnh sửa bổ sung nội dung đã nộp sau duyệt
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                </>
                                                            ) : teacher?.is_approve_user === null ? (
                                                                <>
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-sm btn-ceo-blue w-100 mb-2"
                                                                            onClick={() => handleRequestWriteCourse(teacher.id_syllabus)}
                                                                        >
                                                                            <i className="fas fa-paper-plane me-2"></i> Gửi yêu cầu tham gia viết đề cương này
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="alert alert-warning py-1 px-2 mb-2" style={{ fontSize: "13px", borderRadius: "8px" }}>
                                                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                                                        Đã gửi yêu cầu tham gia viết đề cương này, đang chờ duyệt
                                                                    </div>
                                                                </>
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
                isOpen={showModalRequestWriteCourse}
                title="Danh sách yêu cầu tham gia viết đề cương"
                onClose={() => setShowModalRequestWriteCourse(false)}
            >
                <>
                    <div className="table-responsive">
                        <h5 className="text-center text-uppercase font-size-20">Nhập mã giảng viên vào ô để phân quyền vào đề cương môn học này</h5>
                        <hr />
                        <div className="form-group row">
                            <label className="ceo-label col-sm-2 col-form-label">Mã cán bộ</label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    name="code_civilSer"
                                    value={code_civilSer}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode_civilSer(e.target.value)}
                                    className="form-control ceo-input"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <button className="btn btn-ceo-blue" onClick={handleSearchRequestWriteCourse}>Kiểm tra và phân quyền</button>
                        <hr />
                        
                        {listRequestWriteCourse.length > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã giảng viên</th>
                                        <th>Tên giảng viên</th>
                                        <th>Email</th>
                                        <th>Thuộc CTĐT</th>
                                        <th>Trạng thái</th>
                                        <th>Thời gian nhận yêu cầu</th>
                                        <th>Thời gian duyệt yêu cầu</th>
                                        <th>*</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listRequestWriteCourse.map((item, index) => (
                                        <tr key={item.id_ApproveUserSyllabus}>
                                            <td>{index + 1}</td>
                                            <td>{item.code_civil}</td>
                                            <td>{item.name_civil}</td>
                                            <td>{item.email}</td>
                                            <td>{item.name_program}</td>
                                            {item.is_approve === true && item.is_refuse === false ? (
                                                <td><span className="badge badge-pill badge-success">Đã duyệt</span></td>
                                            ) : item.is_approve === false && item.is_refuse === false ? (
                                                <td><span className="badge badge-pill badge-warning">Chờ duyệt</span></td>
                                            ) : item.is_refuse === true && item.is_approve === false ? (
                                                <td><span className="badge badge-pill badge-danger">Từ chối</span></td>
                                            ) : null}
                                            <td className="formatSo">{unixTimestampToDate(item.time_request)}</td>
                                            <td className="formatSo">{item.time_accept_request === null ? "" : unixTimestampToDate(item.time_accept_request)}</td>
                                            <td data-label="*" className="formatSo">
                                                <div className="d-flex justify-content-center flex-wrap gap-3">
                                                    {item.is_approve === false && item.is_refuse === false ? (
                                                        <>
                                                            <button className="btn btn-success btn-tone m-r-5" onClick={() => handleAcceptRequestWriteCourse(item.id_ApproveUserSyllabus)}>
                                                                <i className="anticon anticon-edit me-1" /> Duyệt yêu cầu
                                                            </button>
                                                            <button className="btn btn-danger btn-tone m-r-5" onClick={() => handleRejectRequestWriteCourse(item.id_ApproveUserSyllabus)}>
                                                                <i className="anticon anticon-delete me-1" /> Từ chối yêu cầu
                                                            </button>
                                                        </>
                                                    ) : item.is_approve === true && item.is_refuse === false ? (
                                                        <>
                                                            <button className="btn btn-danger btn-tone m-r-5" onClick={() => handleRemoveJoinWriteCourse(item.id_ApproveUserSyllabus)}>
                                                                <i className="anticon anticon-delete me-1" /> Loại khỏi danh sách
                                                            </button>
                                                        </>
                                                    ) : item.is_approve === false && item.is_refuse === true ? (
                                                        <>
                                                            <button className="btn btn-success btn-tone m-r-5" onClick={() => handleAcceptRequestWriteCourse(item.id_ApproveUserSyllabus)}>
                                                                <i className="anticon anticon-edit me-1" /> Mở duyệt lại
                                                            </button>
                                                            <hr />
                                                            <div className="alert alert-danger py-1 px-2 mb-2" style={{ fontSize: "13px", borderRadius: "8px" }}>
                                                                <i className="fas fa-times-circle me-2"></i>
                                                                Đã bị từ chối yêu cầu tham gia viết đề cương
                                                            </div>
                                                        </>
                                                    ) : null}

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="alert alert-info" style={{ textAlign: "center", marginTop: "20px" }}>
                                Không có yêu cầu tham gia viết đề cương
                            </div>
                        )}
                    </div>
                </>
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
            <Modal
                isOpen={showModalRequestEditSyllabus}
                title="Gửi yêu cầu mở chỉnh sửa đề cương"
                onClose={() => setShowModalRequestEditSyllabus(false)}
            >
                <div>
                    <label className="form-label ceo-label">Ghi rõ nội dung yêu cầu mở chỉnh sửa đề cương</label>
                    <Editor
                        initialValue={`<p><br/></p>`}
                        init={{
                            height: 400,
                            menubar: "file edit view insert format tools table help",
                            plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "table",
                                "help",
                                "wordcount",
                            ],

                            toolbar:
                                "undo redo | styles fontfamily fontsize | " +
                                "bold italic underline forecolor backcolor | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | " +
                                "table tabledelete | tableprops tablecellprops tablerowprops | " +
                                "link image | " +
                                "preview code fullscreen",
                            extended_valid_elements:
                                "select[id|name|class|style],option[value|selected],table[style|class|border|cellpadding|cellspacing],tr,td[colspan|rowspan|style]",

                            valid_children:
                                "+table[tr],+tr[td],+td[select],+body[select]",
                            forced_root_block: "",
                            table_advtab: true,
                            table_default_attributes: { border: "1" },
                            table_default_styles: { width: "100%", borderCollapse: "collapse" },
                            font_family_formats:
                                "Arial=arial,helvetica,sans-serif;" +
                                "Times New Roman='Times New Roman',times,serif;" +
                                "Calibri=calibri,sans-serif;" +
                                "Tahoma=tahoma,sans-serif;" +
                                "Verdana=verdana,sans-serif;",
                            fontsize_formats: "10px 11px 12px 13px 14px 16px 18px 20px 24px 28px 32px",
                            paste_data_images: true,
                            skin: false,
                            content_css: false,
                            skin_ui_css: `
                  .tox-promotion,
                  .tox-statusbar__branding,
                  .tox-statusbar__right-container,
                  .tox-statusbar__help-text {
                    display: none !important;
                  }
                `,
                        }}
                        onChange={(e: any) => setContentRequestEditSyllabus(e.target.getContent())}
                    />
                </div>
                <button className="btn btn-sm btn-ceo-blue" onClick={saveRequestEditSyllabus}>Gửi yêu cầu</button>
                <button className="btn btn-sm btn-ceo-red" onClick={() => setShowModalRequestEditSyllabus(false)}>Hủy</button>
            </Modal>
        </div>
    );
}
export default ListWriteCourseDVDC;
