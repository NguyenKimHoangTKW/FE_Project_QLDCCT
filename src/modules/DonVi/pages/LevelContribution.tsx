import { useEffect, useState } from "react";
import { LevelContributionAPI } from "../../../api/DonVi/LevelContribution";
import { SweetAlert, SweetAlertDel } from "../../../components/ui/SweetAlert";
import Modal from "../../../components/ui/Modal";
import { unixTimestampToDate } from "../../../URL_Config";
import Loading from "../../../components/ui/Loading";
export default function LevelContributionInterfaceDonVi() {
    const [listLevelContribution, setListLevelContribution] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    interface FormData {
        id: number | null;
        code: string;
        description: string;
    }
    const [formData, setFormData] = useState<FormData>({
        id: null,
        code: "",
        description: "",
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const headers = [
        { label: "STT", key: "" },
        { label: "Mã mục đóng góp", key: "code" },
        { label: "Tên mục đóng góp", key: "description" },
        { label: "Ngày tạo", key: "time_cre" },
        { label: "Cập nhật lần cuối", key: "time_up" },
        { label: "*", key: "*" },
    ];
    const loadDataLevelContribution = async () => {
        setLoading(true);
        try {
            const res = await LevelContributionAPI.GetListLevelContribution();
            if (res.success) {
                setListLevelContribution(res.data);
            }
        }
        finally {
            setLoading(false);
        }

    }
    const handleAddLevelContribution = () => {
        setModalOpen(true);
        setModalMode("create");
    }
    const handleInfoLevelContribution = async (id: number) => {
        const res = await LevelContributionAPI.InfoLevelContribution({ id });
        if (res.success) {
            setModalOpen(true);
            setModalMode("edit");
            setFormData({
                id: res.data.id,
                code: res.data.code,
                description: res.data.description,
            });
        }
        else {
            SweetAlert("error", res.message);
        }
    }
    const handleSaveLevelContribution = async () => {
        if (modalMode === "create") {
            setLoading(true);
            try {
                const res = await LevelContributionAPI.CreateLevelContribution({
                    code: formData.code,
                    description: formData.description,
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataLevelContribution();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }
        }
        else {
            setLoading(true);
            try {
                const res = await LevelContributionAPI.UpdateLevelContribution({
                    id: Number(formData.id || 0),
                    code: formData.code,
                    description: formData.description,
                });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataLevelContribution();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }

        }
    }
    const handleDeleteLevelContribution = async (id: number) => {
        const confirm = await SweetAlertDel("Bằng việc đồng ý, bạn sẽ xóa mục tiêu đề này và các dữ liệu liên quan khác, bạn muốn xóa?");
        if (confirm) {
            setLoading(true);
            try {
                const res = await LevelContributionAPI.DeleteLevelContribution({ id });
                if (res.success) {
                    SweetAlert("success", res.message);
                    loadDataLevelContribution();
                }
                else {
                    SweetAlert("error", res.message);
                }
            }
            finally {
                setLoading(false);
            }
        }

    }
    useEffect(() => {
        loadDataLevelContribution();
    }, []);
    return (
        <div className="main-content">
            <Loading isOpen={loading} />
            <div className="card">
                <div className="card-body">
                    <div className="page-header no-gutters">
                        <h2 className="text-uppercase">
                            Quản lý Danh sách dạng câu hỏi cho đề cương học phần
                        </h2>
                        <hr />
                        <fieldset className="border rounded-3 p-3">
                            <legend className="float-none w-auto px-3">Chức năng</legend>

                            <div className="row">
                                <div className="col-12 d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                    <button className="btn btn-primary" onClick={handleAddLevelContribution}>
                                        <i className="fas fa-save mr-1" /> Thêm mới
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="card mt-3">
                        <div className="card-body">
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
                                        {listLevelContribution.length > 0 ? (
                                            listLevelContribution.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className="formatSo">{index + 1}</td>
                                                    <td className="formatSo">{item.code}</td>
                                                    <td>{item.description}</td>
                                                    <td className="formatSo">{unixTimestampToDate(item.time_cre)}</td>
                                                    <td className="formatSo">{unixTimestampToDate(item.time_up)}</td>
                                                    <td className="text-center align-middle">
                                                        <div className="d-flex justify-content-center flex-wrap gap-3">
                                                            <button className="btn btn-sm btn-primary" onClick={() => handleInfoLevelContribution(item.id)}>
                                                                <i className="anticon anticon-edit me-1" /> Sửa
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteLevelContribution(item.id)}>
                                                                <i className="anticon anticon-delete me-1" /> Xóa
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={headers.length}
                                                    className="text-center text-danger">
                                                    Không có dữ liệu
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalOpen}
                title={modalMode === "create" ? "Tạo mới mức độ đóng góp" : "Chỉnh sửa mức độ đóng góp"}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveLevelContribution}
            >
                <form id="modal-body" autoComplete="off">
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Mã mục đóng góp</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="code" value={formData.code ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Nội dung mục đóng góp</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" name="description" value={formData.description ?? ""} onChange={handleInputChange} />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
