import { ListCTDTPermissionAPI } from "../../../api/CTDT/ListCTDTPermissionAPI";
import { StatisticalCLOCTDTAPI } from "../../../api/CTDT/StatisticalCLO";
import { useState, useEffect } from "react";
import Loading from "../../../components/ui/Loading";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
export default function StatisticalCLOInterfaceCTDT() {
    const [selectProgram, setSelectProgram] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState<any[]>([]);
    const [selectedKeyYear, setSelectedKeyYear] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [rawSearchText, setRawSearchText] = useState("");
    interface OptionData {
        Id_Program: number;
        Id_Key_Year_Semester: number;
    }
    const [optionData, setOptionData] = useState<OptionData>({
        Id_Program: 0,
        Id_Key_Year_Semester: 0,
    });
    const headers = [
        { label: "STT", key: "" },
        { label: "Tên học phần", key: "name_course" },
        { label: "Mô tả học phần", key: "describe_course" },
        { label: "Mục tiêu học phần", key: "name_plo" },
        { label: "CLO", key: "clo" }
    ];
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOptionData((prev) => ({ ...prev, [name]: Number(value) }));
        if (name === "Id_Program") {
            setOptionData((prev) => ({ ...prev, Id_Program: Number(value) }));
        }
        if (name === "Id_Key_Year_Semester") {
            setOptionData((prev) => ({ ...prev, Id_Key_Year_Semester: Number(value) }));
        }
    }
    const LoadCTDT = async () => {
        const res = await ListCTDTPermissionAPI.GetListCTDTPermission();
        const formattedData = res.map((item: any) => ({
            value: item.value,
            label: item.text,
        }));
        setSelectProgram(formattedData);
        setOptionData((prev) => ({ ...prev, Id_Program: Number(formattedData[0].value) }));
    }
    const LoadSelectStatisticalCLO = async () => {
        setLoading(true);
        const res = await StatisticalCLOCTDTAPI.LoadSelectProgramLearningOutcome({ Id_Program: Number(optionData.Id_Program) });
        const formattedKeyYear = res.keySemester.map((item: any) => ({
            value: item.id_key_year_semester,
            label: item.name_key_year_semester,
        }));
        setSelectedKeyYear(formattedKeyYear);
        setOptionData((prev) => ({ ...prev, Id_Key_Year_Semester: Number(formattedKeyYear[0].value) }));
        setLoading(false);
    }
    const LoadData = async () => {
        setLoading(true);
        const res = await StatisticalCLOCTDTAPI.GetListStatisticalCLO({ Id_Program: Number(optionData.Id_Program), id_key_semester: Number(optionData.Id_Key_Year_Semester), searchTerm: searchText });
        if (res.success) {
            setAllData(res.data);
        }
        setLoading(false);
    }
    const htmlToPlainText = (html: string | null | undefined) => {
        if (!html) return "";
    
        let text = html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<p[^>]*>/gi, "");
    
        text = text.replace(/<[^>]*>/g, "");
    
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        text = txt.value;
    
        text = text
            .replace(/\u00a0/g, " ")       
            .replace(/[ \t]+/g, " ")        
            .replace(/\n{3,}/g, "\n\n")    
            .trim();
    
        return text;
    };
    
    const exportExcel = async () => {
        if (allData.length === 0) {
            alert("Không có dữ liệu để xuất Excel!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Export ");

        worksheet.addRow([
            "STT",
            "Tên học phần",
            "Mô tả học phần",
            "Mục tiêu học phần (CO)",
            "CLO"
        ]);

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        allData.forEach((item: any, index: number) => {
            worksheet.addRow([
                index + 1,
                item.name_course,
                htmlToPlainText(item.describe_course),
                htmlToPlainText(item.mo_ta),
                htmlToPlainText(item.clo)
            ]);            
        });

        worksheet.columns.forEach((column) => {
            let maxLength = 20;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const length = cell.value ? cell.value.toString().length : 0;
                if (length > maxLength) maxLength = length;
            });
            column.width = maxLength + 3;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "Export.xlsx");
    };

    useEffect(() => {
        LoadCTDT();
    }, []);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchText(rawSearchText);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [rawSearchText]);
    useEffect(() => {
        if (optionData.Id_Program) {
            LoadSelectStatisticalCLO();
        }
    }, [optionData.Id_Program]);
    useEffect(() => {
        LoadData();
    }, [searchText]);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý thống kê mô tả và mục tiêu học phần trong chương trình đào tạo
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3 align-items-end">
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Chương trình đào tạo"
                                        name="Id_Program"
                                        value={optionData.Id_Program}
                                        onChange={handleInputChange}
                                        options={selectProgram.map((item: any) => ({
                                            value: item.value,
                                            text: item.label
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Khóa học"
                                        name="Id_Key_Year_Semester"
                                        value={optionData.Id_Key_Year_Semester}
                                        onChange={handleInputChange}
                                        options={selectedKeyYear.map((item: any) => ({
                                            value: item.value,
                                            text: item.label
                                        }))}
                                    />
                                </div>
                            </div>
                            <hr />

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-blue" onClick={LoadData} disabled={loading} >
                                        <i className="fas fa-filter mr-1" /> Lọc dữ liệu
                                    </button>
                                    <button className="btn btn-ceo-green" onClick={exportExcel} disabled={loading} >
                                        <i className="fas fa-file-excel mr-1" /> Xuất dữ liệu ra file Excel
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
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
                                {allData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-danger py-3">
                                            Không có dữ liệu thống kê CLO
                                        </td>
                                    </tr>
                                ) : (
                                    allData.map((item: any, index: number) => (
                                        <tr key={index} className="clo-row">
                                            <td className="text-center fw-bold">{index + 1}</td>

                                            <td className="fw-bold text-primary">{item.name_course}</td>

                                            <td className="clo-cell" dangerouslySetInnerHTML={{ __html: item.describe_course }} />

                                            <td className="clo-cell" dangerouslySetInnerHTML={{ __html: item.mo_ta }} />

                                            <td className="clo-cell" style={{ color: 'black', fontSize: '15px' }} dangerouslySetInnerHTML={{ __html: item.clo }} />
                                        </tr>
                                    ))
                                )}
                            </tbody>


                        </table>
                    </div>
                </div>

            </div>
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
                /* Dòng dữ liệu */
.clo-row td {
    padding: 12px 10px !important;
    vertical-align: top !important;
    border-color: #d7d7d7 !important;
    font-size: 14px !important;
}

/* Ô mô tả + CLO */
.clo-cell {
    font-size: 14px !important;
    line-height: 1.5 !important;
    color: #333 !important;
}

/* Nội dung mô tả + CLO */
.clo-cell p,
.clo-cell span,
.clo-cell strong {
    margin: 0 0 6px 0 !important;
    font-size: 14px !important;
}

/* Tên học phần */
.text-primary {
    color: #1a4fb7 !important;
}

/* Header đẹp */
.table thead th {
    background: #eef2ff !important;
    color: #1e3a8a !important;
    font-weight: 700 !important;
    text-align: center !important;
    padding: 14px 10px !important;
    border-bottom: 2px solid #b8c0ff !important;
}

                `}
            </style>
        </div>
    )
}