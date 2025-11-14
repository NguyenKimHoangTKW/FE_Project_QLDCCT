import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import "../../../assets/css/template-preview.css";

import { TemplateWriteCourseAPI } from "../../../api/GVDeCuong/TemplateWriteCourse";
import "../../../tinymce.config";
import { Editor } from "@tinymce/tinymce-react";
export default function TemplateWriteSyllabusInterfaceGVDeCuong() {
  const { id_syllabus } = useParams();
  const [templateSections, setTemplateSections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadPreviewCourseObjectives, setLoadPreviewCourseObjectives] = useState<any[]>([]);
  const [loadPreviewCourseLearningOutcome, setLoadPreviewCourseLearningOutcome] = useState<any[]>([]);
  const [loadPreviewProgramLearningOutcome, setLoadPreviewProgramLearningOutcome] = useState<any[]>([]);
  const [loadListPLOCourse, setLoadListPLOCourse] = useState<any[]>([]);
  const storageKey = `syllabus_draft_${id_syllabus}`;
  const [draftData, setDraftData] = useState<any>({});
  const [loadPreviewLevelContribution, setLoadPreviewLevelContribution] = useState<any[]>([]);
  const [mappingRows, setMappingRows] = useState<any[]>([]);
  const [levelMatrix, setLevelMatrix] = useState<Record<string, number>>({});
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

  const LoadPreviewProgramLearningOutcome = async () => {
    const res = await TemplateWriteCourseAPI.PreviewProgramLearningOutcome({ id_syllabus: Number(id_syllabus) });
    setLoadPreviewProgramLearningOutcome(res);
  };
  const LoadListPLOCourse = async () => {
    const res = await TemplateWriteCourseAPI.ListPLOCourse({ id_syllabus: Number(id_syllabus) });
    if (res.success) {
      setLoadListPLOCourse(res.data);
    }
  };
  const LoadPreviewCourseObjectives = async () => {
    const res = await TemplateWriteCourseAPI.PreviewCourseObjectives({ id_syllabus: Number(id_syllabus) });
    if (res.success) setLoadPreviewCourseObjectives(res.data);
  };

  const LoadPreviewCourseLearningOutcome = async () => {
    const res = await TemplateWriteCourseAPI.PreviewCourseLearningOutcome({ id_syllabus: Number(id_syllabus) });
    if (res.success) setLoadPreviewCourseLearningOutcome(res.data);
  };
  const saveDraftToLocal = (updatedDraft: any) => {
    setDraftData(updatedDraft);
    localStorage.setItem(storageKey, JSON.stringify(updatedDraft));
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

  const addNewRow = () => {
    setMappingRows(prev => [
      ...prev,
      { id: null, map_clo: "CLO1", description: "" }
    ]);
  };

  const updateRow = (index: number, field: string, value: string) => {
    setMappingRows(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  useEffect(() => {
    const loadAll = async () => {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        setDraftData(JSON.parse(savedDraft));
      }
  
      await LoadData();
      await LoadPreviewCourseObjectives();
      await LoadPreviewCourseLearningOutcome();
      await LoadPreviewProgramLearningOutcome();
      await LoadListPLOCourse();
      await LoadPreviewLevelContribution();
      await LoadPreviewMapPLObySyllabus(); // chỉ load mappingRows thôi
    };
  
    loadAll();
  }, []);
  useEffect(() => {
    if (mappingRows.length > 0) {
      LoadSavedMappingCLOPI();
    }
  }, [mappingRows]);
  const RenderTableCourseObjectives = (section: any) => {
    const bindingType = section.dataBinding.split(" - ")[0];
    if (bindingType === "CO") {
      return (
        <div>
          <p className="fw-bold text-center">Bảng mẫu tham khảo chỉ số học phần</p>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="text-center">Mã CO</th>
                <th className="text-center">Mục tiêu học phần</th>
                <th className="text-center">Loại năng lực</th>
              </tr>
            </thead>
            <tbody>
              {loadPreviewCourseObjectives.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="text-center">{item.name_CO}</td>
                  <td>{item.describe_CO}</td>
                  <td>{item.typeOfCapacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (bindingType === "CLO") {
      return (
        <>
          <div>
            <p className="fw-bold text-center">Bảng mẫu tham khảo chỉ số chuẩn đầu ra học phần</p>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center">Mã CLO</th>
                  <th className="text-center">Mục tiêu đầu ra học phần</th>
                  <th className="text-center">Mức Bloom</th>
                </tr>
              </thead>
              <tbody>
                {loadPreviewCourseLearningOutcome.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="text-center">{item.name_CLO}</td>
                    <td>{item.describe_CLO}</td>
                    <td>{item.bloom_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr />
        </>
      );
    } else if (bindingType === "PLO") {
      return (
        <div>
          <p className="fw-bold text-center mt-3">
            Bảng mẫu tham khảo chỉ số đầu ra học phần
          </p>
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-center" style={{ width: "10%" }}>Mã PLO</th>
                <th className="text-center" style={{ width: "40%" }}>Nội dung PLO</th>
                <th className="text-center" style={{ width: "10%" }}>Mã PI</th>
                <th className="text-center" style={{ width: "40%" }}>Nội dung PI</th>
              </tr>
            </thead>
            {loadPreviewProgramLearningOutcome.map((plo: any, index: number) => (
              <tbody key={index}>
                {plo.pi.map((pi: any, piIndex: number) => (
                  <tr key={piIndex}>
                    {piIndex === 0 && (
                      <>
                        <td
                          rowSpan={plo.count_pi}
                          className="text-center fw-bold text-primary align-middle"
                        >
                          {plo.code_plo}
                        </td>
                        <td
                          rowSpan={plo.count_pi}
                          className="align-middle"
                          style={{ fontWeight: 500 }}
                        >
                          {plo.description_plo}
                        </td>
                      </>
                    )}
                    <td className="text-center fw-semibold">{pi.code}</td>
                    <td>{pi.description}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>

          {loadListPLOCourse && loadListPLOCourse.length > 0 && (
            <>
              <p className="fw-bold text-center mt-4 mb-2">
                Bảng tham chiếu mức độ đóng góp của học phần này (Level)
              </p>
              <table className="table table-bordered align-middle">
                <thead className="table-secondary">
                  <tr>
                    <th className="text-center" style={{ width: "15%" }}>Mã PLO</th>
                    <th className="text-center" style={{ width: "15%" }}>Mã PI</th>
                    <th className="text-center" style={{ width: "20%" }}>Mức độ đóng góp</th>
                    <th className="text-center">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {loadListPLOCourse.flatMap((plo: any, i: number) =>
                    plo.pi_list.map((pi: any, j: number) => (
                      <tr key={`${i}-${j}`}>
                        {j === 0 && (
                          <td
                            rowSpan={plo.pi_list.length}
                            className="text-center fw-bold text-primary align-middle"
                          >
                            {plo.plo_code}
                          </td>
                        )}
                        <td className="text-center fw-semibold">{pi.pi_code}</td>
                        <td className="text-center">{pi.level_code}</td>
                        <td>{pi.des_level}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      );
    }
  };

  const getDefaultTemplateContent = (bindingCode: string) => {
    switch (bindingCode) {
      case "GeneralInfomation":
        return `
          <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
              <tr>
                <td style="padding: 6px;"><strong>Tên học phần:</strong></td>
                <td style="padding: 6px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Tên tiếng Anh:</strong></td>
                <td style="padding: 6px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Mã học phần:</strong></td>
                <td style="padding: 6px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>E-learning:</strong></td>
                <td style="padding: 6px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Thuộc khối kiến thức/kỹ năng:</strong></td>
                <td style="padding: 6px;">
                  <p>Giáo dục đại cương □ &nbsp;&nbsp; Cơ sở ngành ☑️</p>
                  <p>Chuyên ngành □ &nbsp;&nbsp; Đồ án/Khóa luận □</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Số tín chỉ:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Số tiết lý thuyết:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Số tiết thực hành:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Tự học:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Học phần tiên quyết:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Học phần học trước:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
              <tr>
                <td style="padding: 6px;"><strong>Học phần song hành:</strong></td>
                <td style="padding: 6px;"></td>
              </tr>
            </tbody>
          </table>
        `;
      case "CO":
        return `
          <p><strong>CO1:</strong>...</p>
          <p><strong>CO2:</strong>...</p>
          <p><strong>CO3:</strong>...</p>
          ...
        `;
      case "CLO":
        return (
          <>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center">STT</th>
                  <th className="text-center">Chuẩn đầu ra học phần</th>
                  <th className="text-center">Nội dung chuẩn đầu ra học phần</th>
                  <th className="text-center">Save</th>
                  <th className="text-center">Xóa</th>
                </tr>
              </thead>

              <tbody>
                {mappingRows.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <select
                        className="form-control"
                        value={item.map_clo}
                        onChange={(e) => updateRow(index, "map_clo", e.target.value)}
                      >
                        {Array.from({ length: 20 }, (_, i) => (
                          <option key={i + 1} value={`CLO${i + 1}`}>
                            CLO{i + 1}
                          </option>
                        ))}
                      </select>

                    </td>

                    <td>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => updateRow(index, "description", e.target.value)}
                      />
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => saveMappingCLO(index)}
                      >
                        💾
                      </button>
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteMappingCLO(index)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={5} className="text-center">
                    <button className="btn btn-success btn-sm" onClick={addNewRow}>
                      + Thêm CLO mới
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )
      case "PLO": {
        const cloList = mappingRows;
        const ploData = loadListPLOCourse || [];
        const levelList = loadPreviewLevelContribution || [];

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
                    <td>{clo.map_clo}</td>

                    {ploData.flatMap(p =>
                      p.pi_list.map((pi: any) => (
                        <td key={`cell-${rowIndex}-${pi.id_PI}`}>
                          <select
                            value={levelMatrix[`${rowIndex}_${pi.id_PI}`] ?? 0}
                            onChange={(e) =>
                              handleLevelChange(
                                rowIndex,
                                pi.id_PI,
                                Number(e.target.value)
                              )
                            }
                          >
                            <option key={0} value={0}>--</option>
                            {levelList.map(lv => (
                              <option key={lv.id} value={lv.id}>{lv.code}</option>
                            ))}
                          </select>
                        </td>
                      ))
                    )}
                  </tr>
                ))}

              </tbody>
            </table>

            <hr />

            <div className="mt-3 d-flex justify-content-end gap-2">
              <button className="btn btn-primary btn-sm px-4" onClick={saveLevelMapping}>
                 Lưu mapping CLO–PI và kiểm tra tham chiếu mức độ đóng góp
              </button>
            </div>
          </div>
        );
      }

      case "LearningResources":
        return `
            <table style="border-collapse: collapse; width: 100%;" border="1">
            <thead>
              <tr>
                <th style="padding: 6px; text-align:center">Thứ tự</th>
                <th style="padding: 6px; text-align:center">Tên tác giả</th>
                <th style="padding: 6px; text-align:center">Năm xuất bản</th>
                <th style="padding: 6px; text-align:center">Tên sách, giáo trình, tên bài báo, văn bản</th>
                <th style="padding: 6px; text-align:center">NXB, tên tạp chí/nơi ban hành</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
              </tr>
              
            </tbody>
          </table>
          `;
      case "CourseAssessment":
        return `
          <table style="border-collapse: collapse; width: 100%;" border="1">
            <thead>
              <tr>
                <th style="padding: 6px; text-align:center">Thành phần đánh giá</th>
                <th style="padding: 6px; text-align:center">Trọng số (%)</th>
                <th style="padding: 6px; text-align:center">Hình thức/công cụ kiểm tra - đánh giá</th>
                <th style="padding: 6px; text-align:center">CLO</th>
                <th style="padding: 6px; text-align:center">Trọng số từng CLO trong thành phần đánh giá (%)</th>
                <th style="padding: 6px; text-align:center">Lấy dữ liệu đo lường mức độ đạt PLO/PI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
              </tr>
            </tbody>
          </table>
          `;
      case "MasterPlan":
        return `
          <table style="border-collapse: collapse; width: 100%;" border="1">
            <thead>
              <tr>
                <th style="padding: 6px; text-align:center">Buổi</th>
                <th style="padding: 6px; text-align:center">Hình thức học</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px;">...</td>
                <td style="padding: 6px;">...</td>
              </tr>
            </tbody>
          </table>
          `;
      case "DetailedPlan":
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
  const saveMappingCLO = async (index: number) => {
    const row = mappingRows[index];

    if (!row) return;

    const res = await TemplateWriteCourseAPI.AddNewMappingCLO({
      id: row.id ?? 0,
      id_syllabus: Number(id_syllabus),
      map_clo: row.map_clo,
      description: row.description
    });
    if (res.success) {
      SweetAlert("success", "Đã lưu dòng CLO!");
      LoadPreviewMapPLObySyllabus();
    }
    else {
      SweetAlert("error", res.message);
    }
  };

  const deleteMappingCLO = async (index: number) => {
    const row = mappingRows[index];
    if (!row.id) {
      setMappingRows(prev => prev.filter((_, i) => i !== index));
      return;
    }

    await TemplateWriteCourseAPI.DeleteMappingCLO({ id: row.id });

    setMappingRows(prev => prev.filter((_, i) => i !== index));
  };
  const handleLevelChange = (rowIndex: number, piId: number, levelId: number) => {
    setLevelMatrix(prev => ({
      ...prev,
      [`${rowIndex}_${piId}`]: levelId
    }));
  };

  const saveLevelMapping = async () => {
    const entries = Object.entries(levelMatrix);

    const payload = entries.map(([key, levelId]) => {
      const [rowIndex, piId] = key.split("_");
      const clo = mappingRows[Number(rowIndex)];

      return {
        id_CLoMapping: Number(clo.id),
        Id_PI: Number(piId),
        Id_Level: Number(levelId),
      };
    });

    const res = await TemplateWriteCourseAPI.SaveMappingCLOPI(payload);

    if (res.success) {
      SweetAlert("success", "Đã lưu mapping CLO – PI!");
    } else {
      SweetAlert("error", res.message || "Lưu mapping CLO – PI thất bại!");
    }
  };
  const LoadSavedMappingCLOPI = async () => {
    const res = await TemplateWriteCourseAPI.GetMappingCLOPI({ id_syllabus: Number(id_syllabus) });
  
    const matrix: Record<string, number> = {};
  
    res.forEach((item: any) => {
      const rowIndex = mappingRows.findIndex(x => x.id === item.id_CLoMapping);
  
      if (rowIndex !== -1) {
        const key = `${rowIndex}_${item.id_PI}`;
        matrix[key] = item.id_Level;
      }
    });
  
    setLevelMatrix(matrix);
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
        return (
          <div className="tinymce-wrapper">
            <Editor
              value={
                draftData[section.section_code] ??
                section.value ??
                getDefaultTemplateContent(bindingCode)
              }
              onEditorChange={(newContent) => {
                const updatedDraft = {
                  ...draftData,
                  [section.section_code]: newContent,
                };
                saveDraftToLocal(updatedDraft);
              }}
              init={{
                height: 500,
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
            />

          </div>
        );

      default:
        return <div className="text-muted fst-italic">(Không có cấu hình hiển thị cho loại này)</div>;
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
                          {RenderTableCourseObjectives(section)}
                          {renderSectionContent(section)}
                        </div>
                      ) : (
                        <div className="template-section-content text-muted fst-italic">
                          (Phần này không cho phép nhập liệu)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
