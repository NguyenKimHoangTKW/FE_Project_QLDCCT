import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NotificationGVDCAPI } from "../../../api/GVDeCuong/Notification";
import { unixTimestampToDate } from "../../../URL_Config";

function GVDeCuongHeaderLayout() {
  const [notifyCount, setNotifyCount] = useState(0);
  const [notifyList, setNotifyList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDropdownOpen((prev) => !prev);

    // Khi mở dropdown → tự load danh sách
    if (!isDropdownOpen) {
      loadList();
    }
  };

  const loadCount = async () => {
    const res = await NotificationGVDCAPI.GetNotificationCount();
    if (res.success) setNotifyCount(res.count);
  };

  const readNotification = async (id_notification: number) => {
    const res = await NotificationGVDCAPI.ReadNotificationTrue({ id_notification: id_notification });
    if (res.success) {
      loadCount();
      loadList();
    }
  };

  const loadList = async () => {
    const res = await NotificationGVDCAPI.GetNotificationList();
    if (res.success) setNotifyList(res.data);
  };
  const normalizeType = (type: string = "") =>
    type.toString().trim().toLowerCase();

  const getColorByType = (type: string) => {
    const t = normalizeType(type);

    switch (t) {
      case "request_edit_syllabus":
        return "#3b82f6";

      case "permission_write_course_syllabus":
        return "#6366f1";

      case "approve_syllabus":
        return "#22c55e";

      case "refund_syllabus":
        return "#fb923c";

      case "remove_write_course_syllabus":
        return "#ef4444";

      case "accept_permission_syllabus":
        return "#2563eb";

      case "cancer_request_syllabus":
        return "#ef4444";

      case "remove_permission_syllabus":
        return "#facc15";

      default:
        return "#94a3b8";
    }
  };


  useEffect(() => {
    loadCount();
  }, []);
  useEffect(() => {
    loadCount();
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "notification_reload") {
        loadCount();
        loadList();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handleCustom = () => {
      loadCount();
      loadList();
    };

    window.addEventListener("notification_reload", handleCustom);
    return () => window.removeEventListener("notification_reload", handleCustom);
  }, []);


  return (
    <div className="header">
      <div className="logo logo-dark">
        <Link to="/ctdt" className="logo-link">
          <img
            src="/src/assets/images/logo/Icon.png"
            style={{ width: "66px" }}
            alt="Logo"
          />
          <img
            className="logo-fold"
            src="/src/assets/images/logo/Icon.png"
            style={{ width: "66px" }}
            alt="Logo"
          />
        </Link>
      </div>

      <div className="logo logo-white">
        <a href="/">
          <img
            src="/src/assets/images/logo/Icon.png"
            style={{ width: "63px" }}
            alt="Logo"
          />
          <img
            className="logo-fold"
            src="/src/assets/images/logo/Icon.png"
            style={{ width: "63px" }}
            alt="Logo"
          />
        </a>
      </div>

      <div className="nav-wrap">
        <ul className="nav-left">
          <li className="desktop-toggle">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className="anticon" />
            </a>
          </li>
          <li className="mobile-toggle">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className="anticon" />
            </a>
          </li>
        </ul>

        <ul className="nav-right">
          <li
            className={
              "dropdown dropdown-animated scale-left" +
              (isDropdownOpen ? " show" : "")
            }
          >
            {/* Nút chuông */}
            <a href="#" onClick={toggleDropdown}>
              <i
                className={
                  "anticon anticon-bell notification-badge " +
                  (notifyCount > 0 ? "ceo-bell" : "")
                }
              />

              {notifyCount > 0 && (
                <span
                  className="badge badge-danger ceo-badge"
                  style={{ marginLeft: 6 }}
                >
                  {notifyCount > 5 ? "5+" : notifyCount}
                </span>
              )}
            </a>


            <div
              className={
                "dropdown-menu pop-notification" +
                (isDropdownOpen ? " show" : "")
              }
            >
              <div className="p-v-15 p-h-25 border-bottom d-flex justify-content-between align-items-center">
                <p className="text-dark font-weight-semibold m-b-0">
                  <i className="anticon anticon-bell" />
                  <span className="m-l-10">Thông báo từ chương trình</span>
                </p>
                <Link to="/gv-de-cuong/xem-tat-ca-thong-bao" className="btn-sm btn-default btn">
                  <small>Xem tất cả</small>
                </Link>
              </div>

              <div className="relative">
                <div className="overflow-y-auto relative scrollable" style={{ maxHeight: 300 }}>
                  {notifyList.length === 0 && (
                    <div className="p-15 text-center text-muted">Không có thông báo</div>
                  )}

                  {notifyList.map((item: any, index: number) => {
                    const isRead = item.is_read === true;

                    return (
                      <a
                        key={index}
                        href={item.link ?? "#"}
                        onClick={(e) => {
                          e.preventDefault();
                          readNotification(item.id_notification);
                        }}
                        className="dropdown-item d-block p-15 border-bottom"
                        style={{
                          borderLeft: `4px solid ${getColorByType(item.type)}`,
                          paddingLeft: "12px",
                          background: isRead ? "transparent" : "#f5f7ff",
                          opacity: isRead ? 0.6 : 1,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        <p
                          className="m-b-5 text-dark"
                          style={{
                            fontWeight: isRead ? 500 : 700,
                            lineHeight: "1.3"
                          }}
                        >
                          {item.title}
                        </p>

                        <p
                          className="m-b-5 text-muted"
                          style={{
                            fontSize: "13px",
                            whiteSpace: "normal",
                            maxWidth: "260px"
                          }}
                        >
                          {item.message}
                        </p>

                        <p className="m-b-0">
                          <small style={{ color: "#6b7280" }}>
                            {unixTimestampToDate(item.create_time)}
                          </small>
                        </p>
                      </a>
                    );
                  })}


                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default GVDeCuongHeaderLayout;
