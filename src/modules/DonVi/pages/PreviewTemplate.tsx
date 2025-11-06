import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateTemplateAPI } from "../../../api/DonVi/CreateTemplateAPI";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import OBEStructuredTable from "../../../components/ui/OBE";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/vi";
import "../../../assets/css/template-preview.css";
import { PreviewEvaluateAPI } from "../../../api/Shared/PreviewEvaluate";
ClassicEditor.defaultConfig = {
  ...(ClassicEditor.defaultConfig || {}),
  licenseKey: "GPL",
};

export default function PreviewTemplateInterfaceDonVi() {
  const navigate = useNavigate();
  const { id_template } = useParams();
  const [templateSections, setTemplateSections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadPreviewCourseObjectives, setLoadPreviewCourseObjectives] = useState<any[]>([]);
  const [loadPreviewCourseLearningOutcome, setLoadPreviewCourseLearningOutcome] = useState<any[]>([]);
  const [loadSelectedProgram, setLoadSelectedProgram] = useState<any[]>([]);
  const [loadPreviewProgramLearningOutcome, setLoadPreviewProgramLearningOutcome] = useState<any[]>([]);
  const [id_program, setIdProgram] = useState<number>(0);
  const LoadData = async () => {
    try {
      const res = await CreateTemplateAPI.PreviewTemplate({
        id_template: Number(id_template),
      });

      if (res.success) {
        const jsonString = res.data?.template_json || "[]";
        const parsed = JSON.parse(jsonString);
        setTemplateSections(parsed);
      } else {
        SweetAlert("error", res.message);
      }
    } catch (err) {
      SweetAlert("error", "Lỗi khi tải dữ liệu biểu mẫu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeIdProgram = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setIdProgram(value);
    await LoadPreviewProgramLearningOutcome(value);
  };

  const LoadPreviewProgramLearningOutcome = async (id: number) => {
    console.log(id);
    const res = await PreviewEvaluateAPI.PreviewProgramLearningOutcome({ id_program: id });
    setLoadPreviewProgramLearningOutcome(res);
  };

  const LoadPreviewCourseObjectives = async () => {
    const res = await PreviewEvaluateAPI.PreviewCourseObjectives();
    if (res.success) {
      setLoadPreviewCourseObjectives(res.data);
    }
  };
  const LoadPreviewCourseLearningOutcome = async () => {
    const res = await PreviewEvaluateAPI.PreviewCourseLearningOutcome();
    if (res.success) {
      setLoadPreviewCourseLearningOutcome(res.data);
    }
  };
  const LoadSelectedProgram = async () => {
    const res = await CreateTemplateAPI.LoadSelectedProgram();
    setLoadSelectedProgram(res);
  };
  useEffect(() => {
    LoadData();
    LoadSelectedProgram();
    LoadPreviewCourseObjectives();
    LoadPreviewCourseLearningOutcome();
    LoadPreviewProgramLearningOutcome(id_program);
  }, []);

  const RenderTableCourseObjectives = (section: any) => {
    const bindingType = section.dataBinding.split(" - ")[0];
    if (bindingType === "CO") {
      return (
        <div>
          <p className="fw-bold text-center">
            Bảng mẫu tham khảo chỉ số học phần
          </p>
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
    }
    else if (bindingType === "CLO") {
      return (
        <div>
          <p className="fw-bold text-center">
            Bảng mẫu tham khảo chỉ số chuẩn đầu ra học phần
          </p>
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
                  <td className="text-center">{item.bloom_level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    else if (bindingType === "PLO") {
      return (
        <div>
          <p>
            Tùy chọn này chỉ áp dụng cho xem trước, khi tạo mới đề cương môn học sẽ tự
            mapping theo chương trình đào tạo của môn học đó
          </p>
          <hr />

          <select
            className="form-control mb-3"
            onChange={handleChangeIdProgram}
            name="id_program"
          >
            {loadSelectedProgram.map((item: any, index: number) => (
              <option key={index} value={item.id_program}>
                {item.name_program}
              </option>
            ))}
          </select>

          <hr />

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

          <p className="fw-bold text-center mt-3">
            Bảng mẫu tham khảo chỉ số đầu ra học phần
          </p>
        </div>
      );

    }
  }
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
        return `
            <table style="border-collapse: collapse; width: 100%;" border="1">
            <thead>
              <tr>
                <th style="padding: 6px; text-align:center">Chuẩn đầu ra học phần</th>
                <th style="padding: 6px; text-align:center">Nội dung chuẩn đầu ra học phần</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 6px;">CLO1</td>
                <td style="padding: 6px;">...</td>
              </tr>
              <tr>
                <td style="padding: 6px;">CLO2</td>
                <td style="padding: 6px;">...</td>
              </tr>
              <tr>
                <td style="padding: 6px;">CLO3</td>
                <td style="padding: 6px;">...</td>
              </tr>            
            </tbody>
          </table>
          `;
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

  const renderSectionContent = (section: any) => {
    const type = section.contentType?.split(" - ")[0] || "";
    const bindingCode = section.dataBinding
      ? section.dataBinding.split(" - ")[0].trim()
      : "";
    switch (type) {
      case "text":
        return (
          <div className="ckeditor-wrapper">
            <CKEditor
              editor={ClassicEditor}
              data={section.value || "<p><br/></p>"}
              disabled={false}
              config={{
                language: "vi",
                placeholder: "Nhập nội dung tại đây...",
                licenseKey: "GPL",
                toolbar: {
                  items: [
                    "heading",
                    "|",
                    "fontfamily",
                    "fontsize",
                    "fontColor",
                    "fontBackgroundColor",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "|",
                    "alignment",
                    "outdent",
                    "indent",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "todoList",
                    "|",
                    "link",
                    "blockQuote",
                    "insertTable",
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
                    "tableProperties",
                    "tableCellProperties",
                    "|",
                    "horizontalLine",
                    "specialCharacters",
                    "|",
                    "undo",
                    "redo",
                  ],
                },
                table: {
                  contentToolbar: [
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
                    "tableCellProperties",
                    "tableProperties",
                  ],
                },
                alignment: {
                  options: ["left", "center", "right", "justify"],
                },
                removePlugins: [
                  "CKFinder",
                  "CKFinderUploadAdapter",
                  "EasyImage",
                  "ImageUpload",
                  "MediaEmbed",
                ],
              }}
            />

          </div>
        );

      case "obe_structured":
        return (
          <div className="ckeditor-wrapper">
            <CKEditor
              editor={ClassicEditor}
              data={section.value || getDefaultTemplateContent(bindingCode)}
              disabled={false}
              config={{
                language: "vi",
                placeholder: "Nhập nội dung tại đây...",
                licenseKey: "GPL",
                toolbar: {
                  items: [
                    "heading",
                    "|",
                    "fontfamily",
                    "fontsize",
                    "fontColor",
                    "fontBackgroundColor",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "|",
                    "alignment",
                    "outdent",
                    "indent",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "todoList",
                    "|",
                    "link",
                    "blockQuote",
                    "insertTable",
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
                    "tableProperties",
                    "tableCellProperties",
                    "|",
                    "horizontalLine",
                    "specialCharacters",
                    "|",
                    "undo",
                    "redo",
                  ],
                },
                table: {
                  contentToolbar: [
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
                    "tableCellProperties",
                    "tableProperties",
                  ],
                },
                alignment: {
                  options: ["left", "center", "right", "justify"],
                },
                removePlugins: [
                  "CKFinder",
                  "CKFinderUploadAdapter",
                  "EasyImage",
                  "ImageUpload",
                  "MediaEmbed",
                ],
              }}
            />

          </div>
        );

      default:
        return (
          <div className="text-muted fst-italic">
            Không có cấu hình hiển thị cho loại này.
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Đang tải biểu mẫu...</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container py-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="page-header no-gutters">
              <h2 className="text-uppercase">
                Xem trước Mẫu đề cương
              </h2>
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
                    section.allow_input?.toLowerCase() ===
                    "cho phép nhập liệu";

                  return (
                    <div
                      key={index}
                      className={`template-section ${levelClass}`}
                    >
                      <h6>
                        {section.section_code}. {section.section_name}
                      </h6>

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
