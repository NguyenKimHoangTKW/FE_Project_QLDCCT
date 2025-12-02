import { NavLink } from "react-router-dom";
import { Logout } from "../../ui/Logout";

function AdminSideNav() {

  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">
          <li>
            <NavLink
              to="/admin/quan-li-can-bo-vien-chuc"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
             👤 Quản lý Danh sách Cán bộ viên chức
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/quan-li-danh-sach-don-vi"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              🏢 Quản lý Danh sách đơn vị
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/quan-li-danh-sach-chuong-trinh-dao-tao"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              🎓 Quản lý Danh sách chương trình đào tạo
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/quan-li-danh-sach-user"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              🔐 Quản lý Danh sách tài khoản hệ thống
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/quan-li-danh-sach-nhom-hoc-phan"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
             🧩 Quản lý Danh sách nhóm học phần
            </NavLink>
          </li>

          <li>
            <NavLink
              to="#"
              onClick={Logout}
            >
              <span className="title">🔒 Đăng xuất</span>
            </NavLink>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default AdminSideNav;
