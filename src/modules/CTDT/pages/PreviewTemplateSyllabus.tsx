import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import "../../../assets/css/template-preview.css";
import "../../../tinymce.config";
import { URL_PREVIEW } from "../../../URL_Config";
import { saveAs } from "file-saver";
import { PreviewTemplateAPI } from "../../../api/Shared/PreviewTemplate";
import { BrowseOutlineAPI } from "../../../api/CTDT/BrowseOutline";
import Swal from "sweetalert2";
import Modal from "../../../components/ui/Modal";
import { Editor } from "@tinymce/tinymce-react";
export default function PreviewTemplateSyllabusFinal() {
    const { id_syllabus, check_view } = useParams();
    const [templateSections, setTemplateSections] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadListPLOCourse, setLoadListPLOCourse] = useState<any[]>([]);
    const [loadPreviewLevelContribution, setLoadPreviewLevelContribution] = useState<any[]>([]);
    const [mappingRows, setMappingRows] = useState<any[]>([]);
    const [levelMatrix, setLevelMatrix] = useState<
        Record<string, { Id_Level: number; code_Level: string }>
    >({});
    const [nameCourse, setNameCourse] = useState<string>("");
    const [showModalRefundSyllabus, setShowModalRefundSyllabus] = useState(false);
    const [returned_content, setReturned_content] = useState<string>("");
    const LoadData = async () => {
        try {
            const res = await PreviewTemplateAPI.PreviewTemplate({
                id_syllabus: Number(id_syllabus),
            });
            if (res.success) {
                const jsonString = res.data?.syllabus_json || "[]";
                setTemplateSections(JSON.parse(jsonString));
                SweetAlert("success", res.message);
                setNameCourse(res.data.course);
            } else SweetAlert("error", res.message);
        } catch (err) {
            SweetAlert("error", "Lỗi khi tải dữ liệu biểu mẫu");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const LoadPreviewLevelContribution = async () => {
        const res = await PreviewTemplateAPI.PreviewLevelContribution({
            id_syllabus: Number(id_syllabus),
        });

        setLoadPreviewLevelContribution(res || []);
    };

    const LoadListPLOCourse = async () => {
        const res = await PreviewTemplateAPI.ListPLOCourse({ id_syllabus: Number(id_syllabus) });
        if (res.success) {
            setLoadListPLOCourse(res.data);
        }
    };



    const LoadPreviewMapPLObySyllabus = async () => {
        const res = await PreviewTemplateAPI.PreviewMapPLObySyllabus({
            id_syllabus: Number(id_syllabus)
        });

        const formatted = res.map((x: any) => ({
            id: x.id ?? null,
            map_clo: x.map_clo && x.map_clo !== "" ? x.map_clo : "CLO1",
            description: x.description ?? ""
        }));


        setMappingRows(formatted);
    };
    const handleApproveSyllabus = async () => {
        const confirm = await Swal.fire({
            title: "Xác nhận duyệt đề cương?",
            text: "Sau khi duyệt, giảng viên sẽ không thể chỉnh sửa lại.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, duyệt ngay",
            cancelButtonText: "Hủy"
        });

        if (!confirm.isConfirmed) return;

        const res = await BrowseOutlineAPI.ApproveSyllabus({
            id_syllabus: Number(id_syllabus)
        });

        if (res.success) {
            SweetAlert("success", res.message);
            localStorage.setItem("reload_syllabus_list", Date.now().toString());
            setTimeout(() => {
                window.close();
            }, 1000);
        } else {
            SweetAlert("error", res.message);
        }
    };
    const handleOpenModalRefundSyllabus = () => {
        setShowModalRefundSyllabus(true);
    }
    const handleSaveRefundSyllabus = async () => {
        const confirm = await Swal.fire({
            title: "Xác nhận duyệt đề cương?",
            text: "Sau khi hoàn trả, giảng viên sẽ chỉnh sửa, bạn chỉ có thể xem lại đề cương sau khi giảng viên hoàn thành chỉnh sửa.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, hoàn trả ngay",
            cancelButtonText: "Hủy"
        });

        if (!confirm.isConfirmed) return;

        const res = await BrowseOutlineAPI.RefundSyllabus({
            id_syllabus: Number(id_syllabus),
            returned_content: returned_content
        });

        if (res.success) {
            SweetAlert("success", res.message);
            localStorage.setItem("reload_syllabus_list", Date.now().toString());
            setTimeout(() => {
                window.close();
            }, 1000);
        } else {
            SweetAlert("error", res.message);
        }
    }
    useEffect(() => {
        const loadAll = async () => {
            await LoadData();
            await LoadListPLOCourse();
            await LoadPreviewLevelContribution();
            await LoadPreviewMapPLObySyllabus();
        };

        loadAll();
    }, []);
    useEffect(() => {
        if (mappingRows.length > 0) {
            LoadSavedMappingCLOPI();
        }
    }, [mappingRows]);

    const getDefaultTemplateContent = (bindingCode: string) => {
        switch (bindingCode) {
            case "CLO":
                return (
                    <>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th className="text-center" style={{ width: "60px" }}>STT</th>
                                    <th className="text-center" style={{ width: "120px" }}>Mã CLO</th>
                                    <th className="text-center">Nội dung chuẩn đầu ra học phần</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mappingRows.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="text-center">{index + 1}</td>

                                        <td className="text-center fw-bold">{item.map_clo}</td>

                                        <td>{item.description}</td>
                                    </tr>
                                ))}

                                {mappingRows.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="text-center fst-italic text-muted">
                                            (Chưa có dữ liệu CLO)
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                );

            case "PLO": {
                const cloList = mappingRows;
                const ploData = loadListPLOCourse || [];

                if (!ploData || ploData.length === 0) {
                    return (
                        <p className="text-center fst-italic">
                            (Chưa có dữ liệu ma trận PLO - PI)
                        </p>
                    );
                }

                const totalPiCols = ploData.reduce(
                    (sum: number, p: any) => sum + p.pi_list.length,
                    0
                );

                return (
                    <div style={{ overflowX: "auto" }}>
                        <table className="table table-bordered" style={{ width: "100%", tableLayout: "fixed" }}>
                            <thead>
                                <tr>
                                    <th
                                        rowSpan={3}
                                        className="text-center"
                                        style={{ width: "90px", background: "#d9e7ff" }}
                                    >
                                        CLO
                                    </th>
                                    <th
                                        colSpan={totalPiCols}
                                        className="text-center"
                                        style={{ background: "#d9e7ff" }}
                                    >
                                        PLO và PI
                                    </th>
                                </tr>

                                <tr>
                                    {ploData.map((p: any) => (
                                        <th
                                            key={`plo-${p.plo_code}`}
                                            colSpan={p.pi_list.length}
                                            className="text-center"
                                            style={{ background: "#eaf2ff", whiteSpace: "nowrap" }}
                                        >
                                            {p.plo_code}
                                        </th>
                                    ))}
                                </tr>

                                <tr>
                                    {ploData.flatMap((p: any) =>
                                        p.pi_list.map((pi: any) => (
                                            <th
                                                key={`pi-${p.plo_code}-${pi.pi_code}`}
                                                className="text-center"
                                                style={{ background: "#b4d5ff", whiteSpace: "nowrap" }}
                                            >
                                                {pi.pi_code}
                                            </th>
                                        ))
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {cloList.map((clo: any, rowIndex: number) => (
                                    <tr key={`clo-${rowIndex}`}>
                                        <td className="text-center fw-bold">{clo.map_clo}</td>

                                        {ploData.flatMap((p: any) =>
                                            p.pi_list.map((pi: any) => {
                                                const key = `${rowIndex}_${pi.id_PI}`;
                                                const cell = levelMatrix[key];

                                                return (
                                                    <td key={`cell-${rowIndex}-${pi.id_PI}`} className="text-center">
                                                        {cell?.code_Level || ""}
                                                    </td>
                                                );
                                            })
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }

            default:
                return "<p><br/></p>";
        }
    };

    const LoadSavedMappingCLOPI = async () => {
        const res = await PreviewTemplateAPI.GetMappingCLOPI({
            id_syllabus: Number(id_syllabus),
        });

        const matrix: Record<string, { Id_Level: number; code_Level: string }> = {};

        res.forEach((item: any) => {
            const rowIndex = mappingRows.findIndex(
                (x: any) => x.id === item.id_CLoMapping
            );

            if (rowIndex === -1) return;
            const levelId = item.Id_Level ?? item.id_Level;

            if (!levelId) return;
            const levelInfo = loadPreviewLevelContribution.find(
                (lv: any) => lv.id === levelId
            );

            const codeLevel =
                item.code_Level ??
                item.Code_Level ??
                levelInfo?.code ??
                levelInfo?.Code ??
                "";

            const key = `${rowIndex}_${(item.Id_PI ?? item.id_PI)}`;

            matrix[key] = {
                Id_Level: levelId,
                code_Level: codeLevel,
            };
        });

        setLevelMatrix(matrix as any);
    };

    const renderSectionContent = (section: any) => {
        const type = section.contentType?.split(" - ")[0] || "";
        const bindingCode = section.dataBinding ? section.dataBinding.split(" - ")[0].trim() : "";

        switch (type) {
            case "text":
            case "obe_structured":
                if (bindingCode === "CLO" || bindingCode === "PLO") {
                    return getDefaultTemplateContent(bindingCode);
                }

                const htmlContent =
                    section.value ||
                    getDefaultTemplateContent(bindingCode);

                return (
                    <div
                        className="preview-html"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                );
            default:
                return (
                    <div className="text-muted fst-italic">
                        (Không có cấu hình hiển thị cho loại này)
                    </div>
                );
        }
    };
    const getHeadingTag = (sectionCode: string) => {
        const level = sectionCode.split(".").length - 1;

        if (level === 0) return "h1";
        if (level === 1) return "h2";
        if (level === 2) return "h3";
        return "h4";
    };
    const buildFullHTML = () => {
        let html = `
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 13pt; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 6px; }
          h2, h3, h4 { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h2 style="text-align:center;">ĐỀ CƯƠNG CHI TIẾT</h2>
    `;

        const ploMatrixData = loadListPLOCourse || [];
        const totalPiCols = ploMatrixData.reduce(
            (sum: number, p: any) => sum + (p.pi_list?.length || 0),
            0
        );

        templateSections.forEach(section => {
            const binding = section.dataBinding?.split(" - ")[0] ?? "";
            const content =
                section.value ||
                "(không có nội dung)";

            const HeadingTag = getHeadingTag(section.section_code);

            html += `
                <${HeadingTag}>${section.section_code}. ${section.section_name}</${HeadingTag}>
                <div>${content}</div>
            `;


            if (binding === "CLO") {
                html += `
          <h4>Danh sách CLO</h4>
          <table>
            <tr><th>Mã CLO</th><th>Mô tả</th></tr>
            ${mappingRows
                        .map(
                            r => `<tr><td>${r.map_clo}</td><td>${r.description}</td></tr>`
                        )
                        .join("")}
          </table>
        `;
            }

            if (binding === "PLO") {
                if (ploMatrixData && ploMatrixData.length > 0) {
                    html += `
            <h4>Ma trận CLO – PLO/PI</h4>
            <table>
              <thead>
                <tr>
                  <th rowspan="3">CLO</th>
                  <th colspan="${totalPiCols}">PLO và PI</th>
                </tr>
                <tr>
                  ${ploMatrixData
                            .map(
                                (p: any) =>
                                    `<th colspan="${p.pi_list.length}">${p.plo_code}</th>`
                            )
                            .join("")}
                </tr>
                <tr>
                  ${ploMatrixData
                            .flatMap((p: any) =>
                                p.pi_list.map(
                                    (pi: any) => `<th>${pi.pi_code}</th>`
                                )
                            )
                            .join("")}
                </tr>
              </thead>
              <tbody>
                ${mappingRows
                            .map((clo: any, rowIndex: number) => {
                                const cells = ploMatrixData
                                    .flatMap((p: any) => p.pi_list)
                                    .map((pi: any) => {
                                        const key = `${rowIndex}_${pi.id_PI}`;
                                        const code = levelMatrix[key]?.code_Level || "";
                                        return `<td>${code}</td>`;
                                    })
                                    .join("");

                                return `
                      <tr>
                        <td>${clo.map_clo}</td>
                        ${cells}
                      </tr>
                    `;
                            })
                            .join("")}
              </tbody>
            </table>
          `;
                }
            }
        });

        html += `</body></html>`;
        return html;
    };
    const exportWordHTML = async () => {
        try {
            const html = buildFullHTML();

            const res = await fetch(`${URL_PREVIEW}/export-word-html`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html })
            });

            const blob = await res.blob();
            saveAs(blob, `Exports.docx`);

        } catch (e) {
            SweetAlert("error", "Không thể xuất file Word");
        }
    };

    if (loading)
        return (
            <div className="p-4 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2">Đang tải biểu mẫu...</p>
            </div>
        );

    return (
        <div
            className="main-content"
            style={{
                background: "linear-gradient(135deg, #f7f9fb, #eef3f8)",
                minHeight: "100vh",
                padding: "24px",
                marginTop: "55px"
            }}
        >
            <div className="container">

                <div
                    className="p-4 mb-4"
                    style={{
                        background: "white",
                        borderRadius: "18px",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.06)"
                    }}
                >
                    <h1
                        className="text-uppercase fw-bold"
                        style={{ fontSize: "26px", color: "#1e3a8a" }}
                    >
                        📘 Xem bản hoàn chỉnh đề cương
                    </h1>

                    <p
                        style={{
                            fontSize: "16px",
                            opacity: 0.8,
                            marginTop: "6px"
                        }}
                    >
                        Môn học: <span className="fw-bold" style={{ color: "#dc2626" }}>{nameCourse}</span>
                    </p>
                </div>

                {/* MAIN CARD */}
                <div
                    className="card border-0"
                    style={{
                        borderRadius: "18px",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                        background: "white"
                    }}
                >
                    <div className="card-body p-4">

                        {templateSections.length === 0 ? (
                            <p className="text-muted text-center fs-5 py-5">
                                Không có dữ liệu trong template này.
                            </p>
                        ) : (
                            <div className="template-preview">

                                {/* LIST SECTIONS */}
                                {templateSections.map((section, index) => {
                                    const level = section.section_code.split(".").length - 1;

                                    const marginLeft =
                                        level === 0 ? "0px" :
                                            level === 1 ? "20px" :
                                                "40px";

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                marginBottom: "28px",
                                                marginLeft: marginLeft,
                                                borderLeft: "4px solid #3b82f6",
                                                paddingLeft: "14px"
                                            }}
                                        >
                                            <h5
                                                style={{
                                                    color: "#1f2937",
                                                    fontWeight: 600,
                                                    marginBottom: "14px"
                                                }}
                                            >
                                                {section.section_code}. {section.section_name}
                                            </h5>

                                            <div
                                                className="template-section-content"
                                                style={{
                                                    background: "#fafbff",
                                                    padding: "16px",
                                                    borderRadius: "12px",
                                                    border: "1px solid #e5e7eb"
                                                }}
                                            >
                                                {renderSectionContent(section)}
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}
                    </div>
                </div>

                <div
                    className="d-flex justify-content-center gap-3 flex-wrap mt-4 p-3"
                    style={{
                        position: "sticky",
                        bottom: "0",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "14px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                >
                    <button
                        className="btn btn-lg px-4"
                        onClick={exportWordHTML}
                        style={{
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                            color: "white",
                            fontWeight: 600,
                            borderRadius: "14px",
                            boxShadow: "0 4px 14px rgba(37,99,235,0.4)"
                        }}
                    >
                        📝 Xuất Word
                    </button>
                    {check_view === "true" ? (
                        <>
                            <button
                                className="btn btn-lg px-4"
                                onClick={handleOpenModalRefundSyllabus}
                                style={{
                                    background: "linear-gradient(135deg,rgb(223, 34, 34),rgb(255, 11, 11))",
                                    color: "white",
                                    fontWeight: 600,
                                    borderRadius: "14px",
                                    boxShadow: "0 4px 14px rgba(255, 11, 11, 0.4)"
                                }}
                            >
                                📝 Hoàn trả đề cương bổ sung
                            </button>
                            <button
                                className="btn btn-lg px-4"
                                onClick={handleApproveSyllabus}
                                style={{
                                    background: "linear-gradient(135deg,rgb(22, 152, 22),rgb(25, 170, 25))",
                                    color: "white",
                                    fontWeight: 600,
                                    borderRadius: "14px",
                                    boxShadow: "0 4px 14px rgba(25, 170, 25, 0.4)"
                                }}
                            >
                                📝 Duyệt đề cương
                            </button>
                        </>

                    ) : null}
                </div>

            </div>
            <Modal
                isOpen={showModalRefundSyllabus}
                onClose={() => setShowModalRefundSyllabus(false)}
                title="Hoàn trả đề cương bổ sung"
                onSave={handleSaveRefundSyllabus}
            >
                <div>
                    <label className="form-label ceo-label">Ghi rõ nội dung hoàn trả chỉnh sửa lại đề cương</label>
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
                        onChange={(e: any) => setReturned_content(e.target.getContent())}
                    />
                </div>
            </Modal>
        </div>
    );

}
