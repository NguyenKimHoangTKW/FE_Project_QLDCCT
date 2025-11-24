import { useEffect, useState } from "react";
import { ContributionMatrixAPI } from "../../../api/DonVi/ContributionMatrix";
import { SweetAlert } from "../../../components/ui/SweetAlert";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Loading from "../../../components/ui/Loading";
export default function ContributionMatrixInterfaceDonVi() {
    const [listCtdt, setListCtdt] = useState<any[]>([]);
    const [listKeyYear, setListKeyYear] = useState<any[]>([]);
    const [listPLoPi, setListPLoPi] = useState<any[]>([]);
    const [listCourse, setListCourse] = useState<any[]>([]);
    const [listMatrixContribution, setListMatrixContribution] = useState<any[]>([]);
    const [listLevelContribution, setListLevelContribution] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const GetListCourse = async () => {
        const res = await ContributionMatrixAPI.GetListCourse({ id_key_year_semester: Number(formData.id_key_year_semester), id_program: Number(formData.id_program) });
        if (res.success) {
            setListCourse(res.data);
        } else {
            setListCourse([]);
        }
    }
    interface FormData {
        id_program: number | null;
        id_key_year_semester: number | null;
    }
    const [formData, setFormData] = useState<FormData>({
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
    const GetListMatrixContribution = async () => {
        const res = await ContributionMatrixAPI.GetListMatrixContribution({ id_key_year_semester: Number(formData.id_key_year_semester), id_program: Number(formData.id_program) });
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
            const res = await ContributionMatrixAPI.GetOptionContributionMatrix();
            setListCtdt(res.ctdt);
            setFormData((prev) => ({ ...prev, id_program: Number(res.ctdt[0].id_program) }));
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
            const res = await ContributionMatrixAPI.LoadPLoPi({ Id_Program: Number(formData.id_program) });
            setListPLoPi(res);
        }
        finally {
            setLoading(false);
        }
    }
    const handleFilterData = async () => {
        await GetListPLoPi();
        await GetListCourse();
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

    const handleSaveMatrix = async () => {
        if (!headerPiOrder.length) {
            SweetAlert("error", "Thiếu cấu hình PLO/PI để lưu.");
            return;
        }

        const payload: any[] = [];

        listMatrixContribution.forEach((course: any) => {
            const piMap = new Map<number, any>((course.pi || []).map((p: any) => [Number(p.id_PI), p]));
            headerPiOrder.forEach((h) => {
                const level = Number(piMap.get(h.id_PI)?.id_level ?? 0);
                payload.push({
                    id_course: course.id_course,
                    Id_PI: h.id_PI,
                    id_levelcontributon: level,
                });
            });
        });
        setLoading(true);
        try {
            const res = await ContributionMatrixAPI.SaveMatrix(payload as any);
            if (res.success) {
                SweetAlert("success", res.message || "Lưu thành công");
            } else {
                SweetAlert("error", res.message || "Lưu thất bại");
            }
        }
        finally {
            setLoading(false);
        }
    };
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
        GetListOptionContributionMatrix();
    }, []);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách Khóa học thuộc Đơn vị
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo CTĐT</label>
                                    <select className="form-control" name="id_program" value={formData.id_program ?? ""} onChange={handleInputChange}>
                                        {listCtdt.map((items, idx) => (
                                            <option key={idx} value={items.id_program}>
                                                {items.name_program}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Lọc theo Khóa học</label>
                                    <select className="form-control" name="id_key_year_semester" value={formData.id_key_year_semester ?? ""} onChange={handleInputChange}>
                                        {listKeyYear.map((items, idx) => (
                                            <option key={idx} value={items.id_key_year_semester}>
                                                {items.name_key}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                {listLevelContribution.length > 0 && (
                                    <div className="col-12" style={{ textAlign: "center" }}>
                                        <h5>Danh sách mức độ đóng góp</h5>
                                    </div>
                                )}
                                {listLevelContribution.length > 0 && (
                                    <div className="col-12">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Mã mức độ đóng góp</th>
                                                    <th>Tên mức độ đóng góp</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listLevelContribution.map((item: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>{item.code}</td>
                                                        <td>{item.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-ceo-butterfly" onClick={handleSaveMatrix}>
                                        <i className="fas fa-save mr-1" /> Lưu ma trận đóng góp
                                    </button>
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
                                                    const existing = (courseItem.pi || []).find((p: any) => Number(p.id_PI) === h.id_PI);
                                                    const currentLevel = existing?.id_level ?? 0;

                                                    return (
                                                        <td key={`pi-${idx}-${cIdx}-${piIdx}`} className="text-center">
                                                            <select
                                                                className="form-select form-select-sm p-0 text-center"
                                                                style={{ fontSize: "12px", minWidth: "65px", height: "28px" }}
                                                                value={currentLevel}
                                                                onChange={(e) => {
                                                                    const newLevel = Number(e.target.value);
                                                                    setListMatrixContribution((prev) =>
                                                                        prev.map((c: any) => {
                                                                            if (c.id_course !== courseItem.id_course) return c;

                                                                            const hasPi = (c.pi || []).some((p: any) => Number(p.id_PI) === h.id_PI);
                                                                            const newPiArr = hasPi
                                                                                ? c.pi.map((p: any) =>
                                                                                    Number(p.id_PI) === h.id_PI ? { ...p, id_level: newLevel } : p
                                                                                )
                                                                                : [...(c.pi || []), { id_PI: h.id_PI, id_level: newLevel }];

                                                                            return { ...c, pi: newPiArr };
                                                                        })
                                                                    );
                                                                }}
                                                            >
                                                                <option value={0}>--</option>
                                                                {listLevelContribution.map((lv: any) => (
                                                                    <option key={lv.id} value={lv.id}>
                                                                        {lv.Code ?? lv.code}
                                                                    </option>
                                                                ))}
                                                            </select>
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
                <div className="col-md-4">
                    <label className="ceo-label">Tìm kiếm</label>
                    <input
                        type="text"
                        className="form-control ceo-input"
                        placeholder="🔍 Nhập từ khóa bất kỳ để tìm..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-lg px-4"
                    onClick={handleExportExcel}
                    style={{
                        background: "linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9))",
                        color: "#fff",
                        fontWeight: 300,
                        borderRadius: "14px",
                        boxShadow: "0 4px 14px rgba(168, 85, 247, 0.5)"
                    }}
                >
                    📝  Xuất dữ liệu ra file Excel
                </button>
            </div>
        </div>
    )
}