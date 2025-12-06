import { useEffect, useState } from "react";
import { ListCTDTPermissionAPI } from "../../../api/CTDT/ListCTDTPermissionAPI";
import { BrowseOutlineAPI } from "../../../api/CTDT/BrowseOutline";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import { unixTimestampToDate } from "../../../URL_Config";
import Modal from "../../../components/ui/Modal";
import { Editor } from "@tinymce/tinymce-react";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
export default function () {
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [allData, setAllData] = useState<any[]>([]);
    const [showPreviewRequestEditSyllabus, setShowPreviewRequestEditSyllabus] = useState(false);
    const [contentRequestEditSyllabus, setContentRequestEditSyllabus] = useState<string>("");
    const [showEditorReturnedContent, setShowEditorReturnedContent] = useState(false);
    const [returnedContent, setReturnedContent] = useState<string>("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [rawSearchText, setRawSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [countSylabus, setCountSylabus] = useState<{
        count_cho_duyet: number | null;
        count_da_duyet: number | null;
        count_tra_ve_chinh_sua: number | null;
        count_mo_de_cuong_sau_duyet: number | null;
        dang_mo_bo_sung_sau_duyet: number | null;
        tu_choi_mo_bo_sung_sau_duyet: number | null;
    }>({
        count_cho_duyet: null,
        count_da_duyet: null,
        count_tra_ve_chinh_sua: null,
        count_mo_de_cuong_sau_duyet: null,
        dang_mo_bo_sung_sau_duyet: null,
        tu_choi_mo_bo_sung_sau_duyet: null,
    });
    interface FilterData {
        id_program: number | null;
        id_status: number | null;
        is_open_edit_final: number | null;
        id_syllabus: number | null;
    }
    const [formData, setFormData] = useState<FilterData>({
        id_syllabus: null,
        id_program: null,
        id_status: null,
        is_open_edit_final: null,
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
        { label: "Ngày tạo đề cương", key: "time_cre" },
        { label: "Ngày nộp đề cương", key: "time_up" },
        { label: "Phiên bản đề cương", key: "version" },
        { label: "Trạng thái đề cương", key: "id_status" },
        { label: "*", key: "*" },
    ];
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        if (name === "id_program") {
            setFormData((prev) => ({ ...prev, id_program: Number(value) }));
        }
    }
    const LoadListCTDTByDonVi = async () => {
        const res = await ListCTDTPermissionAPI.GetListCTDTPermission();
        setListCTDT(res);
        setFormData((prev) => ({ ...prev, id_program: 0 }));
    }
    const ShowData = async (override?: Partial<FilterData>) => {
        const payload = {
            id_program: override?.id_program ?? formData.id_program ?? 0,
            id_status: override?.id_status ?? formData.id_status ?? 0,
            is_open_edit_final: override?.is_open_edit_final ?? formData.is_open_edit_final ?? 0,
            PageSize: pageSize,
            searchTerm: searchText,
            Page: page,
        };

        const res = await BrowseOutlineAPI.BrowseOutline(payload);
        if (res.success) {
            SweetAlert("success", "Tải dữ liệu thành công");
            setAllData(res.data);
            setCountSylabus({
                count_cho_duyet: res.count[0].dang_cho_duyet,
                count_da_duyet: res.count[0].hoan_thanh,
                count_tra_ve_chinh_sua: res.count[0].tra_de_cuong,
                count_mo_de_cuong_sau_duyet: res.count[0].mo_de_cuong_sau_duyet,
                dang_mo_bo_sung_sau_duyet: res.count[0].dang_mo_bo_sung_sau_duyet,
                tu_choi_mo_bo_sung_sau_duyet: res.count[0].tu_choi_mo_bo_sung,
            });
            setTotalRecords(Number(res.totalRecords) || 0);
            setTotalPages(Number(res.totalPages) || 1);
            setPageSize(Number(res.pageSize) || 10);
        } else {
            SweetAlert("error", "Tải dữ liệu thất bại");
            setAllData([]);
            setCountSylabus({
                count_cho_duyet: res.count[0].dang_cho_duyet,
                count_da_duyet: res.count[0].hoan_thanh,
                count_tra_ve_chinh_sua: res.count[0].tra_de_cuong,
                count_mo_de_cuong_sau_duyet: res.count[0].mo_de_cuong_sau_duyet,
                dang_mo_bo_sung_sau_duyet: res.count[0].dang_mo_bo_sung_sau_duyet,
                tu_choi_mo_bo_sung_sau_duyet: res.count[0].tu_choi_mo_bo_sung,
            });
            setTotalRecords(0);
            setTotalPages(1);
            setPageSize(10);
            setTotalRecords(0);
        }
    };
    const filterByStatus = (status: number) => {
        setFormData(prev => ({ ...prev, id_status: status }));
        ShowData({ id_program: Number(formData.id_program), id_status: status, is_open_edit_final: 0 });
    };
    const filterByOpenEditFinal = (open_edit_final: number) => {
        setFormData(prev => ({ ...prev, is_open_edit_final: open_edit_final }));
        ShowData({ id_status: 0, is_open_edit_final: open_edit_final });
    };
    const handleResetFilter = () => {
        const resetData = { id_program: Number(formData.id_program), id_status: 0, is_open_edit_final: 0, id_syllabus: null };

        setFormData(resetData);

        ShowData(resetData);
    };
    const handleShowSyllabus = (id_syllabus: number, status: string) => {
        window.open(`/ctdt/preview-syllabus/${id_syllabus}/${status}`, "_blank");
    }
    const handlePreviewRequestEditSyllabus = async (id_syllabus: number) => {
        setFormData(prev => ({ ...prev, id_syllabus: id_syllabus }));
        setShowPreviewRequestEditSyllabus(true);
        const res = await BrowseOutlineAPI.PreviewRequestEditSyllabus({ id_syllabus: Number(id_syllabus) });
        if (res.success) {
            setContentRequestEditSyllabus(res.data);
        }
    }
    const handleAcceptRequestEditSyllabus = async () => {
        const res = await BrowseOutlineAPI.AcceptRequestEditSyllabus({ id_syllabus: Number(formData.id_syllabus) });
        if (res.success) {
            SweetAlert("success", res.message);
            setShowEditorReturnedContent(false);
            ShowData({ id_status: 0, is_open_edit_final: 0 });
        }
    }
    const handleCancelRequestEditSyllabus = async () => {
        const res = await BrowseOutlineAPI.CancelRequestEditSyllabus({ id_syllabus: Number(formData.id_syllabus), returned_content: returnedContent });
        if (res.success) {
            SweetAlert("success", res.message);
            setShowEditorReturnedContent(false);
            ShowData({ id_status: 0, is_open_edit_final: 0 });
        }
    }
    const handleSwapButton = () => {
        setShowEditorReturnedContent(true);
    }
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchText(rawSearchText);
            setPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [rawSearchText]);
    useEffect(() => {

        LoadListCTDTByDonVi();
    }, []);
    useEffect(() => {
        ShowData();
    }, [page, pageSize, searchText]);
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
                            Quản lý Xét duyệt đề cương
                        </h2>
                        <hr />
                        <fieldset className="ceo-panel">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <CeoSelect2
                                        label="Lọc theo CTĐT"
                                        name="id_program"
                                        value={formData.id_program}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: 0, text: "Tất cả" },
                                            ...listCTDT.map(x => ({
                                                value: x.value,
                                                text: x.text
                                            }))
                                        ]}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className="row mt-4">
                                <div className="col-12 d-flex flex-wrap gap-3 justify-content-end">
                                    <button className="btn btn-ceo-green" onClick={() => ShowData()}>
                                        <i className="fas fa-plus-circle"></i> Lọc dữ liệu theo chương trình đào tạo
                                    </button>
                                    <button className="btn btn-ceo-blue" onClick={handleResetFilter}>
                                        <i className="fas fa-filter"></i> Reset lại bộ lọc
                                    </button>
                                </div>
                            </div>
                            <hr />
                            <div className="row g-3">

                                {/* Đang chờ duyệt */}
                                <div className="col-md-2 col-sm-4 col-6">
                                    <div
                                        className="compact-stat-card"
                                        style={{ color: "#0284c7" }}
                                        onClick={() => filterByStatus(2)}
                                    >
                                        <div className="compact-stat-icon" style={{ background: "#e0f2fe" }}>
                                            <i className="fas fa-hourglass-half"></i>
                                        </div>
                                        <div className="compact-stat-body">
                                            <span className="compact-stat-title">Chờ duyệt</span>
                                            <span className="compact-stat-value">{countSylabus.count_cho_duyet}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trả về chỉnh sửa */}
                                <div className="col-md-2 col-sm-4 col-6">
                                    <div
                                        className="compact-stat-card"
                                        style={{ color: "#dc2626" }}
                                        onClick={() => filterByStatus(3)}
                                    >
                                        <div className="compact-stat-icon" style={{ background: "#fee2e2" }}>
                                            <i className="fas fa-exclamation-circle"></i>
                                        </div>
                                        <div className="compact-stat-body">
                                            <span className="compact-stat-title">Trả về</span>
                                            <span className="compact-stat-value">{countSylabus.count_tra_ve_chinh_sua}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Đã duyệt */}
                                <div className="col-md-2 col-sm-4 col-6">
                                    <div
                                        className="compact-stat-card"
                                        style={{ color: "#059669" }}
                                        onClick={() => filterByStatus(4)}
                                    >
                                        <div className="compact-stat-icon" style={{ background: "#d1fae5" }}>
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                        <div className="compact-stat-body">
                                            <span className="compact-stat-title">Đã duyệt</span>
                                            <span className="compact-stat-value">{countSylabus.count_da_duyet}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Yêu cầu mở bổ sung */}
                                <div className="col-md-2 col-sm-4 col-6">
                                    <div
                                        className="compact-stat-card"
                                        style={{ color: "#b45309" }}
                                        onClick={() => filterByOpenEditFinal(1)}
                                    >
                                        <div className="compact-stat-icon" style={{ background: "#fef3c7" }}>
                                            <i className="fas fa-edit"></i>
                                        </div>
                                        <div className="compact-stat-body">
                                            <span className="compact-stat-title">Yêu cầu mở</span>
                                            <span className="compact-stat-value">{countSylabus.count_mo_de_cuong_sau_duyet}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Đang mở bổ sung */}
                                <div className="col-md-2 col-sm-4 col-6">
                                    <div
                                        className="compact-stat-card"
                                        style={{ color: "#4f46e5" }}
                                        onClick={() => filterByStatus(7)}
                                    >
                                        <div className="compact-stat-icon" style={{ background: "#e0e7ff" }}>
                                            <i className="fas fa-pen-square"></i>
                                        </div>
                                        <div className="compact-stat-body">
                                            <span className="compact-stat-title">Đang mở</span>
                                            <span className="compact-stat-value">{countSylabus.dang_mo_bo_sung_sau_duyet}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Từ chối mở */}
                                <div className="col-md-2 col-sm-4 col-6">
                                    <div
                                        className="compact-stat-card"
                                        style={{ color: "#7e22ce" }}
                                        onClick={() => filterByOpenEditFinal(2)}
                                    >
                                        <div className="compact-stat-icon" style={{ background: "#f3e8ff" }}>
                                            <i className="fas fa-times-circle"></i>
                                        </div>
                                        <div className="compact-stat-body">
                                            <span className="compact-stat-title">Từ chối mở</span>
                                            <span className="compact-stat-value">{countSylabus.tu_choi_mo_bo_sung_sau_duyet}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </fieldset>
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
                                {allData.length > 0 ? (
                                    allData.map((item, index) => (
                                        <tr key={item.id_syllabus}>
                                            <td data-label="STT" className="formatSo">{index + 1}</td>
                                            <td data-label="Mã môn học" className="formatSo">{item.code_course}</td>
                                            <td data-label="Tên môn học">{item.name_course}</td>
                                            <td data-label="Thuộc học kỳ">{item.semester}</td>
                                            <td data-label="Thuộc khóa học">{item.key_year}</td>
                                            <td data-label="Thuộc CTĐT" className="formatSo">{item.program}</td>
                                            <td data-label="Mã giảng viên soạn đề cương" className="formatSo">{item.code_civil}</td>
                                            <td data-label="Tên giảng viên soạn đề cương">{item.name_civil}</td>
                                            <td data-label="Ngày tạo đề cương" className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                            <td data-label="Ngày nộp đề cương" className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                            <td data-label="Phiên bản đề cương" className="formatSo">{item.version}</td>
                                            {item.id_status === 2 ? (
                                                <td><span className="text-success">Đang chờ duyệt</span></td>
                                            ) : item.id_status === 3 ? (
                                                <td ><span className="text-danger">Trả đề cương về chỉnh sửa</span></td>
                                            ) :
                                                item.id_status === 7 ? (
                                                    <td><span className="text-warning">Đang mở chỉnh sửa bổ sung sau duyệt</span></td>
                                                ) :
                                                    (

                                                        <>

                                                            <td className="formatSo">
                                                                <span className="text-primary">Đã duyệt</span>

                                                                {item.is_open_edit_final === 2 && (
                                                                    <>
                                                                        <hr />
                                                                        <div
                                                                            className="alert alert-danger py-1 px-2 mb-2"
                                                                            style={{ fontSize: "13px", borderRadius: "8px" }}
                                                                        >
                                                                            <i className="fas fa-times-circle me-2"></i>
                                                                            Đã bị từ chối yêu cầu mở chỉnh sửa bổ sung
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-sm btn-ceo-blue text-white fw-bold w-100 mb-2"
                                                                            onClick={() => handlePreviewRequestEditSyllabus(item.id_syllabus)}
                                                                        >
                                                                            ✉️ Mở lại chỉnh sửa bổ sung
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </td>

                                                        </>

                                                    )}
                                            <td>
                                                <div className="d-flex flex-column gap-2">

                                                    {item.id_status === 2 && (
                                                        <button
                                                            className="btn btn-sm btn-outline-primary w-100 text-start"
                                                            onClick={() => handleShowSyllabus(item.id_syllabus, "true")}
                                                            title="Xử lý đề cương đang chờ duyệt"
                                                        >
                                                            <i className="fas fa-cogs me-2"></i>
                                                            Chức năng duyệt
                                                        </button>
                                                    )}

                                                    {item.id_status === 3 && (
                                                        <span className="badge bg-danger p-2 w-100 text-wrap text-center">
                                                            <i className="fas fa-exclamation-circle me-2"></i>
                                                            Trả về chỉnh sửa
                                                        </span>
                                                    )}

                                                    {item.id_status === 4 && (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-outline-success w-100 text-start"
                                                                onClick={() => handleShowSyllabus(item.id_syllabus, "false")}
                                                                title="Xem đề cương đã duyệt hoàn chỉnh"
                                                            >
                                                                <i className="fas fa-check-circle me-2"></i>
                                                                Xem đề cương đã duyệt
                                                            </button>

                                                            {item.is_open_edit_final === 1 ? (
                                                                <button
                                                                    className="btn btn-sm btn-outline-warning w-100 text-start"
                                                                    onClick={() => handlePreviewRequestEditSyllabus(item.id_syllabus)}
                                                                    title="Xem nội dung yêu cầu mở chỉnh sửa bổ sung"
                                                                >
                                                                    <i className="fas fa-eye me-2"></i>
                                                                    Xem yêu cầu chỉnh sửa
                                                                </button>
                                                            ) : null}
                                                        </>
                                                    )}

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
                isOpen={showPreviewRequestEditSyllabus}
                onClose={() => {
                    setShowPreviewRequestEditSyllabus(false);
                    setShowEditorReturnedContent(false);
                }}
                title="Xem chi tiết nội dung đề cương đã yêu cầu mở chỉnh sửa bổ sung sau duyệt"
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
                    {showEditorReturnedContent == true ?
                        (
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
                                onChange={(e: any) => setReturnedContent(e.target.getContent())}
                            />

                        ) : null}
                    {contentRequestEditSyllabus ? (
                        <div
                            className="preview-html"
                            dangerouslySetInnerHTML={{ __html: contentRequestEditSyllabus }}
                            style={{
                                fontSize: "15px",
                                lineHeight: "1.6",
                                color: "#1e293b",
                            }}
                        />

                    ) : (
                        <p className="text-muted fst-italic text-center">
                            (Không có nội dung đề cương đã yêu cầu mở chỉnh sửa bổ sung sau duyệt)
                        </p>
                    )}
                </div>
                <hr />
                <div className="d-flex flex-wrap gap-3 justify-content-end">

                    {/* Duyệt yêu cầu */}
                    {showEditorReturnedContent === false ? (
                        <button
                            className="btn btn-sm btn-success px-3 py-2"
                            style={{ borderRadius: "10px", fontWeight: 600 }}
                            onClick={handleAcceptRequestEditSyllabus}
                        >
                            <i className="fas fa-check-circle me-2"></i>
                            Duyệt yêu cầu mở chỉnh sửa
                        </button>
                    ) : null}


                    {showEditorReturnedContent === true ? (
                        <button
                            className="btn btn-sm btn-warning px-3 py-2 text-dark"
                            style={{ borderRadius: "10px", fontWeight: 600 }}
                            onClick={handleCancelRequestEditSyllabus}
                        >
                            <i className="fas fa-paper-plane me-2"></i>
                            Gửi nội dung từ chối
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline-danger px-3 py-2"
                            style={{ borderRadius: "10px", fontWeight: 600 }}
                            onClick={handleSwapButton}
                        >
                            <i className="fas fa-times-circle me-2"></i>
                            Từ chối yêu cầu mở chỉnh sửa
                        </button>
                    )}

                </div>
            </Modal>
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
            <style>
                {`
                .stat-card {
    border-radius: 12px;
    transition: 0.2s ease-in-out;
    cursor: pointer;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.preview-html table {
    width: 100% !important;
    border-collapse: collapse !important;
    border: 1px solid #ccc !important;
}
.stat-card{
    transition: all .22s ease;
}

.stat-card:hover{
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 14px 28px rgba(0,0,0,.15) !important;
}

.stat-body {
    min-height:150px;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
}
    .compact-stat-card {
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 10px 12px !important;
    cursor: pointer;
    background: #ffffff;
    transition: all .2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
}

.compact-stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,.12);
}

.compact-stat-icon {
    font-size: 26px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.compact-stat-body {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.compact-stat-title {
    font-weight: 600;
    font-size: 14px;
}

.compact-stat-value {
    font-size: 20px;
    font-weight: 700;
}




                `}
            </style>
        </div>
    )
}