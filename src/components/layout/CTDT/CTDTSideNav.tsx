import { NavLink } from "react-router-dom";
import { Logout } from "../../ui/Logout";

function CTDTSideNav() {
  return (
    <div className="side-nav">
      <div className="side-nav-inner">
        <ul className="side-nav-menu scrollable">

          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="#">
              <span className="title">🛠️ Quản lý Chức năng thuộc Chương trình đào tạo</span>
              <i className="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <NavLink
                  to="/ctdt/danh-sach-mon-hoc"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    📚 Quản lý danh sách môn học thuộc CTĐT
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/ctdt/danh-sach-can-bo-vien-chuc"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    👨‍🏫 Quản lý danh sách cán bộ viên chức thuộc CTĐT
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/ctdt/danh-sach-lop"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    🏫 Quản lý danh sách lớp
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/ctdt/danh-sach-sinh-vien"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    👨‍🎓 Quản lý danh sách sinh viên
                  </span>
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
                  to="/ctdt/chuan-dau-ra-ctdt"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    🎯 Quản lý chuẩn đầu ra CTĐT
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/ctdt/ma-tran-dong-gop-ctdt"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    📊 Ma trận đóng góp CTĐT
                  </span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/ctdt/thong-ke-nhap-lieu-plo-ctdt"
                  className={({ isActive }) => isActive ? "active-menu" : ""}
                >
                  <span className="title">
                    📊 Thống kê nhập liệu CLO CTĐT
                  </span>
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/ctdt/danh-sach-de-cuong-can-duyet"
              className={({ isActive }) => isActive ? "active-menu" : ""}
            >
              <span className="title">
                📝 Quản lý danh sách đề cương cần duyệt
              </span>
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

export default CTDTSideNav;
