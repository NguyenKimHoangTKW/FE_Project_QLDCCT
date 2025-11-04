import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateTemplateAPI } from "../../../api/DonVi/CreateTemplateAPI";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import OBEStructuredTable from "../../../components/ui/OBE";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/vi";
import "../../../assets/css/template-preview.css";

ClassicEditor.defaultConfig = {
  ...(ClassicEditor.defaultConfig || {}),
  licenseKey: "GPL",
};

export default function PreviewTemplateInterfaceDonVi() {
  const navigate = useNavigate();
  const { id_template } = useParams();
  const [templateSections, setTemplateSections] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    LoadData();
  }, []);

  const renderSectionContent = (section: any) => {
    const type = section.contentType?.split(" - ")[0] || "";

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
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "insertTable",
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
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
                    "bold",
                    "italic",
                    "link",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "insertTable",
                    "tableColumn",
                    "tableRow",
                    "mergeTableCells",
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
