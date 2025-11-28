import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import "../../../assets/css/template-preview.css";
import * as signalR from "@microsoft/signalr";
import { TemplateWriteCourseAPI } from "../../../api/GVDeCuong/TemplateWriteCourse";
import "../../../tinymce.config";
import { Editor } from "@tinymce/tinymce-react";
import Swal from "sweetalert2";
import Modal from "../../../components/ui/Modal";
import { URL_API_DVDC } from "../../../URL_Config";
export default function TemplateWriteSyllabusInterfaceGVDeCuong() {
  const { id_syllabus } = useParams();
  const [templateSections, setTemplateSections] = useState<any[]>([]);
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadPreviewCourseObjectives, setLoadPreviewCourseObjectives] = useState<any[]>([]);
  const [loadPreviewCourseLearningOutcome, setLoadPreviewCourseLearningOutcome] = useState<any[]>([]);
  const [loadPreviewProgramLearningOutcome, setLoadPreviewProgramLearningOutcome] = useState<any[]>([]);
  const [loadListPLOCourse, setLoadListPLOCourse] = useState<any[]>([]);
  const storageKey = `syllabus_draft_${id_syllabus}`;
  const [draftData, setDraftData] = useState<any>({});
  const draftTimeouts = useRef<Record<string, any>>({});
  const editingSection = useRef<string | null>(null);
  const [loadPreviewLevelContribution, setLoadPreviewLevelContribution] = useState<any[]>([]);
  const [mappingRows, setMappingRows] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [levelMatrix, setLevelMatrix] = useState<
    Record<string, { Id_Level: number; code_Level: string }>
  >({});
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newAllowInput, setNewAllowInput] = useState("Cho phép nhập liệu");
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [aiLoadingSection, setAiLoadingSection] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [aiResult, setAIResult] = useState("");
  const [currentSection, setCurrentSection] = useState<any>(null);
  const [checkCreate, setCheckCreate] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const tempContent = useRef<Record<string, string>>({});
  const [checkOpen, setCheckOpen] = useState<{
    status?: boolean;
    is_open?: boolean;
    name_course?: string;
  }>({});
  const LoadData = async () => {
    try {
      const res = await TemplateWriteCourseAPI.PreviewTemplate({
        id_syllabus: Number(id_syllabus),
      });
      if (res.success) {
        if (res.data?.syllabus_section_json === null) {
          const jsonString = res.data?.syllabus_json || "[]";
          setTemplateSections(JSON.parse(jsonString));
        } else {
          const jsonString = res.data?.syllabus_section_json || "[]";
          setTemplateSections(JSON.parse(jsonString));
        }
        setCheckCreate(res.is_create);
        setCheckOpen({ status: res.data.status, is_open: res.data.is_open, name_course: res.data.course });
        SweetAlert("success", res.message);
      } else {
        setCheckOpen({ status: true, is_open: false, name_course: res.data.course });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAllContentDraft = async (json: string) => {
    const res = await TemplateWriteCourseAPI.SaveAllContentDraft({
      id_syllabus: Number(id_syllabus),
      section_json: json,
    });
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

  const editorReady = useRef(false);
  const LoadDraftFromServer = async () => {
    const res = await TemplateWriteCourseAPI.LoadDrafts({
      id_syllabus: Number(id_syllabus),
    });

    if (res.success) {
      const map: any = {};
      res.data.forEach((d: any) => {
        map[d.section_code] = d.content_code || "";
      });

      setDraftData(map);
    }
  };


  useEffect(() => {
    const loadAll = async () => {
      await LoadData();
      await LoadDraftFromServer();
    };
    loadAll();
  }, []);
  useEffect(() => {
    if (!editorReady.current) return;
    applyDraftToEditors();
  }, [draftData, templateSections]);


  useEffect(() => {
    if (checkOpen.status === false && checkOpen.is_open === true) {
      const loadAll = async () => {

        await LoadPreviewCourseObjectives();
        await LoadPreviewCourseLearningOutcome();
        await LoadPreviewProgramLearningOutcome();
        await LoadListPLOCourse();
        await LoadPreviewLevelContribution();
        await LoadPreviewMapPLObySyllabus();


      };

      loadAll();
    }
  }, [checkOpen.status === false && checkOpen.is_open === true]);
  useEffect(() => {
    if (
      checkOpen.status === false &&
      checkOpen.is_open === true &&
      mappingRows.length > 0 &&
      loadPreviewLevelContribution.length > 0
    ) {
      LoadSavedMappingCLOPI();
    }
  }, [
    checkOpen.status,
    checkOpen.is_open,
    mappingRows,
    loadPreviewLevelContribution
  ]);


  useEffect(() => {

    const connect = async () => {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:44314/hubs/syllabus", {
          withCredentials: true
        })
        .withAutomaticReconnect()
        .build();
      conn.on("SectionDraftUpdated", (sid, code, content) => {

        if (sid !== Number(id_syllabus)) return;
        if (editingSection.current === code) return;

        const editor = (window as any).tinymce?.get(code);
        if (!editor) return;

        try {
          const currentRaw = editor.getContent({ format: "raw" }).trim();
          const incomingRaw = (content ?? "").trim();

          if (currentRaw !== incomingRaw) {
            editor.setContent(content, { format: "raw" });
          }
        } catch { }
      });



      conn.on("UserTypingStatusChanged", (sid, user, section, isTyping) => {
        if (sid !== Number(id_syllabus)) return;

        setTypingUsers(prev => {

          const copy: Record<string, string[]> = {};
          for (const k in prev) {
            copy[k] = [...prev[k]];
          }

          if (!copy[section])
            copy[section] = [];

          if (isTyping) {

            if (!copy[section].includes(user)) {
              copy[section].push(user);
            }

          } else {

            copy[section] = copy[section].filter(u => u !== user);

            if (copy[section].length === 0) {
              delete copy[section];
            }
          }

          return copy;
        });
      });




      await conn.start();
      await conn.invoke("JoinSyllabusGroup", Number(id_syllabus));

      setHubConnection(conn);
    };

    connect();

    return () => {
      if (hubConnection) {
        hubConnection.invoke("LeaveSyllabusGroup", Number(id_syllabus)).catch(() => { });
        hubConnection.stop();
      }
    };
  }, [id_syllabus]);



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
          <hr />
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
              <hr />
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
                <td style="padding: 6px;"></td>
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

                    {ploData.flatMap((p: any) =>
                      p.pi_list.map((pi: any) => {
                        const key = `${rowIndex}_${pi.id_PI}`;
                        const cell = levelMatrix[key];

                        return (
                          <td key={`cell-${rowIndex}-${pi.id_PI}`}>
                            <select
                              value={cell ? `${cell.Id_Level}|${cell.code_Level}` : ""}
                              onChange={(e) => handleLevelChange(rowIndex, pi.id_PI, e.target.value)}
                            >
                              <option value="">--</option>
                              {levelList.map((lv: any) => (
                                <option key={lv.id} value={`${lv.id}|${lv.code}`}>
                                  {lv.code}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })
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
  const handleLevelChange = (rowIndex: number, piId: number, value: string) => {
    const key = `${rowIndex}_${piId}`;

    if (!value) {
      setLevelMatrix(prev => ({
        ...prev,
        [key]: {
          Id_Level: 0,
          code_Level: ""
        }
      }));
      return;
    }

    const [idLevelStr, codeLevel] = value.split("|");
    const idLevel = Number(idLevelStr) || 0;

    setLevelMatrix(prev => ({
      ...prev,
      [key]: {
        Id_Level: idLevel,
        code_Level: codeLevel
      }
    }));
  };
  const saveLevelMapping = async () => {
    const entries = Object.entries(levelMatrix) as unknown as [
      string,
      { Id_Level: number; code_Level: string }
    ][];

    const payload = entries.map(([key, obj]) => {
      const [rowIndex, piId] = key.split("_");
      const clo = mappingRows[Number(rowIndex)];

      return {
        id_syllabus: Number(id_syllabus),
        id_CLoMapping: Number(clo.id),
        Id_PI: Number(piId),
        Id_Level: obj.Id_Level,
        code_Level: obj.code_Level
      };
    });

    const res = await TemplateWriteCourseAPI.SaveMappingCLOPI(payload);

    if (res.success) {
      SweetAlert("success", "Đã lưu mapping CLO – PI!");
    } else {
      SweetAlert("error", res.message || "Lưu mapping CLO – PI thất bại!");
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
  const saveFinalSyllabus = async () => {
    const confirm = await Swal.fire({
        title: "Bạn có chắc chắn muốn lưu đề cương này không?",
        text: "Bạn sẽ không thể hoàn tác lại!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, lưu ngay!",
        cancelButtonText: "Hủy"
    });

    if (!confirm.isConfirmed) return;

    const html = buildFullHTML();

    const res = await TemplateWriteCourseAPI.SaveFinalFromDraft({
        id_syllabus: Number(id_syllabus),
        html_export_word: html,
    });

    if (res.success) {
        Swal.fire({
            title: "Đã lưu!",
            text: res.message || "Đề cương đã được lưu hoàn chỉnh.",
            icon: "success"
        });
        localStorage.setItem("reload_syllabus_final", Date.now().toString());
        setTimeout(() => {
            window.close();
        }, 1200);

    } else {
        SweetAlert("error", res.message || "Lưu đề cương thất bại!");
    }
};



  const applyDraftToEditors = () => {
    if (!editorReady.current) return;

    setTimeout(() => {
      Object.entries(draftData).forEach(([sec, content]) => {
        const ed = (window as any).tinymce?.get(sec);
        if (!ed || ed.destroyed) return;

        try {
          const current = ed.getContent({ format: "raw" });
          if (editingSection.current !== sec) {
            if (current !== content) ed.setContent(content);
          }
        } catch { }
      });
    }, 200);
  };

  const renderSectionContent = (section: any) => {
    const type = section.contentType?.split(" - ")[0] || "";
    const bindingCode = section.dataBinding
      ? section.dataBinding.split(" - ")[0].trim()
      : "";
    const sectionId = section.section_code;

    switch (type) {
      case "text":
      case "obe_structured": {
        if (bindingCode === "CLO" || bindingCode === "PLO") {
          return getDefaultTemplateContent(bindingCode);
        }

        const initialContent =
          draftData[sectionId] ??
          section.value ??
          getDefaultTemplateContent(bindingCode);

        return (
          <div className="tinymce-wrapper">
            <Editor
              key={sectionId}
              id={sectionId}
              initialValue={initialContent}
              onEditorChange={(newContent) => {
                tempContent.current[sectionId] = newContent;

                hubConnection?.invoke(
                  "UpdateSectionDraft",
                  Number(id_syllabus),
                  sectionId,
                  newContent
                );

                if (draftTimeouts.current[sectionId]) {
                  clearTimeout(draftTimeouts.current[sectionId]);
                }
                draftTimeouts.current[sectionId] = setTimeout(() => {
                  TemplateWriteCourseAPI.SaveDraftSection({
                    id_syllabus: Number(id_syllabus),
                    section_code: sectionId,
                    content: newContent
                  });
                }, 1200);
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
                  "table | link image | preview code fullscreen",
                forced_root_block: "",
                setup(editor) {
                  editor.on("focus", () => {
                    editingSection.current = sectionId;
                    hubConnection?.invoke("StartTyping", Number(id_syllabus), sectionId);
                  });

                  editor.on("blur", () => {
                    editingSection.current = null;
                    hubConnection?.invoke("StopTyping", Number(id_syllabus), sectionId);
                  });
                }
              }}
            />
          </div>
        );
      }

      default:
        return (
          <div className="text-muted fst-italic">
            (Không có cấu hình hiển thị cho loại này)
          </div>
        );
    }
  };

  const sortSectionCodes = (sections: any[]) => {
    return sections.slice().sort((a, b) => {
      const pa = a.section_code.split('.').map(Number);
      const pb = b.section_code.split('.').map(Number);

      const len = Math.max(pa.length, pb.length);
      for (let i = 0; i < len; i++) {
        const na = pa[i] ?? 0;
        const nb = pb[i] ?? 0;
        if (na < nb) return -1;
        if (na > nb) return 1;
      }
      return 0;
    });
  };

  const addNewSection = () => {
    if (!newSectionName.trim()) {
      SweetAlert("error", "Tên tiêu đề không được để trống!");
      return;
    }

    const topLevelCount = templateSections.filter(
      s => !s.section_code.includes(".")
    ).length;

    const newCode = `${topLevelCount + 1}`;

    const newSection = {
      id_template_section: null,
      section_code: newCode,
      section_name: newSectionName,
      order_index: templateSections.length + 1,
      allow_input: newAllowInput,
      contentType: "text - Dạng Text tự do",
      dataBinding: "",
      value: ""
    };

    const updated = sortSectionCodes([...templateSections, newSection]);
    setTemplateSections(updated);
    handleSaveAllContentDraft(JSON.stringify(updated));
    setShowAddSection(false);
    setNewSectionName("");
  };

  const saveSectionEdit = () => {
    if (!editName.trim()) return;

    const updated = [...templateSections];
    updated[editingSectionIndex].section_name = editName;

    setTemplateSections(updated);
    localStorage.setItem(`syllabus_draft_${id_syllabus}_sections`, JSON.stringify(updated));

    setEditingSectionIndex(null);
  };
  const deleteSection = (index: number) => {
    let updated = templateSections.filter((_, i) => i !== index);

    updated = sortSectionCodes(updated);

    setTemplateSections(updated);
    handleSaveAllContentDraft(JSON.stringify(updated));
  };

  const addChildSection = (parentCode: string) => {
    const children = templateSections.filter(s =>
      s.section_code.startsWith(parentCode + ".")
    );

    const nextChildIndex = children.length + 1;
    const newCode = `${parentCode}.${nextChildIndex}`;

    const newSection = {
      id_template_section: null,
      section_code: newCode,
      section_name: `Tiêu đề ${newCode}`,
      order_index: templateSections.length + 1,
      allow_input: "Cho phép nhập liệu",
      contentType: "text - Dạng Text tự do",
      dataBinding: "",
      value: ""
    };

    const updated = sortSectionCodes([...templateSections, newSection]);
    setTemplateSections(updated);

    localStorage.setItem(
      `syllabus_draft_${id_syllabus}_sections`,
      JSON.stringify(updated)
    );
  };

  const runAISuggestStream = async () => {
    try {
      setAILoading(true);
      setAIResult("");

      const res = await fetch(`${URL_API_DVDC}/write-template-syllabus/suggest-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionTitle: currentSection.section_name,
          courseName: checkOpen.name_course,
          customPrompt: aiPrompt
        })
      });

      if (!res.ok) {
        setAIResult("⚠ Lỗi gọi AI (status " + res.status + ")");
        setAILoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setAIResult("⚠ Trình duyệt không hỗ trợ streaming.");
        setAILoading(false);
        return;
      }

      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setAIResult(prev => prev + chunk);
        }
      }

    } catch (err) {
      console.error(err);
      setAIResult("⚠ Không thể kết nối AI. Vui lòng thử lại.");
    } finally {
      setAILoading(false);
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
        <div className="card card-ceo">
          <div className="card-body">
            <div className="page-header-ceo mb-3">
              <h2 className="text-uppercase">Viết đề cương cho môn học <span style={{ color: "red" }}>{checkOpen.name_course}</span></h2>
              <hr />
            </div>

            {checkOpen.status === true ? (
              <div className="alert-ceo">
                <strong className="text-primary"><i className="fas fa-bell me-2"></i>Thông báo:</strong>
                <div className="mt-1">Đề cương này đã được duyệt và hoàn chỉnh, không thể thay đổi chỉnh sửa</div>
              </div>

            ) : checkOpen.is_open === false ? (
              <div className="alert-ceo">
                <strong className="text-primary"><i className="fas fa-bell me-2"></i>Thông báo:</strong>
                <div className="mt-1">Ngoài thời gian thực hiện viết đề cương</div>
              </div>
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
                      {typingUsers[section.section_code]?.length > 0 && (
                        <div className="text-primary small fst-italic mb-1" style={{ opacity: 0.8 }}>
                          👉 {typingUsers[section.section_code].join(", ")} đang nhập...
                        </div>
                      )}


                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setCurrentSection(section);
                          setAIPrompt(
                            `Bạn là chuyên gia giáo dục đại học, có kinh nghiệm biên soạn đề cương chi tiết học phần.

                              Hãy viết một đoạn văn dài, gồm nhiều đoạn, văn phong học thuật – chuẩn mực – logic, có mở đầu – triển khai – kết luận.

                              YÊU CẦU:
                              Không bullet
                              Không đánh số
                              Không gạch đầu dòng
                              Không liệt kê
                              Không văn nói
                              Không dùng từ ngữ đời thường
                              Không viết ngắn
                              Tối thiểu khoảng 800–1000 chữ.

                              Viết cho mục: ${section.section_name}
                              Thuộc học phần: ${checkOpen.name_course}.`
                          );
                          setShowAIModal(true);
                        }}
                      >
                        Gợi ý AI
                      </button>

                      {section.id_template_section === null && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-success ms-2"
                            onClick={() => addChildSection(section.section_code)}
                          >
                            + Thêm tiêu đề con
                          </button>

                          <button
                            className="btn btn-sm btn-outline-secondary ms-2"
                            onClick={() => {
                              setEditingSectionIndex(index);
                              setEditName(section.section_name);
                            }}
                          >
                            ✏️
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => deleteSection(index)}
                          >
                            🗑 Xóa
                          </button>
                        </>
                      )}


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
        <div className="text-center border-top pt-3 d-flex justify-content-center gap-3 flex-wrap sticky-toolbar">
          {checkOpen.status === false && checkOpen.is_open === true ? (
            <>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {checkCreate === true ? (
                  <>
                    <button
                      type="button"
                      className="btn-ceo-primary shadow-sm"
                      style={{ borderRadius: "10px" }}
                      onClick={saveFinalSyllabus}
                    >
                      <i className="fas fa-save me-2 fs-5"></i>
                      <span className="fw-semibold">Lưu đề cương</span>
                    </button>

                    <button
                      className="btn btn-lg px-4 btn-outline-primary shadow-sm d-flex align-items-center"
                      style={{ borderRadius: "10px" }}
                      onClick={() => setShowAddSection(true)}
                    >
                      <i className="fas fa-plus-circle me-2 fs-5"></i>
                      <span className="fw-semibold">Thêm tiêu đề cha</span>
                    </button>
                  </>
                ) : (
                  <>
                    <p>Bạn là giảng viên phụ viết đề cương, chỉ có giảng viên tạo đề cương này mới có thể thao tác nộp đề cương</p>
                  </>
                )}

              </div>

            </>
          ) : (
            <>
            </>
          )}

        </div>

      </div>
      <Modal
        isOpen={showAddSection}
        onClose={() => setShowAddSection(false)}
        onSave={addNewSection}
      >
        <div className="modal-custom">
          <h5>Thêm tiêu đề cha</h5>

          <label>Tên tiêu đề:</label>
          <input
            className="form-control mb-2"
            value={newSectionName}
            onChange={e => setNewSectionName(e.target.value)}
          />

          <label>Cho phép nhập liệu?</label>
          <select
            className="form-control mb-3"
            value={newAllowInput}
            onChange={e => setNewAllowInput(e.target.value)}
          >
            <option>Cho phép nhập liệu</option>
            <option>Không cho phép nhập liệu</option>
          </select>
        </div>
      </Modal>
      <Modal isOpen={showAIModal} onClose={() => setShowAIModal(false)}>
        <div style={{ minWidth: "600px" }}>
          <h5 className="mb-3">Gợi ý nội dung bằng AI</h5>

          <label className="fw-bold">Prompt yêu cầu:</label>
          <textarea
            className="form-control"
            rows={4}
            value={aiPrompt}
            onChange={e => setAIPrompt(e.target.value)}
          />

          <button
            className="btn btn-primary"
            disabled={aiLoading}
            onClick={runAISuggestStream}
          >
            {aiLoading ? "AI đang viết..." : "Gợi ý AI"}
          </button>

          <pre className="mt-3" style={{ whiteSpace: "pre-wrap" }}>
            {aiResult}
          </pre>

          <hr />

          <label className="fw-bold">Kết quả AI:</label>

          <div className="border p-2" style={{ minHeight: "120px" }}>
            {aiLoading ? <span className="text-muted">Đang sinh nội dung...</span> : aiResult}
          </div>

          {aiResult && (
            <button
              className="btn btn-success mt-3"
              onClick={() => {
                setDraftData(prev => ({
                  ...prev,
                  [currentSection.section_code]: aiResult
                }));
                setShowAIModal(false);
              }}
            >
              Chèn vào nội dung mục này
            </button>
          )}

        </div>
      </Modal>


      {editingSectionIndex !== null && (
        <Modal
          isOpen={editingSectionIndex !== null}
          onClose={() => setEditingSectionIndex(null)}
          onSave={saveSectionEdit}
        >
          <div className="modal-custom">
            <h5>Chỉnh sửa tiêu đề</h5>

            <input
              className="form-control mb-3"
              value={editName}
              onChange={e => setEditName(e.target.value)}
            />

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary"
                onClick={() => setEditingSectionIndex(null)}>
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      )}
      <style>
        {`
        /* ===============================
   CEO UI DESIGN SYSTEM
   TDMU - Syllabus Authoring Suite
   =============================== */

/* Card tổng thể */
.card-ceo {
  border-radius: 14px !important;
  border: none !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06) !important;
  background: #ffffff;
}

/* Header */
.page-header-ceo h2 {
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Thông báo */
.alert-ceo {
  background: #eef4ff;
  border-left: 5px solid #3f73ff;
  padding: 16px 20px;
  border-radius: 10px;
}

/* Mỗi section */
.template-section {
  padding: 22px;
  border-radius: 14px;
  background: #ffffff;
  margin-bottom: 18px;
  border: 1px solid #e6e6e6;
  transition: 0.2s;
}

.template-section:hover {
  border-color: #bfd7ff;
  box-shadow: 0 2px 10px rgba(30, 90, 200, 0.08);
}

/* Section tiêu đề */
.template-section h6 {
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 17px;
}

/* Cấp 1 */
.main-level {
  background: #f9fbff;
  border-left: 5px solid #3f73ff;
}

/* Cấp 2 */
.child-level-1 {
  background: #fcfcff;
  border-left: 4px solid #7aa4ff;
}

/* Cấp 3 */
.child-level-2 {
  background: #ffffff;
  border-left: 4px solid #c6d7ff;
}

/* Nút hành động trên section */
.template-section button {
  border-radius: 8px !important;
  font-size: 13px;
  padding: 3px 10px !important;
}

/* Sticky toolbar */
.sticky-toolbar {
  position: sticky;
  bottom: 0;
  background: #ffffff;
  padding: 18px 10px;
  border-top: 1px solid #d7d7d7;
  z-index: 50;
}

/* Nút CEO */
.btn-ceo-primary {
  background: linear-gradient(135deg, #3f73ff, #2c58d9);
  border: none;
  color: white;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 10px;
}

.btn-ceo-primary:hover {
  background: linear-gradient(135deg, #5a89ff, #3f73ff);
}

.btn-ceo-outline {
  border: 2px solid #3f73ff !important;
  color: #3f73ff !important;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 10px;
}
/* Background tổng cho toàn trang */
body, .main-content {
  background: linear-gradient(135deg, #f5f8ff 0%, #eef3ff 40%, #ffffff 100%) !important;
  min-height: 100vh;
}

.btn-ceo-outline:hover {
  background: #3f73ff !important;
  color: white !important;
}

/* Modal CEO */
.modal-custom h5 {
  font-weight: 700;
  margin-bottom: 12px;
}

.modal-content {
  border-radius: 18px !important;
  padding: 5px 10px;
}

input.form-control,
select.form-control,
textarea.form-control {
  border-radius: 10px !important;
  border: 1px solid #d6d6d6 !important;
}

input.form-control:focus,
select.form-control:focus {
  border-color: #3f73ff !important;
  box-shadow: 0 0 0 3px rgba(63, 115, 255, 0.15) !important;
}

        `}
      </style>
    </div>
  );
}