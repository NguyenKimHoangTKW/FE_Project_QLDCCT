import { useEffect, useState } from "react";
import { NotificationGVDCAPI } from "../../../api/GVDeCuong/Notification";
import { unixTimestampToDate } from "../../../URL_Config";

export default function ViewAllNotificationGVDeCuong() {
    const [notificationList, setNotificationList] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const ShowNotification = async () => {
        const res = await NotificationGVDCAPI.GetAllNotification({ Page: page, PageSize: pageSize });
        if (res.success) {
            setNotificationList(res.getList);
            setPage(Number(res.currentPage) || 1);
            setTotalPages(Number(res.totalPages) || 1);
            setTotalRecords(Number(res.totalRecords) || 0);
            setPageSize(Number(res.pageSize) || 10);
        } else {
            setNotificationList([]);
            setPage(1);
            setPageSize(10);
            setTotalPages(1);
            setTotalRecords(0);
        }
    };
    const emitNotificationReload = () => {
        const now = Date.now().toString();
        localStorage.setItem("notification_reload", now); 
        window.dispatchEvent(new Event("notification_reload")); 
    };
    const ReadNotificationTrue = async (id: number) => {
        const res = await NotificationGVDCAPI.ReadNotificationTrue({ id_notification: id });
        if (res.success) {
            ShowNotification();
            emitNotificationReload();
        }
    };
    
    const ReadNotificationFalse = async (id: number) => {
        const res = await NotificationGVDCAPI.ReadNotificationFalse({ id_notification: id });
        if (res.success) {
            ShowNotification();
            emitNotificationReload();
        }
    };
    
    const DeleteNotification = async (id: number) => {
        const res = await NotificationGVDCAPI.DeleteNotification({ id_notification: id });
        if (res.success) {
            ShowNotification();
            emitNotificationReload();
        }
    };
    
    const UpdateAllNotificationFalse = async () => {
        const res = await NotificationGVDCAPI.UpdateAllNotificationFalse();
        if (res.success) {
            ShowNotification();
            emitNotificationReload();
        }
    };
    const UpdateAllNotificationTrue = async () => {
        const res = await NotificationGVDCAPI.UpdateAllNotificationTrue();
        if (res.success) {
            ShowNotification();
            emitNotificationReload();
        }
    };
    
    const DeleteAllNotification = async () => {
        const res = await NotificationGVDCAPI.DeleteAllNotification();
        if (res.success) {
            ShowNotification();
            emitNotificationReload();
        }
    };

    const getColorByType = (type: string) => {
        switch (type) {
            case "request_edit_syllabus": return "#3b82f6";
            case "permission_write_course_syllabus": return "#6366f1";
            case "approve_syllabus": return "#22c55e";
            case "refund_syllabus": return "#fb923c";
            case "remove_write_course_syllabus": return "#ef4444";
            case "accept_permission_syllabus": return "#2563eb";
            case "cancer_request_syllabus": return "#ef4444";
            case "remove_permission_syllabus": return "#facc15";
            default: return "#94a3b8";
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "approve_syllabus": return "anticon-check-circle";
            case "refund_syllabus": return "anticon-warning";
            case "remove_write_course_syllabus": return "anticon-delete";
            case "request_edit_syllabus": return "anticon-edit";
            case "permission_write_course_syllabus": return "anticon-user-add";
            default: return "anticon-bell";
        }
    };

    useEffect(() => {
        ShowNotification();
    }, []);

    return (
        <div className="main-content">
            <div className="card">
                <div className="card-body">

                    <div className="page-header no-gutters d-flex justify-content-between align-items-center">
                        <h2 className="text-uppercase">Tất cả thông báo</h2>

                        <div>
                            <button className="btn btn-ceo-blue m-r-10"
                                onClick={UpdateAllNotificationFalse}>
                                ✓ Đánh dấu tất cả đã đọc
                            </button>
                            <button className="btn btn-ceo-yellow m-r-10"
                                onClick={UpdateAllNotificationTrue}>
                                ◇ Đánh dấu tất cả chưa đọc
                            </button>
                            <button className="btn btn-ceo-red"
                                onClick={DeleteAllNotification}>
                                🗑 Xóa tất cả
                            </button>
                        </div>
                    </div>

                    <hr />
                    <div className="table-responsive">


                        {notificationList.length > 0 && notificationList.map((item: any, index: number) => {
                            const isRead = item.is_read === true;

                            return (
                                <div
                                    key={index}
                                    className="p-20 m-b-15 border rounded cursor-pointer shadow-sm"
                                    style={{
                                        borderLeft: `6px solid ${getColorByType(item.type)}`,
                                        background: isRead ? "#f9fafb" : "#eef4ff",
                                        opacity: isRead ? 0.7 : 1,
                                        transition: "0.2s"
                                    }}
                                    onClick={() => {
                                        if (item.link) window.location.href = item.link;
                                        ReadNotificationTrue(item.id_notification);
                                    }}
                                >

                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex">
                                            <div className="avatar avatar-blue avatar-icon m-r-15">
                                                <i className={`anticon ${getIcon(item.type)}`} />
                                            </div>

                                            <div>
                                                <h4 className="m-b-5" style={{ fontWeight: isRead ? 500 : 700 }}>
                                                    {item.title}
                                                </h4>

                                                <p className="text-muted m-b-5" style={{ maxWidth: 600 }}>
                                                    {item.message}
                                                </p>

                                                <small className="text-muted">
                                                    {unixTimestampToDate(item.create_time)}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="text-right">

                                            {!isRead && (
                                                <button
                                                    className="btn btn-sm btn-primary m-b-5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        ReadNotificationTrue(item.id_notification);
                                                    }}
                                                >
                                                    ✓ Đã đọc
                                                </button>
                                            )}

                                            {isRead && (
                                                <button
                                                    className="btn btn-sm btn-warning m-b-5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        ReadNotificationFalse(item.id_notification);
                                                    }}
                                                >
                                                    ◇ Chưa đọc
                                                </button>
                                            )}

                                            <br />

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    DeleteNotification(item.id_notification);
                                                }}
                                            >
                                                🗑 Xóa
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}
                        {notificationList.length === 0 && (
                            <p className="text-muted text-center m-t-20">Không có thông báo</p>
                        )}
                    </div>
                    <div className="ceo-pagination mt-3">
                        <div className="ceo-pagination-info">
                            Tổng số: {totalRecords} bản ghi | Trang {page}/{totalPages}
                        </div>

                        <div className="ceo-pagination-actions">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                            >
                                ← Trang trước
                            </button>
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Trang sau →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
