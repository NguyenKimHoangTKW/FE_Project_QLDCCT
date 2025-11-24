import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Logout } from "../../ui/Logout";

function AdminSideNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">

          <li className={`nav-item dropdown ${open ? "open" : ""}`}>
            <button
              className="dropdown-toggle"
              onClick={() => setOpen(!open)}
              style={{ background: "transparent", border: "none", padding: 0 }}
            >
              <span className="icon-holder">
                <i className="anticon anticon-lock" />
              </span>

              <span className="title">Chức năng</span>

              <span className="arrow">
                <i className="arrow-icon" />
              </span>
            </button>

            <ul className="dropdown-menu">

              <li>
                <NavLink 
                  to="/admin/quan-li-can-bo-vien-chuc"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  Quản lý Danh sách Cán bộ viên chức
                </NavLink>
              </li>

              <li>
                <NavLink 
                  to="/admin/quan-li-danh-sach-nam"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  Quản lý Danh sách năm
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/quan-li-danh-sach-don-vi"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  Quản lý Danh sách đơn vị
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/quan-li-danh-sach-chuong-trinh-dao-tao"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  Quản lý Danh sách chương trình đào tạo
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/quan-li-danh-sach-user"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  Quản lý Danh sách tài khoản hệ thống
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/quan-li-danh-sach-nhom-hoc-phan"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  Quản lý Danh sách nhóm học phần
                </NavLink>
              </li>

            </ul>

          </li>

          <li>
            <NavLink to="#" onClick={Logout}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Đăng xuất</span>
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default AdminSideNav;
