import { NavLink } from "react-router-dom";
import { Logout } from "../../ui/Logout";

function AdminSideNav() {

  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">

          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="#">
              <span className="title">🛠️ Quản lý Chức năng hệ thống</span>
              <i className="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-danh-sach-don-vi"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  🏢 Quản lý Danh sách đơn vị
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-danh-sach-chuong-trinh-dao-tao"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  🎓 Quản lý Danh sách chương trình đào tạo
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="#">
              <span className="title">🎯 Quản lý Chuẩn đầu ra</span>
              <i className="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-ma-tran-dong-gop"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  💰 Quản lý Ma trận đóng góp
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-danh-sach-chuan-dau-ra-chuong-trinh-dao-tao"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  🎯 Quản lý Danh sách chuẩn đầu ra chương trình đào tạo
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-thong-ke-nhap-lieu-clo"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  📊 Quản lý Thống kê nhập liệu CLO
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="#">
              <span className="title">🎓🧑‍💼 Quản lý đào tạo & nhân sự</span>
              <i className="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-can-bo-vien-chuc"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  👤 Quản lý Danh sách Cán bộ viên chức
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="#">
              <span className="title">🎓🧑‍💼 Quản lý học phần và nhóm học phần</span>
              <i className="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-danh-sach-nhom-hoc-phan"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  🧩 Quản lý Danh sách nhóm học phần
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/quan-li-danh-sach-mon-hoc"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  📚 Quản lý Danh sách môn học
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/admin/quan-li-danh-sach-user"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              🔐 Quản lý Danh sách tài khoản hệ thống
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              onClick={Logout}
              to="#"
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
