import { useEffect, useState } from "react";
import { ContributionMatrixAPI } from "../../../api/DonVi/ContributionMatrix";
import { SweetAlert } from "../../../components/ui/SweetAlert";

export default function ContributionMatrixInterfaceDonVi() {
    const [listCtdt, setListCtdt] = useState<any[]>([]);
    const [listKeyYear, setListKeyYear] = useState<any[]>([]);
    const [listPLoPi, setListPLoPi] = useState<any[]>([]);
    const [listCourse, setListCourse] = useState<any[]>([]);
    const [listMatrixContribution, setListMatrixContribution] = useState<any[]>([]);
    const [listLevelContribution, setListLevelContribution] = useState<any[]>([]);
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
        const res = await ContributionMatrixAPI.GetOptionContributionMatrix();
        setListCtdt(res.ctdt);
        setFormData((prev) => ({ ...prev, id_program: Number(res.ctdt[0].id_program) }));
        setListKeyYear(res.key_year);
        setFormData((prev) => ({ ...prev, id_key_year_semester: Number(res.key_year[0].id_key_year_semester) }));
    }
    const GetListPLoPi = async () => {
        const res = await ContributionMatrixAPI.LoadPLoPi({ Id_Program: Number(formData.id_program) });
        setListPLoPi(res);
    }
    const handleFilterData = async () => {
        await GetListPLoPi();
        await GetListCourse();
        await GetListMatrixContribution();
    }
    const handleSaveMatrix = async () => {
        const payload: any[] = [];

        listMatrixContribution.forEach((course) => {
            course.pi.forEach((pi: any) => {
                payload.push({
                    id_course: course.id_course,
                    Id_PI: pi.id_PI,
                    id_levelcontributon: Number(pi.id_level) || 0,
                });
            });
        });

        const res = await ContributionMatrixAPI.SaveMatrix(payload as any);
        if (res.success) {
            SweetAlert("success", res.message);
        } else {
            SweetAlert("error", res.message);
        }
    };

    useEffect(() => {
        GetListOptionContributionMatrix();
    }, []);
    return (
        <div className="main-content">
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

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-primary" onClick={handleFilterData}>
                                        <i className="fas fa-plus-circle mr-1" /> Lọc dữ liệu
                                    </button>
                                    <button className="btn btn-success" onClick={handleSaveMatrix}>
                                        <i className="fas fa-save mr-1" /> Lưu dữ liệu
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th rowSpan={2}>Mã môn học</th>
                                    <th rowSpan={2}>Tên môn học</th>
                                    <th rowSpan={2}>Số tín chỉ</th>
                                    <th rowSpan={2}>Số tiết lý thuyết</th>
                                    <th rowSpan={2}>Số tiết thực hành</th>
                                    {listPLoPi.map((plo, i) => {
                                        const span = (plo?.pi?.length ?? 0) || plo?.count_pi || 1;
                                        return (
                                            <th key={`plo-${i}`} colSpan={span} className="text-center align-middle">
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
                            </thead>
                            <tbody>
                                {Object.entries(
                                    listMatrixContribution.reduce((acc: any, c: any) => {
                                        const key = c.name_se || "Không xác định";
                                        if (!acc[key]) acc[key] = [];
                                        acc[key].push(c);
                                        return acc;
                                    }, {})
                                ).map(([semesterName, courses]: any, idx: number) => {
                                    const totalCols =
                                        5 +
                                        listPLoPi.reduce(
                                            (sum, plo) => sum + ((plo?.pi?.length ?? 0) || plo?.count_pi || 1),
                                            0
                                        );

                                    return [
                                        // 🔹 Dòng header học kỳ
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

                                                {courseItem.pi.map((piItem: any, piIdx: number) => (
                                                    <td key={`pi-${idx}-${cIdx}-${piIdx}`} className="text-center">
                                                        <select
                                                            className="form-select form-select-sm p-0 text-center"
                                                            style={{
                                                                fontSize: "12px",
                                                                minWidth: "65px",
                                                                height: "28px",
                                                            }}
                                                            value={piItem.id_level ?? 0}
                                                            onChange={(e) => {
                                                                const newLevel = Number(e.target.value);
                                                                setListMatrixContribution((prev) =>
                                                                    prev.map((c) =>
                                                                        c.id_course === courseItem.id_course
                                                                            ? {
                                                                                ...c,
                                                                                pi: c.pi.map((p: any) =>
                                                                                    p.id_PI === piItem.id_PI
                                                                                        ? { ...p, id_level: newLevel }
                                                                                        : p
                                                                                ),
                                                                            }
                                                                            : c
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            <option value={0}>--</option>
                                                            {listLevelContribution.map((lv) => (
                                                                <option key={lv.id} value={lv.id}>
                                                                    {lv.Code ?? lv.code}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                ))}
                                            </tr>
                                        )),
                                    ];
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>
                {`
.table-responsive {
  max-height: 600px; /* hoặc chiều cao bạn muốn cho vùng scroll */
  overflow: auto;
  position: relative;
}

/* Giữ nguyên toàn bộ cụm thead (2 hàng) khi scroll */
.table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.table thead th {
  background-color: #f8f9fa; /* nền sáng cho header */
  border-bottom: 1px solid #dee2e6;
}

/* Optional: thêm bóng nhẹ khi scroll xuống để header nhìn nổi */
.table-responsive:has(tbody) thead {
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

/* Thanh cuộn tinh gọn hơn */
.table-responsive::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.table-responsive::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
`}
            </style>

        </div>
    )
}