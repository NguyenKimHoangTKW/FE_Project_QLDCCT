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
        const res = await StatisticalCLOCTDTAPI.GetListStatisticalCLO({ Id_Program: Number(optionData.Id_Program), id_key_semester: Number(optionData.Id_Key_Year_Semester) });
        if (res.success) {
            setAllData(res.data);
        }
        setLoading(false);
    }
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
                item.describe_course?.replace(/<[^>]+>/g, ""),
                item.mo_ta?.replace(/<[^>]+>/g, ""),
                item.clo?.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "")
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
        if (optionData.Id_Program) {
            LoadSelectStatisticalCLO();
        }
    }, [optionData.Id_Program]);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Chuẩn đầu ra chương trình đào tạo
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
                                        <td colSpan={headers.length} className="text-center text-danger">
                                            Không có dữ liệu thống kê CLO cho CTDT này
                                        </td>
                                    </tr>
                                ) : (
                                    allData.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{item.name_course}</td>
                                            <td dangerouslySetInnerHTML={{ __html: item.describe_course || "" }} />
                                            <td dangerouslySetInnerHTML={{ __html: item.mo_ta || "" }} />
                                            <td dangerouslySetInnerHTML={{ __html: item.clo || "" }} />
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </div>
    )
}