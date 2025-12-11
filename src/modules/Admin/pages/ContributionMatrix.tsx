import { useEffect, useState } from "react";
import { ContributionMatrixAPI } from "../../../api/DonVi/ContributionMatrix";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Loading from "../../../components/ui/Loading";
import CeoSelect2 from "../../../components/ui/CeoSelect2";
import { ContributionMatrixAdminAPI } from "../../../api/Admin/ContributionMatrix";
export default function ContributionMatrixInterfaceAdmin() {
    const [listKeyYear, setListKeyYear] = useState<any[]>([]);
    const [listPLoPi, setListPLoPi] = useState<any[]>([]);
    const [listMatrixContribution, setListMatrixContribution] = useState<any[]>([]);
    const [listLevelContribution, setListLevelContribution] = useState<any[]>([]);
    const [listDonVi, setListDonVi] = useState<any[]>([]);
    const [listCTDT, setListCTDT] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    interface FormData {
        id_faculty: number | null;
        id_program: number | null;
        id_key_year_semester: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
        id_faculty: null,
        id_program: null,
        id_key_year_semester: null,
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "id_program") {
            setFormData((prev) => ({ ...prev, id_program: Number(value) }));
        }
        if (name === "id_key_year") {
            setFormData((prev) => ({ ...prev, id_key_year_semester: Number(value) }));
        }
    }
    const GetListDonVi = async () => {
        const res = await ContributionMatrixAdminAPI.GetListDonVi();
        if (res.success) {
            setListDonVi(res.data);
        }
        else {
            setListDonVi([]);
        }
    }
    const GetListCTDTByDonVi = async () => {
        const res = await ContributionMatrixAdminAPI.GetListCTDTByDonVi({ id_faculty: Number(formData.id_faculty) });
        if (res.success) {
            setListCTDT(res.data);
        }
        else {
            setListCTDT([]);
        }
    }

    const GetListMatrixContribution = async () => {
        const res = await ContributionMatrixAdminAPI.GetListMatrixContribution({ id_faculty: Number(formData.id_faculty), id_key_year_semester: Number(formData.id_key_year_semester), id_program: Number(formData.id_program) });
        if (res.success) {
            setListMatrixContribution(res.data);
            setListLevelContribution(res.levels);
        } else {
            setListMatrixContribution([]);
        }
    }
    const GetListOptionContributionMatrix = async () => {
        setLoading(true);
        try {
            const res = await ContributionMatrixAdminAPI.GetOptionContributionMatrix({ id_faculty: Number(formData.id_faculty) });
           
            setListKeyYear(res.key_year);
            setFormData((prev) => ({ ...prev, id_key_year_semester: Number(res.key_year[0].id_key_year_semester) }));
        }
        finally {
            setLoading(false);
        }

    }
    const GetListPLoPi = async () => {
        setLoading(true);
        try {
            const res = await ContributionMatrixAdminAPI.LoadPLoPi({ Id_Program: Number(formData.id_program), id_key_semester: Number(formData.id_key_year_semester) });
            setListPLoPi(res);
        }
        finally {
            setLoading(false);
        }
    }
    const handleFilterData = async () => {
        await GetListPLoPi();
        await GetListMatrixContribution();
        SweetAlert("success", "Lọc dữ liệu thành công");
    }
    const filteredCourseList = listMatrixContribution.filter((courseItem: any) => {
        if (!searchText.trim()) return true;

        const keyword = searchText.toLowerCase();

        return (
            courseItem.code_course?.toLowerCase().includes(keyword) ||
            courseItem.name_course?.toLowerCase().includes(keyword) ||
            courseItem.credits?.toString().includes(keyword) ||
            courseItem.totalTheory?.toString().includes(keyword) ||
            courseItem.totalPractice?.toString().includes(keyword)
        );
    });
    const grouped = Object.entries(
        filteredCourseList.reduce((acc: any, c: any) => {
            const key = c.name_se || "Không xác định";
            if (!acc[key]) acc[key] = [];
            acc[key].push(c);
            return acc;
        }, {})
    );

    const handleExportExcel = () => {
        setLoading(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("ContributionMatrix");

            // ====== 1. HEADER GỐC (5 CỘT ĐẦU) ======
            const headerRow1: string[] = [
                "Mã môn học",
                "Tên môn học",
                "Số tín chỉ",
                "Số tiết lý thuyết",
                "Số tiết thực hành",
            ];

            const headerRow2: string[] = ["", "", "", "", ""]; // để merge 5 cột đầu

            // ====== 2. HEADER PLO/PI ======
            listPLoPi.forEach((plo: any) => {
                const piList = plo?.pi ?? [];
                const span = piList.length || plo.count_pi || 1;

                // Dòng 1: ghi PLO + thêm ô trống cho merge
                headerRow1.push(plo.code_plo);
                for (let i = 1; i < span; i++) headerRow1.push("");

                // Dòng 2: ghi các mã PI
                piList.forEach((pi: any) => {
                    headerRow2.push(pi.code);
                });
            });

            // Thêm 2 dòng vào Excel
            const row1 = worksheet.addRow(headerRow1);
            const row2 = worksheet.addRow(headerRow2);

            // ====== 3. MERGE HEADER ======

            // ₋ Gộp dọc 5 cột đầu tiên
            for (let col = 1; col <= 5; col++) {
                worksheet.mergeCells(row1.number, col, row2.number, col);
            }

            // ₋ Gộp ngang các PLO theo số lượng PI
            let startCol = 6;
            listPLoPi.forEach((plo: any) => {
                const piList = plo?.pi ?? [];
                const span = piList.length || plo.count_pi || 1;
                const endCol = startCol + span - 1;

                worksheet.mergeCells(row1.number, startCol, row1.number, endCol);

                startCol = endCol + 1;
            });

            // ====== 4. ĐỔ DATA THEO GROUP ======
            grouped.forEach(([semesterName, courses]: any) => {
                // Thêm dòng tiêu đề học kỳ
                const semRow = worksheet.addRow([semesterName]);
                semRow.font = { bold: true };
                worksheet.mergeCells(
                    semRow.number,
                    1,
                    semRow.number,
                    headerRow2.length
                );

                // Dòng chi tiết môn học
                courses.forEach((course: any) => {
                    const row = [
                        course.code_course,
                        course.name_course,
                        course.credits,
                        course.totalTheory,
                        course.totalPractice,
                    ];

                    // Thêm dữ liệu PI
                    headerPiOrder.forEach((h) => {
                        const existing = (course.pi || []).find(
                            (p: any) => Number(p.id_PI) === h.id_PI
                        );
                        row.push(existing?.level_code ?? existing?.id_level ?? 0);
                    });

                    worksheet.addRow(row);
                });
            });

            // ====== 5. AUTO WIDTH ======
            worksheet.columns.forEach((col) => {
                let maxLength = 12;
                col.eachCell?.((cell) => {
                    const cellValue = cell.value ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, cellValue.length + 2);
                });
                col.width = maxLength;
            });

            // ====== 6. EXPORT FILE ======
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), `Export_Matrix.xlsx`);
            });
        }
        finally {
            setLoading(false);
        }
    };


    const headerPiOrder: { id_PI: number; code: string }[] = (listPLoPi || [])
        .flatMap((plo: any) => (plo?.pi ?? []).map((pi: any) => ({
            id_PI: Number(pi.id_PI),
            code: pi.code,
        })));
    useEffect(() => {
        GetListDonVi();
    }, []);
    useEffect(() => {
        if (formData.id_faculty) {
            GetListCTDTByDonVi();
            GetListOptionContributionMatrix();

        }
    }, [formData.id_faculty]);

    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Ma trận đóng góp của chương trình đào tạo toàn trường
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Lọc theo CTĐT"
                                        name="id_faculty"
                                        value={formData.id_faculty}
                                        onChange={handleInputChange}
                                        options={listDonVi.map(item => ({
                                            value: item.id_faculty,
                                            text: item.name_faculty
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Lọc theo CTĐT"
                                        name="id_program"
                                        value={formData.id_program}
                                        onChange={handleInputChange}
                                        options={listCTDT.map(item => ({
                                            value: item.id_program,
                                            text: item.name_program
                                        }))}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <CeoSelect2
                                        label="Lọc theo Khóa học"
                                        name="id_key_year_semester"
                                        value={formData.id_key_year_semester}
                                        onChange={handleInputChange}
                                        options={listKeyYear.map(item => ({
                                            value: item.id_key_year_semester,
                                            text: item.name_key
                                        }))}
                                    />
                                </div>
                            </div>
                           
                            <hr />
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-blue" onClick={handleFilterData}>
                                        <i className="fas fa-filter mr-1" /> Lọc dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                {listMatrixContribution.length > 0 && listPLoPi.length > 0 ? (
                                    <>
                                        <tr>
                                            <th rowSpan={2}>Mã môn học</th>
                                            <th rowSpan={2}>Tên môn học</th>
                                            <th rowSpan={2}>Số tín chỉ</th>
                                            <th rowSpan={2}>Số tiết lý thuyết</th>
                                            <th rowSpan={2}>Số tiết thực hành</th>
                                            {listPLoPi.map((plo, i) => {
                                                const span = (plo?.pi?.length ?? 0) || plo?.count_pi || 1;
                                                return (
                                                    <th
                                                        key={`plo-${i}`}
                                                        colSpan={span}
                                                        className="text-center align-middle"
                                                    >
                                                        {plo.code_plo}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            {listPLoPi.map((plo, i) =>
                                                (plo?.pi ?? []).map((piItem: any, j: number) => (
                                                    <th key={`pi-${i}-${j}`} className="text-center">
                                                        {piItem.code}
                                                    </th>
                                                ))
                                            )}
                                        </tr>
                                    </>
                                ) : (
                                    <tr>
                                        <th className="text-center" colSpan={5}>
                                            Chưa có dữ liệu môn học cho chương trình này
                                        </th>
                                    </tr>

                                )}
                            </thead>
                            <tbody>
                                {grouped.map(([semesterName, courses]: any, idx: number) => {
                                    if (courses.length === 0) return null;

                                    const totalCols =
                                        5 +
                                        listPLoPi.reduce(
                                            (sum, plo) => sum + ((plo?.pi?.length ?? 0) || plo?.count_pi || 1),
                                            0
                                        );

                                        return [
                                            <tr key={`semester-${idx}`} className="table-secondary">
                                                <td colSpan={totalCols} className="fw-bold text-start">
                                                    {semesterName}
                                                </td>
                                            </tr>,
                                            ...courses.map((courseItem: any, cIdx: number) => (
                                                <tr key={`course-${idx}-${cIdx}`}>
                                                    <td>{courseItem.code_course}</td>
                                                    <td>{courseItem.name_course}</td>
                                                    <td className="text-center">{courseItem.credits}</td>
                                                    <td className="text-center">{courseItem.totalTheory}</td>
                                                    <td className="text-center">{courseItem.totalPractice}</td>
                                        
                                                    {headerPiOrder.map((h, piIdx) => {
                                                        const existing = (courseItem.pi || []).find(
                                                            (p: any) => Number(p.id_PI) === h.id_PI
                                                        );
                                        
                                                        // 🟦 Hiển thị CODE — nếu có
                                                        const levelCode =
                                                            existing?.Code ??
                                                            existing?.code ??
                                                            existing?.level_code ??
                                                            "--";
                                        
                                                        return (
                                                            <td
                                                                key={`pi-${idx}-${cIdx}-${piIdx}`}
                                                                className="text-center fw-bold"
                                                                style={{ color: "#0077c2" }}
                                                            >
                                                                {levelCode}
                                                            </td>
                                                        );
                                                    })}
                                        
                                                </tr>
                                            )),
                                        ];
                                        
                                })}
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
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                borderLeft: "none",
                                borderRadius: "0 10px 10px 0",
                                padding: "10px 12px",
                            }}
                        />
                    </div>
                </div>

                {/* Nút Export */}
                <button
                    className="btn btn-lg px-4"
                    onClick={handleExportExcel}
                    style={{
                        background:
                            "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                        color: "#fff",
                        fontWeight: 600,
                        letterSpacing: "0.2px",
                        borderRadius: "12px",
                        padding: "10px 22px",
                        boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
                        border: "none",
                        transition: "0.25s",
                        marginTop: "27px"
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                    }
                >
                    📝 Xuất Excel
                </button>

            </div>

        </div>
    )
}