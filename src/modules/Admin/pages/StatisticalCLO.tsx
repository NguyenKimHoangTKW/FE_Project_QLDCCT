import { useState, useEffect } from "react";
import Loading from "../../../components/ui/Loading";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import { StatisticalCLOAdminAPI } from "../../../api/Admin/StatisticalCLO";
export default function StatisticalCLOInterfaceAdmin() {
    const [loading, setLoading] = useState(false);
    const [allData, setAllData] = useState<any[]>([]);
    const [listDonVi, setListDonVi] = useState<any[]>([]);
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [selectedKeyYear, setSelectedKeyYear] = useState<any[]>([]);
    interface OptionFilter {
        id_program: number;
        id_key_year_semester: number;
        id_faculty: number;
    }
    const [optionFilter, setOptionFilter] = useState<OptionFilter>({
        id_program: 0,
        id_key_year_semester: 0,
        id_faculty: 0,
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
        setOptionFilter((prev) => ({ ...prev, [name]: Number(value) }));
        if (name === "id_faculty") {
            setOptionFilter((prev) => ({ ...prev, id_faculty: Number(value) }));
        }
        if (name === "id_program") {
            setOptionFilter((prev) => ({ ...prev, id_program: Number(value) }));
        }
        if (name === "id_key_year_semester") {
            setOptionFilter((prev) => ({ ...prev, id_key_year_semester: Number(value) }));
        }
    }
    const GetListDonVi = async () => {
        const res = await StatisticalCLOAdminAPI.GetListDonVi();
        if (res.success) {
            setListDonVi(res.data);
            setOptionFilter((prev) => ({ ...prev, id_faculty: Number(res.data[0].id_faculty) }));
        }
        else {
            setListDonVi([]);
        }
    }
    const GetListCTDTByDonVi = async () => {
        const res = await StatisticalCLOAdminAPI.GetListCTDTByDonVi({ id_faculty: Number(optionFilter.id_faculty) });
        if (res.success) {
            setListCTDT(res.data);
        }
        else {
            setListCTDT([]);
        }
    }

    const LoadSelectStatisticalCLO = async () => {
        setLoading(true);
        const res = await StatisticalCLOAdminAPI.LoadSelectProgramLearningOutcome({ id_faculty: Number(optionFilter.id_faculty) });
        const formattedKeyYear = res.keySemester.map((item: any) => ({
            value: item.id_key_year_semester,
            label: item.name_key_year_semester,
        }));
        setSelectedKeyYear(formattedKeyYear);
        setLoading(false);
    }
    const LoadData = async () => {
        setLoading(true);
        const res = await StatisticalCLOAdminAPI.GetListStatisticalCLO({ id_faculty: Number(optionFilter.id_faculty), id_program: Number(optionFilter.id_program), id_key_semester: Number(optionFilter.id_key_year_semester) });
        if (res.success) {
            setAllData(res.data);
            SweetAlert("success", res.message);
        }
        setLoading(false);
    }
    const htmlToPlainText = (html: string | null | undefined) => {
        if (!html) return "";
    
        // Giữ xuống dòng
        let text = html.replace(/<br\s*\/?>/gi, "\n")
                       .replace(/<\/p>/gi, "\n");
    
        // Xóa toàn bộ thẻ HTML
        text = text.replace(/<[^>]*>/g, "");
    
        // Decode HTML Entities → Text Unicode
        const txt = document.createElement("textarea");
        txt.innerHTML = text;
        text = txt.value;
    
        // Loại bỏ ký tự thừa
        text = text.replace(/\u00a0/g, " "); // nbsp
        text = text.replace(/\s+/g, " ").trim();
    
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
        GetListDonVi();
    }, []);
    useEffect(() => {
        if (optionFilter.id_faculty) {
            GetListCTDTByDonVi();
            LoadSelectStatisticalCLO();
        }
    }, [optionFilter.id_faculty]);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                          Quản lý thống kê mô tả và mục tiêu học phần toàn trường
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3 align-items-end">
                            <div className="col-md-4">
                                    <CeoSelect2
                                        label="Đơn vị"
                                        name="id_faculty"
                                        value={optionFilter.id_faculty}
                                        onChange={handleInputChange}
                                        options={listDonVi.map((item: any) => ({
                                            value: item.id_faculty,
                                            text: item.name_faculty
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Chương trình đào tạo"
                                        name="id_program"
                                        value={optionFilter.id_program}
                                        onChange={handleInputChange}
                                        options={listCTDT.map((item: any) => ({
                                            value: item.id_program,
                                            text: item.name_program
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Khóa học"
                                        name="Id_Key_Year_Semester"
                                        value={optionFilter.id_key_year_semester}
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

                                            <td className="clo-cell" style={{color: 'black', fontSize: '15px'}} dangerouslySetInnerHTML={{ __html: item.clo }} />
                                        </tr>
                                    ))
                                )}
                            </tbody>


                        </table>
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