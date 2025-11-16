import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import "../../../assets/css/template-preview.css";
import { TemplateWriteCourseAPI } from "../../../api/GVDeCuong/TemplateWriteCourse";
import "../../../tinymce.config";
import { URL_API_DVDC } from "../../../URL_Config";
import { saveAs } from "file-saver";
export default function PreviewTemplateSyllabusFinal() {
    const { id_syllabus } = useParams();
    const [templateSections, setTemplateSections] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadListPLOCourse, setLoadListPLOCourse] = useState<any[]>([]);
    const storageKey = `syllabus_draft_${id_syllabus}`;
    const [draftData, setDraftData] = useState<any>({});
    const [loadPreviewLevelContribution, setLoadPreviewLevelContribution] = useState<any[]>([]);
    const [mappingRows, setMappingRows] = useState<any[]>([]);
    const [levelMatrix, setLevelMatrix] = useState<
        Record<string, { Id_Level: number; code_Level: string }>
    >({});

    const LoadData = async () => {
        try {
            const res = await TemplateWriteCourseAPI.PreviewTemplate({
                id_syllabus: Number(id_syllabus),
            });
            if (res.success) {
                const jsonString = res.data?.syllabus_json || "[]";
                setTemplateSections(JSON.parse(jsonString));
                SweetAlert("success", res.message);
            } else SweetAlert("error", res.message);
        } catch (err) {
            SweetAlert("error", "Lỗi khi tải dữ liệu biểu mẫu");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const LoadPreviewLevelContribution = async () => {
        const res = await TemplateWriteCourseAPI.PreviewLevelContribution({
            id_syllabus: Number(id_syllabus),
        });

        setLoadPreviewLevelContribution(res || []);
    };

    const LoadListPLOCourse = async () => {
        const res = await TemplateWriteCourseAPI.ListPLOCourse({ id_syllabus: Number(id_syllabus) });
        if (res.success) {
            setLoadListPLOCourse(res.data);
        }
    };



    const LoadPreviewMapPLObySyllabus = async () => {
        const res = await TemplateWriteCourseAPI.PreviewMapPLObySyllabus({
            id_syllabus: Number(id_syllabus)
        });

        const formatted = res.map((x: any) => ({
            id: x.id ?? null,
            map_clo: x.map_clo && x.map_clo !== "" ? x.map_clo : "CLO1",
            description: x.description ?? ""
        }));


        setMappingRows(formatted);
    };
    useEffect(() => {
        const loadAll = async () => {
            const savedDraft = localStorage.getItem(storageKey);
            if (savedDraft) {
                setDraftData(JSON.parse(savedDraft));
            }

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

                return `
          <table style="border-collapse: collapse; width: 100%;" border="1">
            <thead>
              <tr>
                <th style="padding: 6px; text-align:center">Buổi</th>
                <th style="padding: 6px; text-align:center">Nội dung</th>
                <th style="padding: 6px; text-align:center">Hoạt động dạy, học và đánh giá</th>
                <th style="padding: 6px; text-align:center">CLO liên quan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
              </tr>
            </tbody>
          </table>
          `;
            default:
                return "<p><br/></p>";
        }
    };

    const LoadSavedMappingCLOPI = async () => {
        const res = await TemplateWriteCourseAPI.GetMappingCLOPI({
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
                    draftData[section.section_code] ||
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
                draftData[section.section_code] ||
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

            const res = await fetch(`${URL_API_DVDC}/write-template-syllabus/export-word-html`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html })
            });

            const blob = await res.blob();
            saveAs(blob, `Syllabus_${id_syllabus}.docx`);

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
        <div className="main-content">
            <div className="container py-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="page-header no-gutters">
                            <h2 className="text-uppercase">Xem trước Mẫu đề cương</h2>
                            <hr />
                        </div>
                        {templateSections.length === 0 ? (
                            <p className="text-muted">Không có dữ liệu trong template này.</p>
                        ) : (
                            <div className="template-preview">
                                {templateSections.map((section, index) => {
                                    const level = section.section_code.split(".").length - 1;
                                    const levelClass =
                                        level === 0
                                            ? "main-level"
                                            : level === 1
                                                ? "child-level-1"
                                                : "child-level-2";
                                    const allowInput =
                                        section.allow_input?.toLowerCase() === "cho phép nhập liệu";
                                    return (
                                        <div key={index} className={`template-section ${levelClass}`}>
                                            <h6>{section.section_code}. {section.section_name}</h6>
                                            {allowInput ? (
                                                <div className="template-section-content">
                                                    {renderSectionContent(section)}
                                                </div>
                                            ) : (
                                                <div className="template-section-content text-muted fst-italic">

                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center border-top pt-3 d-flex justify-content-center gap-3 flex-wrap sticky-toolbar">
                    <button className="btn btn-success" onClick={exportWordHTML}>
                        📝 Xuất Word
                    </button>
                    <button className="btn btn-warning" onClick={() => window.history.back()}>
                        📝 Trở về trang trước
                    </button>
                </div>
            </div>
        </div>
    );
}
