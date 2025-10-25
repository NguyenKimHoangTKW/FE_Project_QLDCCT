import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logout } from "../../ui/Logout";



function AdminSideNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li className={`nav-item dropdown ${open ? "open" : ""}`}>
            <Link
              href="#"
              className="dropdown-toggle"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
            >
              <span className="icon-holder">
                <i className="anticon anticon-lock" />
              </span>
              <span className="title">Chức năng</span>
              <span className="arrow">
                <i className="arrow-icon" />
              </span>
            </Link>

            <ul className="dropdown-menu">
              <li>
                <NavLink to="/admin/quan-li-can-bo-vien-chuc">
                  Quản lý Danh sách Cán bộ viên chức
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/quan-li-danh-sach-nam">
                  Quản lý Danh sách năm
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/quan-li-danh-sach-don-vi">
                  Quản lý Danh sách đơn vị
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/quan-li-danh-sach-chuong-trinh-dao-tao">
                  Quản lý Danh sách chương trình đào tạo
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/quan-li-danh-sach-user">
                  Quản lý Danh sách tài khoản hệ thống
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/quan-li-danh-sach-nhom-hoc-phan">
                  Quản lý Danh sách nhóm học phần
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <Link className="dropdown-toggle" onClick={Logout}>
              <span className="icon-holder">
                <i className="anticon anticon-logout" />
              </span>
              <span className="title">Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSideNav;
