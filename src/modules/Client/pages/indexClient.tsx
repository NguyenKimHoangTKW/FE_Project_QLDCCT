import { useState } from "react";
import { ViewSyllabusAPI } from "../../../api/Clients/ViewSyllabus";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import Loading from "../../../components/ui/Loading";
import Modal from "../../../components/ui/Modal";
import html2pdf from "html2pdf.js";
import { URL_USER } from "../../../URL_Config";
export default function IndexClient() {
    const [loading, setLoading] = useState(false);
    const [mssv, setMssv] = useState("");
    const [listSyllabus, setListSyllabus] = useState<any[]>([]);
    const [pdfSyllabus, setPdfSyllabus] = useState<string>("");
    const [showModalPreviewSyllabus, setShowModalPreviewSyllabus] = useState(false);
    const GetListCourseByKeyYear = async () => {
        setLoading(true);
        try {
            const res = await ViewSyllabusAPI.GetListSyllabus({ mssv: mssv });
            if (res.success) {
                setListSyllabus(res.data);
                SweetAlert("success", res.message);
            }
            else {
                setListSyllabus([]);
                SweetAlert("error", res.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const handleSearch = () => {
        GetListCourseByKeyYear();
    }

    const handlePreviewSyllabus = async (id_course: number) => {
        const res = await fetch(`${URL_USER}/preview-de-cuong`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_course }),
        });

        if (!res.ok) {
            SweetAlert("error", "Không thể tải PDF");
            return;
        }

        const buffer = await res.arrayBuffer();
        const blob = new Blob([buffer], { type: "application/pdf" });
        const pdfURL = URL.createObjectURL(blob);

        window.open(pdfURL, "_blank"); // 👉 mở PDF tab mới
    };




    const handleDownloadPDF = async () => {
        const link = document.createElement("a");
        link.href = pdfSyllabus;
        link.download = "DeCuongChiTiet.pdf";
        link.click();
    };

    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="card shadow-sm" style={{ borderRadius: "16px" }}>
                        <div className="card-body">

                            <div
                                className="d-flex flex-wrap justify-content-center gap-3"
                                style={{
                                    padding: "10px",
                                }}
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="🔍 Nhập MSSV..."
                                    value={mssv}
                                    onChange={(e) => setMssv(e.target.value)}
                                    style={{
                                        maxWidth: "350px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                    }}
                                />

                                <button
                                    className="btn"
                                    style={{
                                        background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                                        color: "#fff",
                                        height: "48px",
                                        padding: "0 24px",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                                        transition: "0.2s",
                                    }}
                                    onClick={handleSearch}
                                >
                                    🔎 Xem đề cương
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-4">
                        {listSyllabus.length > 0 ? (
                            <>
                                <div className="table-responsive mt-3">
                                    <table className="table table-bordered table-rounded">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "8%" }}>Mã môn học</th>
                                                <th style={{ width: "25%" }}>Tên môn học</th>
                                                <th style={{ width: "15%" }}>Môn bắt buộc</th>
                                                <th style={{ width: "15%" }}>Nhóm học phần</th>
                                                <th style={{ width: "10%" }}>Lý thuyết</th>
                                                <th style={{ width: "10%" }}>Thực hành</th>
                                                <th style={{ width: "8%" }}>Tín chỉ</th>
                                                <th style={{ width: "10%" }}>Trạng thái</th>
                                                <th style={{ width: "10%" }}>Hành động</th>
                                            </tr>
                                        </thead>

                                        {Array.isArray(listSyllabus) && listSyllabus.length > 0 ? (
                                            listSyllabus.map((syllabus: any, sIdx: number) => (
                                                <tbody key={sIdx} style={{ color: "black" }}>
                                                    <tr className="table-secondary" >
                                                        <td colSpan={13} className="fw-bold text-start" style={{ backgroundColor: "#bfd1ec" }}>
                                                            {syllabus.name_se}
                                                        </td>
                                                    </tr>

                                                    {syllabus.course.length > 0 ? (
                                                        syllabus.course.map((course: any, cIdx: number) => (
                                                            <tr key={course.id_course} style={{ backgroundColor: "white" }}>
                                                                <td className="text-center">{course.code_course}</td>
                                                                <td>{course.name_course}</td>
                                                                <td className="text-center">{course.name_isCourse == "Bắt buộc" ? <span className="text-success">X</span> : <span className="text-danger">O</span>}</td>
                                                                <td >{course.name_gr_course}</td>
                                                                <td className="text-center">{course.totalTheory}</td>
                                                                <td className="text-center">{course.totalPractice}</td>
                                                                <td className="text-center">{course.credits}</td>
                                                                <td>{course.is_syllabus == true ? <span className="text-success">Đã có đề cương</span> : <span className="text-danger">Chưa có đề cương</span>}</td>
                                                                {course.is_syllabus == true ? (
                                                                    <td
                                                                        className="text-center"
                                                                        onClick={() => handlePreviewSyllabus(course.id_course)}
                                                                    >
                                                                        <i className="fas fa-list-ul" style={{ cursor: "pointer" }}></i>
                                                                    </td>

                                                                ) : (
                                                                    <>
                                                                        <td className="text-center">
                                                                            <i className="fas fa-list-ul"></i>
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={8} className="text-center text-muted">
                                                                Không có môn học trong học kỳ này
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            ))
                                        ) : (
                                            <tbody>
                                                <tr>
                                                    <td colSpan={8} className="text-center text-danger">
                                                        Chưa có dữ liệu học phần trong khóa học này
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="card-body text-center text-muted">
                                <p>Hãy nhập MSSV để xem danh sách đề cương…</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
