import { NavLink } from "react-router-dom";
import { useState } from "react";

function AdminSideNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li className={`nav-item dropdown ${open ? "open" : ""}`}>
            <a
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
              <span className="title">Authentication</span>
              <span className="arrow">
                <i className="arrow-icon" />
              </span>
            </a>

            <ul className="dropdown-menu">
              <li>
                <NavLink to="/admin/quan-li-can-bo-vien-chuc">Quản lý Danh sách Cán bộ viên chức</NavLink>
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
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSideNav;
